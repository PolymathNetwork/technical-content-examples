import { exists as existsAsync, promises as fsPromises } from "fs"
import { promisify } from "util"
import {
    FullSettlementInfo,
    IFullSettlementInfo,
    IPublishedSettlementInfo,
    PublishedSettlementInfo,
} from "./settlementInfo"
import { ISettlementDb, UnknownSettlementError } from "./settlementDb"

const exists = promisify(existsAsync)

const getDb = async function(dbPath: string): Promise<JSON> {
    if (!(await exists(dbPath))) {
        await saveDb(dbPath, JSON.parse("{}"))
    }
    return JSON.parse((await fsPromises.readFile(dbPath)).toString())
}
const saveDb = async function(dbPath: string,db: JSON): Promise<void> {
    return fsPromises.writeFile(dbPath, JSON.stringify(db, null, 4))
}

export class SettlementDbFs implements ISettlementDb {

    constructor(public dbPath: string) {
        if (typeof dbPath !== "string") throw new Error("Settlement dbPath must be a string")
    }

    async getSettlements(): Promise<IFullSettlementInfo[]> {
        const db: JSON = (await getDb(this.dbPath))
        return Object.entries(db)
            .map(([id, settlement]) => new FullSettlementInfo({ ...settlement, id }))
            .reduce(
                (list, settlementInfo) => [ ...list, settlementInfo ],
                [])
    }

    async getSettlementInfoById(id: string): Promise<IPublishedSettlementInfo> {
        const info: JSON = (await getDb(this.dbPath))[id]
        if (typeof info === "undefined") throw new UnknownSettlementError(id)
        return new PublishedSettlementInfo(info)
    }

    async setSettlementInfo(id: string, info: IPublishedSettlementInfo): Promise<void> {
        const db:JSON  = await getDb(this.dbPath)
        db[id] = info.toJSON()
        return saveDb(this.dbPath, db)
    }

}
