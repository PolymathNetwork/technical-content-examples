import { DistributionWithDetails, DividendDistribution } from "@polymathnetwork/polymesh-sdk/types";
import { DividendDistributionInfoJson } from "../../types";
import { fetchCorporateActionInfo } from "../corporateActions/CorporateActionHandlers";
import { fetchPortfolioInfoJson } from "../portfolios/PortfolioHandlers";

export type OnDividendDistributionCreated = (action: DividendDistribution) => void

export const fetchDividendDistributionInfo = async (action: DividendDistribution): Promise<DividendDistributionInfoJson> => {
  return {
    ...(await fetchCorporateActionInfo(action)),
    current: action,
    origin: await fetchPortfolioInfoJson(action.origin),
    exists: await action.exists(),
    details: await action.details(),
    participants: await action.getParticipants(),
  }
}

export const fetchDividendDistributionInfos = async (actions: DividendDistribution[]): Promise<DividendDistributionInfoJson[]> =>
  Promise.all(actions.map(fetchDividendDistributionInfo))

export const fetchDividendDistributionInfoWithDetails = async (action: DistributionWithDetails): Promise<DividendDistributionInfoJson> => {
  return {
    ...(await fetchCorporateActionInfo(action.distribution)),
    current: action.distribution,
    origin: await fetchPortfolioInfoJson(action.distribution.origin),
    exists: await action.distribution.exists(),
    details: action.details,
    participants: await action.distribution.getParticipants(),
  }
}

export const fetchDividendDistributionInfosWithDetails = async (actions: DistributionWithDetails[]): Promise<DividendDistributionInfoJson[]> =>
  Promise.all(actions.map(fetchDividendDistributionInfoWithDetails))
