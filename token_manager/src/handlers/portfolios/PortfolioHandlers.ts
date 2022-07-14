import { Identity } from "@polymathnetwork/polymesh-sdk/internal";
import {
    DefaultPortfolio,
    EventIdentifier,
    NumberedPortfolio,
} from "@polymathnetwork/polymesh-sdk/types";
import { isNumberedPortfolio, PortfolioInfoJson } from "../../types";

export type OnPortfolioPicked = (picked: PortfolioInfoJson) => void
export type OnPortfolioInfoChanged = (changed: PortfolioInfoJson) => void
export type OnPortfolioInfosChanged = (portfolio: PortfolioInfoJson[]) => void

export async function fetchPortfolioInfoJson(portfolio: DefaultPortfolio | NumberedPortfolio): Promise<PortfolioInfoJson> {
    const
        [
            createdAt,
            exists,
            custodian,
            name,
        ]: [
                EventIdentifier,
                boolean,
                Identity,
                string,
            ] = await Promise.all([
                isNumberedPortfolio(portfolio) ? portfolio.createdAt() : null,
                portfolio.exists(),
                portfolio.getCustodian(),
                isNumberedPortfolio(portfolio) ? portfolio.getName() : null,
            ])
    return {
        original: portfolio,
        createdAt: createdAt,
        exists: exists,
        custodian: custodian.did,
        name: name,
    }
}

export async function fetchPortfolioInfoJsons(portfolios: (DefaultPortfolio | NumberedPortfolio)[]): Promise<PortfolioInfoJson[]> {
    return Promise.all(portfolios.map(fetchPortfolioInfoJson))
}

// Should be part of SDK. Remove when it is in.
export interface NewPortfolioParams {
    name: string
}