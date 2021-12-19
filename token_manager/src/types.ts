import countries from "i18n-iso-countries"
import {
    CddClaim,
    CheckpointWithData,
    Claim,
    ClaimData,
    ClaimTarget,
    ClaimType,
    Condition,
    ConditionType,
    CountryCode,
    DefaultPortfolio,
    DistributionParticipant,
    DividendDistributionDetails,
    EventIdentifier,
    GroupPermissions,
    Identity,
    IdentityCondition,
    InvestorUniquenessClaim,
    InvestorUniquenessV2Claim,
    NumberedPortfolio,
    Requirement,
    ScheduleWithDetails,
    Scope,
    ScopeType,
    SecurityToken,
    SecurityTokenDetails,
    TickerReservation,
    TickerReservationDetails,
    TokenIdentifier,
    UnscopedClaim,
} from "@polymathnetwork/polymesh-sdk/types"
import {
    AddInvestorUniquenessClaimParams,
    AuthorizationRequest,
    Checkpoint,
    CheckpointSchedule,
    ConfigureDividendDistributionParams,
    CorporateAction,
    CustomPermissionGroup,
    DividendDistribution,
    KnownPermissionGroup,
    ModifyCorporateActionsAgentParams,
} from "@polymathnetwork/polymesh-sdk/internal"
import { BigNumber, Polymesh } from "@polymathnetwork/polymesh-sdk"
import { ScopeClaimProof } from "@polymathnetwork/polymesh-sdk/types/internal"
import { Requirements } from "@polymathnetwork/polymesh-sdk/api/entities/SecurityToken/Compliance/Requirements"
countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

export declare type CountryInfo = {
    value: string
    label: string
}

export function getCountryList(): CountryInfo[] {
    return Object.values(CountryCode).sort().map((code: string) => {
        return {
            "value": code,
            "label": countries.getName(code.toUpperCase(), "en") || code,
        }
    })
}

export type ApiGetter = () => Promise<Polymesh>
export type MyInfoPath = (string | number)[]
export type OnValueChangedCreator = (path: MyInfoPath, deep: boolean, valueProcessor?: (e) => Promise<any>) => (e) => Promise<void>
export type OnRequirementChangedDateCreator = (path: MyInfoPath) => (e) => Promise<void>
export type OnRequirementChangedIdentityCreator = (path: MyInfoPath) => (e) => Promise<void>
export type FetchAndAddToPath<Type> = (path: MyInfoPath, additionKey: Type) => Promise<void>
export type FetchDefaultAndAddToPath = (path: MyInfoPath) => Promise<void>
export type SimpleAction = () => Promise<void>
export type Getter<ReturnType> = () => Promise<ReturnType>

export type MyInfoJson = {
    ticker: string,
    myDid: string,
    myAddress: string,
    myTickers: string[],
    reservation: ReservationInfoJson,
    token: TokenInfoJson,
    permissions: PermissionsInfoJson,
    requirements: RequirementsInfoJson,
    authorisations: AuthorisationInfoJson,
    portfolios: PortfoliosInfoJson,
    attestations: AttestationsInfoJson,
    checkpoints: CheckpointsInfoJson,
    corporateActions: CorporateActionsInfoJson,
}

export type ReservationInfoJson = {
    current: TickerReservation,
    details: TickerReservationDetails,
}

export function getEmptyReservation(): ReservationInfoJson {
    return {
        current: null,
        details: null,
    }
}

export type TokenInfoJson = {
    current: SecurityToken
    createdAt: EventIdentifier | null
    details: SecurityTokenDetails
    currentFundingRound: string
    tokenIdentifiers: TokenIdentifier[]
}

export function getEmptyTokenInfoJson(): TokenInfoJson {
    return {
        current: null as SecurityToken,
        details: null as SecurityTokenDetails,
        createdAt: null as EventIdentifier,
        currentFundingRound: "",
        tokenIdentifiers: [],
    }
}

export type KnownPermissionGroupInfoJson = {
    current: KnownPermissionGroup,
    permissions: GroupPermissions,
    exists: boolean,
}

export type CustomPermissionGroupInfoJson = {
    current: CustomPermissionGroup,
    permissions: GroupPermissions,
    exists: boolean,
}

export type PermissionGroupsInfo = {
    known: KnownPermissionGroup[],
    custom: CustomPermissionGroup[],
}

export type PermissionGroupsInfoJson = {
    known: KnownPermissionGroupInfoJson[],
    custom: CustomPermissionGroupInfoJson[],
}

export type AgentInfoJson = {
    current: Identity,
    group: KnownPermissionGroupInfoJson | CustomPermissionGroupInfoJson
}

