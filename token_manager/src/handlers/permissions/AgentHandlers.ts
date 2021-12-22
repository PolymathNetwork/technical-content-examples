import { CustomPermissionGroup } from "@polymathnetwork/polymesh-sdk/api/entities/CustomPermissionGroup"
import { KnownPermissionGroup } from "@polymathnetwork/polymesh-sdk/api/entities/KnownPermissionGroup"
import { InviteExternalAgentParams } from "@polymathnetwork/polymesh-sdk/api/procedures/inviteExternalAgent"
import { AssetTx } from "@polymathnetwork/polymesh-sdk/polkadot/types"
import { GroupPermissions, Identity, ModuleName, PermissionGroupType, TxTag } from "@polymathnetwork/polymesh-sdk/types"
import { isCustomPermissionGroup, isKnownPermissionGroup, PermissionGroupInfoJson } from "../../types"

export type OnAgentChanged = (agent: Identity) => void
export type OnInviteAgent = (params: InviteExternalAgentParams) => Promise<void>

export const patternAgentTags: { [key: string]: (TxTag | ModuleName)[] } = {
    issuance: [
        AssetTx.ControllerTransfer,
        AssetTx.Issue,
        AssetTx.Redeem,
        ModuleName.Sto
    ]
}

export const isOwner = (group: KnownPermissionGroup | CustomPermissionGroup): boolean =>
    isKnownPermissionGroup(group) && group.type === PermissionGroupType.Full

export const isIssuanceAgentGroup = (group: PermissionGroupInfoJson<KnownPermissionGroup | CustomPermissionGroup>): boolean =>
    (isKnownPermissionGroup(group.current) && group.current.type === PermissionGroupType.PolymeshV1Pia) ||
    (isCustomPermissionGroup(group.current) && areIssuanceAgentGroupPermissions(group.permissions))

export const areIssuanceAgentGroupPermissions = (permissions: GroupPermissions): boolean =>
    new Set(permissions.transactions
        ?.values
        ?.map((value: TxTag | ModuleName) => patternAgentTags.issuance.indexOf(value)))
        .size === patternAgentTags.issuance.length
