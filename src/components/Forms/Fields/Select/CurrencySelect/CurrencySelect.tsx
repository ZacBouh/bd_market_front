import MenuItem from "@mui/material/MenuItem"
import Select, { SelectProps } from "@mui/material/Select"
import { useEffect, useState } from "react"

type CurrencySelectProps = {
    onChange?: (condition: { value: AcceptedCurrency; label: string }) => void
    defaultValue?: AcceptedCurrency
} & Omit<SelectProps<AcceptedCurrency | "">, "onChange" | "value" | "defaultValue">

export const CurrencySelectOptions: Record<AcceptedCurrency, string> = {
    euro: "€",
}

const CurrencySelect = (props: CurrencySelectProps) => {
    const { onChange, defaultValue, ...selectProps } = props
    const resolvedDefaultValue = defaultValue ?? "euro"
    const [state, setState] = useState<{ value: AcceptedCurrency | ""; label: string | "" }>(() => ({
        value: resolvedDefaultValue,
        label: CurrencySelectOptions[resolvedDefaultValue],
    }))

    useEffect(() => {
        setState({ value: resolvedDefaultValue, label: CurrencySelectOptions[resolvedDefaultValue] })
    }, [resolvedDefaultValue])

    return (
        <Select<AcceptedCurrency | "">
            value={state.value ?? ""}
            displayEmpty
            renderValue={(selected) => {
                if (typeof selected === "string" && selected !== "") {
                    return CurrencySelectOptions[selected as AcceptedCurrency]
                }
                return undefined
            }}
            onChange={(event) => {
                const selectedValue = event.target.value as AcceptedCurrency
                const newState = { value: selectedValue, label: CurrencySelectOptions[selectedValue] }
                setState(newState)
                onChange && onChange(newState)
            }}
            {...selectProps}
        >
            <MenuItem disabled value="">
                Currency
            </MenuItem>
            {Object.keys(CurrencySelectOptions).map((option) => (
                <MenuItem key={option} value={option}>
                    {CurrencySelectOptions[option as AcceptedCurrency]}
                </MenuItem>
            ))}
        </Select>
    )
}

export default CurrencySelect