export type AgentsInfoJson = {
    current: AgentInfoJson[],
}

export type PermissionsInfoJson = {
    groups: PermissionGroupsInfoJson,
    agents: AgentsInfoJson,
}

export type RequirementsInfoJson = {
    original: Requirements | null
    current: Requirement[],
    arePaused: boolean,
    canManipulate: boolean,
}

export function getEmptyRequirements(): RequirementsInfoJson {
    return {
        original: null,
        current: [] as Requirement[],
        arePaused: true as boolean,
        canManipulate: false as boolean,
    }
}

export type AuthorisationInfoJson = {
    current: AuthorizationRequest[],
}

export type PortfoliosInfoJson = {
    myDetails: PortfolioInfoJson[],
}

export type PortfolioInfoJson = {
    original: DefaultPortfolio | NumberedPortfolio,
    name: string
    exists: boolean
    custodian: string
    createdAt: EventIdentifier | null
}

export type AttestationsInfoJson = {
    current: ClaimData<Claim>[]
    otherTarget: string
    toAdd: {
        target: string
        expiry: Date | null
        claim: Claim
    },
    uniquenessToAdd: AddInvestorUniquenessClaimParams,
}

export type CheckpointsInfoJson = {
    current: Checkpoint[],
    details: CheckpointInfoJson[],
    currentSchedules: CheckpointSchedule[],
    scheduleDetails: CheckpointScheduleDetailsInfoJson[],
}

export function getEmptyCheckpointsInfoJson(): CheckpointsInfoJson {
    return {
        current: [] as Checkpoint[],
        details: [] as CheckpointInfoJson[],
        currentSchedules: [] as CheckpointSchedule[],
        scheduleDetails: [] as CheckpointScheduleDetailsInfoJson[],
    }
}

export type CheckpointInfoJson = {
    checkpoint: Checkpoint,
    exists: boolean,
    totalSupply: BigNumber,
    createdAt: Date,
}

export type CheckpointScheduleInfoJson = {
    schedule: CheckpointSchedule,
    createdCheckpoints: CheckpointInfoJson[],
    exists: boolean,
}

export type CheckpointScheduleDetailsInfoJson = CheckpointScheduleInfoJson & {
    remainingCheckpoints: number,
    nextCheckpointDate: Date,
}

export type CorporateActionsInfoJson = {
    distributions: DistributionsInfoJson,
    agent: Identity,
    newAgent: ModifyCorporateActionsAgentParams,
}

export type DistributionsInfoJson = {
    dividends: DividendDistributionInfoJson[],
    newDividend: ConfigureDividendDistributionParams,
}

export type CorporateActionInfoJson = {
    current: CorporateAction,
    exists: boolean,
    checkpoint: CheckpointInfoJson | null,
    checkpointSchedule: CheckpointScheduleInfoJson | null,
}

export type DividendDistributionInfoJson = Omit<CorporateActionInfoJson, "current"> & {
    current: DividendDistribution,
    origin: PortfolioInfoJson,
    details: DividendDistributionDetails,
    participants: DistributionParticipant[],
}

export function getEmptyPermissionGroupsInfoJson(): PermissionGroupsInfoJson {
    return {
        known: [] as KnownPermissionGroupInfoJson[],
        custom: [] as CustomPermissionGroupInfoJson[],
    }
}

export function getEmptyAgentsInfo(): AgentsInfoJson {
    return {
        current: [] as AgentInfoJson[],
    }
}

export function getEmptyPermissionsInfoJson(): PermissionsInfoJson {
    return {
        groups: getEmptyPermissionGroupsInfoJson() as PermissionGroupsInfoJson,
        agents: getEmptyAgentsInfo() as AgentsInfoJson,
    }
}

