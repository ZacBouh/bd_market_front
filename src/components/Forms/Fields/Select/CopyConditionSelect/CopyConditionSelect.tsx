import MenuItem from "@mui/material/MenuItem"
import Select, { SelectProps } from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import { useState } from "react"

type CopyConditionSelectProps = {
    onChange?: (condition: {value: CopyCondition, label: string}) => void
} & Omit<SelectProps, 'onChange'>

export const CopyConditionOptions : Record<CopyCondition, string> = {
    'mint' : 'Mint' ,
    'near_mint': 'Near mint',
    'very_fine': 'Very fine',
    'fine': 'Fine',
    'very_good': 'Very good',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor' ,
}



const CopyConditionSelect = (props : CopyConditionSelectProps) => {
    const [state, setState] = useState<{value: CopyCondition | '', label: string | ''}>({value: '', label: ''})
    const {onChange}= props
    return <Select 
        value={state.value ?? ''}
        displayEmpty
        renderValue={(selected) => {
            if(selected as CopyCondition | '' !== '') return CopyConditionOptions[selected]
            return <Typography sx={{color: 'text.secondary'}} >Select Condition</Typography>
        }}
        onChange={(event)=> {
            const selectedValue = event.target.value as CopyCondition
            const newState = {value: selectedValue, label: CopyConditionOptions[selectedValue] }
            setState(newState)
            onChange && onChange(newState)
        } }
    >
        <MenuItem disabled value='' >Condition</MenuItem>
        {Object.keys(CopyConditionOptions).map(option =>(<MenuItem
            key={option}
            value={option}
          >
            {CopyConditionOptions[option as CopyCondition]}
          </MenuItem>))}    
    </Select>
}

export default CopyConditionSelect