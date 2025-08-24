import { Autocomplete, TextField, createFilterOptions } from "@mui/material"
import React, { useState } from "react"

type StandardSelectProps<T extends {label: string}, M extends boolean> =  {
        multiple: M
        defaultValue: M extends true ? T[] : T
        renderOption?: (option:  T ) => React.ReactNode
        onChange?: (value : M extends  true ? T[] : T) => any
        options: T[]
        textInputLabel?: string
        filterOptions?: (options: T[], state: {inputValue: string}) => T[]
    }


const StandardSelect = <T extends {label:string}, M extends boolean>(props : StandardSelectProps<T, M>) => {
    const defaultValue = props.defaultValue
    const [value, setValue] = useState(defaultValue)
    const defaultFilterOptions = createFilterOptions<T>();

    return <Autocomplete<T, boolean>
            value={value}
            getOptionLabel={option => option.label}
            onChange={(_, value) => {
                const newState = value as M extends true ? T[] : T  
                setValue(newState)
                props.onChange && props.onChange(newState)
            }}
            options={props.options}
            multiple={props.multiple}
            renderOption={(liProps, option) => {
                const {key, ...prop} = liProps
                return <li {...prop} key={key} >
                    {props.renderOption ? props.renderOption(option) : option.label}
                </li>
            }}
            renderInput={(params) => <TextField {...params} label={props.textInputLabel}/>}
            isOptionEqualToValue={(a, b) => a.label === b.label}
            filterOptions={props.filterOptions ?? defaultFilterOptions}

        />   
    
}

export default StandardSelect