export function getEmptyMyInfo(): MyInfoJson {
    return {
        ticker: "" as string,
        myDid: "" as string,
        myAddress: "" as string,
        myTickers: [] as string[],
        reservation: getEmptyReservation(),
        token: getEmptyTokenInfoJson(),
        permissions: getEmptyPermissionsInfoJson(),
        requirements: getEmptyRequirements(),
        authorisations: {
            current: [] as AuthorizationRequest[],
        } as AuthorisationInfoJson,
        attestations: {
            current: [] as ClaimData<Claim>[],
            otherTarget: "" as string,
            toAdd: {
                target: "" as string,
                expiry: null as Date | null,
                claim: {
                    type: ClaimType.NoData,
                } as Claim,
            } as ClaimTarget,
            uniquenessToAdd: {
                scope: {
                    type: ScopeType.Ticker,
                    value: "" as string,
                } as Scope,
                cddId: "" as string,
                proof: "" as string,
                scopeId: "" as string,
                expiry: null as Date | null,
            } as AddInvestorUniquenessClaimParams,
        } as AttestationsInfoJson,
        portfolios: {
            myDetails: [] as PortfolioInfoJson[],
        },
        checkpoints: getEmptyCheckpointsInfoJson(),
        corporateActions: {
            distributions: {
                dividends: [] as DividendDistributionInfoJson[],
                newDividend: {
                    declarationDate: new Date(),
                    checkpoint: null as Checkpoint,
                    description: "" as string,
                    taxWithholdings: [],
                    originPortfolio: null,
                    currency: "",
                    perShare: new BigNumber(0),
                    maxAmount: new BigNumber(0),
                    paymentDate: new Date,
                    expiryDate: null,
                },
            },
            agent: null as Identity,
            newAgent: {
                target: "" as string | Identity,
                requestExpiry: null as Date | null,
            } as ModifyCorporateActionsAgentParams
        },
    }
}

export interface HasFetchTimer {
    fetchTimer: NodeJS.Timeout | null
}

export const isIdentity = (identity: string | Identity): identity is Identity => typeof (identity as Identity).did !== "undefined"
export const isKnownPermissionGroup = (group: KnownPermissionGroup | CustomPermissionGroup): group is KnownPermissionGroup => typeof (group as KnownPermissionGroup).type !== "undefined"
export const isCustomPermissionGroup = (group: KnownPermissionGroup | CustomPermissionGroup): group is CustomPermissionGroup => typeof (group as CustomPermissionGroup).id !== "undefined"
export const isNumberedPortfolio = (portfolio: DefaultPortfolio | NumberedPortfolio): portfolio is NumberedPortfolio => typeof (portfolio as NumberedPortfolio).id !== "undefined"
export const isIdentityCondition = (condition: Condition): condition is IdentityCondition => (condition as IdentityCondition).type === ConditionType.IsIdentity
export const isUnScopedClaim = (claim: Claim): claim is UnscopedClaim => isCddClaim(claim) || (claim as UnscopedClaim).type === ClaimType.NoData
export const isScopeClaimProof = (claim: string | ScopeClaimProof): claim is ScopeClaimProof => typeof (claim as ScopeClaimProof).proofScopeIdCddIdMatch !== "undefined"
export const isInvestorUniquenessClaim = (claim: Claim): claim is InvestorUniquenessClaim => (claim as InvestorUniquenessClaim).type === ClaimType.InvestorUniqueness
export const isInvestorUniquenessV2Claim = (claim: Claim): claim is InvestorUniquenessV2Claim => (claim as InvestorUniquenessV2Claim).type === ClaimType.InvestorUniquenessV2
export const isJurisdictionClaim = (claim: Claim): claim is JurisdictionClaim => (claim as JurisdictionClaim).type === ClaimType.Jurisdiction
export const isCddClaim = (claim: Claim): claim is CddClaim => (claim as CddClaim).type === ClaimType.CustomerDueDiligence
export const isNoDataClaim = (claim: Claim): claim is NoDataClaim => (claim as NoDataClaim).type === ClaimType.NoData
export const isClaimData = (claimData: ClaimData | ClaimTarget): claimData is ClaimData => typeof (claimData as ClaimData).issuedAt !== "undefined"
export const isCheckpointWithData = (checkpointWith: CheckpointWithData | Checkpoint): checkpointWith is CheckpointWithData => typeof (checkpointWith as CheckpointWithData).checkpoint !== "undefined"
export const isCheckpointSchedule = (checkpoint: Checkpoint | CheckpointSchedule): checkpoint is CheckpointSchedule => typeof (checkpoint as CheckpointSchedule).period !== "undefined"
export const isScheduleWithDetails = (schedule: CheckpointSchedule | ScheduleWithDetails): schedule is ScheduleWithDetails => typeof (schedule as ScheduleWithDetails).schedule !== "undefined"

export declare type JurisdictionClaim = {
    type: ClaimType.Jurisdiction
    code: CountryCode
    scope: Scope
}
export declare type NoDataClaim = {
    type: ClaimType.NoData
}

/**
 * For type safety. See https://schneidenbach.gitbooks.io/typescript-cookbook/content/nameof-operator.html
 */
export const nameofFactory = <T>() => (name: keyof T) => name;

/**
 * For exhaustiveness via compiler:
 * https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript
 */
export const assertUnreachable = (x: never): never => { throw new Error("Didn't expect to get here") }