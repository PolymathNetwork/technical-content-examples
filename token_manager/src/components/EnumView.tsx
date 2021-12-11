import { Component } from "react"
import { OnRequirementChangedCreator } from "../types"
import { BasicProps } from "./BasicProps"

export function presentEnumOptions<EnumType>(theEnum: EnumType): JSX.Element[] {
    const selects: JSX.Element[] = []
    for (const element in theEnum) selects.push(<option value={element} key={element}>{element}</option>)
    return selects
}

export interface EnumSelectViewProps<EnumType> extends BasicProps {
    theEnum: any,
    defaultValue: EnumType,
    onChangeCreator: OnRequirementChangedCreator | undefined,
}

export class EnumSelectView<EnumType> extends Component<EnumSelectViewProps<EnumType>> {
    render() {
        const { theEnum, defaultValue, onChangeCreator, location, canManipulate } = this.props
        return <select
            defaultValue={defaultValue.toString()}
            onChange={typeof onChangeCreator === "undefined" ? undefined : onChangeCreator(location, false)}
            disabled={!canManipulate}>
            {presentEnumOptions(theEnum)}
        </select>
    }
}
