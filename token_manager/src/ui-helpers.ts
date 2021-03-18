import getConfig from "next/config"
import { Keyring, Polymesh } from "@polymathnetwork/polymesh-sdk"
import { CurrentIdentity } from "@polymathnetwork/polymesh-sdk/types"
import { HasFetchTimer } from "./types"

export async function getBasicPolyWalletApi(setStatus: (content: string) => void): Promise<Polymesh> {
    setStatus("Getting your Polymesh Wallet")
    if (typeof (window || {})["api"] !== "undefined") return (window || {})["api"]
    // Move to top of the file when compilation error no longer present.
    const {
        web3Accounts,
        web3AccountsSubscribe,
        web3Enable,
        web3FromAddress,
        web3ListRpcProviders,
        web3UseRpcProvider
    } = require('@polkadot/extension-dapp')

    const {
        publicRuntimeConfig: {
            appName,
            // TODO remove middlewareLink and middlewareKey if still undesirable
            polymesh: { middlewareLink, middlewareKey }
        }
    } = getConfig()
    const polkaDotExtensions = await web3Enable(appName)
    const polyWallets = polkaDotExtensions.filter(injected => injected.name === "polywallet")
    if (polyWallets.length == 0) {
        setStatus("You need to install the Polymesh Wallet extension")
        throw new Error("No Polymesh Wallet")
    }
    const polyWallet = polyWallets[0]
    setStatus("Verifying network")
    const network = await polyWallet.network.get()
    polyWallet.network.subscribe(() => window.location.reload())
    web3AccountsSubscribe(() => window.location.reload())
    setStatus("Fetching your account")
    const myAccounts = await polyWallet.accounts.get()
    if (myAccounts.length == 0) {
        setStatus("You need to create an account in the Polymesh Wallet extension")
        return
    }
    const myAccount = myAccounts[0]
    const myKeyring = new Keyring()
    myKeyring.addFromAddress(myAccount.address)
    setStatus("Building your API");
    const api: Polymesh = await Polymesh.connect({
        nodeUrl: network.wssUrl,
        keyring: myKeyring,
        signer: polyWallet.signer,
        middleware: {
            link: middlewareLink,
            key: middlewareKey,
        }
    });
    (window || {})["api"] = api
    return (window || {})["api"]
}

export function replaceFetchTimer(where: HasFetchTimer, todo: () => void): NodeJS.Timeout {
    if (where.fetchTimer !== null) clearTimeout(where.fetchTimer)
    const timer: NodeJS.Timeout = setTimeout(todo, 1000)
    where.fetchTimer = timer
    return timer
}

export async function checkboxProcessor(e): Promise<boolean> {
    return Promise.resolve(e.target.checked)
}

export function returnUpdated(previous: object, path: (string | number)[], value: any) {
    if (path.length === 0) return value
    if (typeof path[0] === "number" && Array.isArray(previous)) return [
        ...previous.slice(0, path[0]),
        returnUpdated(previous[path[0]], path.slice(1), value),
        ...previous.slice(path[0] + 1),
    ]
    return {
        ...previous,
        [path[0]]: returnUpdated(previous[path[0]], path.slice(1), value),
    }
}

export function returnUpdatedCreator(path: (string | number)[], value: any) {
    return (previous: object) => returnUpdated(previous, path, value)
}

export function valueFinder(where: object, path: (string | number)[]): any {
    return path.reduce((whereLeft: object, pathBit: string | number) => whereLeft[pathBit], where)
}

export function presentLongHex(hex: string): string {
    const first: string = hex.slice(0, 8)
    const last: string = hex.slice(-6)
    return `${first}...${last}`
}
