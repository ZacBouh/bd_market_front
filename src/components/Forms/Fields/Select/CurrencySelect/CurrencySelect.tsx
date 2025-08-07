import MenuItem from "@mui/material/MenuItem"
import Select, { SelectProps } from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import { useState } from "react"

type CurrencySelectProps ={
    onChange?: (condition: {value: AcceptedCurrency, label: string}) => void
    defaultValue?: AcceptedCurrency
} & Omit<SelectProps, 'onChange'>


export const CurrencySelectOptions : Record<AcceptedCurrency, string> = {
    euro: '€'
}

const CurrencySelect = (props : CurrencySelectProps) => {
    const {onChange}= props
    const defaultValue = props.defaultValue ?? 'euro'
    const [state, setState] = useState<{value: AcceptedCurrency | '', label: string | ''}>({value: defaultValue, label: CurrencySelectOptions[defaultValue]})
    return <Select<AcceptedCurrency| '' > 
        value={state.value ?? ''}
        displayEmpty
        renderValue={(selected) => {
            if(selected !== '') return CurrencySelectOptions[selected]
        }}
        onChange={(event)=> {
            const selectedValue = event.target.value as AcceptedCurrency
            const newState = {value: selectedValue, label: CurrencySelectOptions[selectedValue] }
            setState(newState)
            onChange && onChange(newState)
        } }
    >
        <MenuItem disabled value='' >Currency</MenuItem>
        {Object.keys(CurrencySelectOptions).map(option =>(<MenuItem
            key={option}
            value={option}
          >
            {CurrencySelectOptions[option as AcceptedCurrency]}
          </MenuItem>))}    
    </Select>
}

export default CurrencySelect