import { Button, FilterOptionsState, Modal, useTheme } from "@mui/material"
import Autocomplete, { AutocompleteRenderInputParams, createFilterOptions } from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import React, { useState } from "react"

export type StandardAutocompleteState<T> = {
    value: T | null
    modalOpen: boolean
    inputValue: string 
}

export type CreateOptionForm<P> = React.ComponentType<{prePopulatedInputs?: P, handleClose?: (...args:unknown[]) => unknown } & Record<string, unknown>> 

export type StandardAutocompleteProps<T, P = {input: string}> = {
    initialState?: StandardAutocompleteState<T>
    options: T[]
    getOptionLabel: (option : T) => string
    getOptionKey?:  (option: T) => string
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode
    required?: true
    label?: string
    isOptionEqualToValue: (option: T, value: T) => boolean
    filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[]
    onChange: (option: T | null) => unknown 
} & ({
    createOption: NonNullable<Partial<T>> 
    CreateOptionForm: CreateOptionForm<P> 
    getPrepopulatedInput?: (state: StandardAutocompleteState<T>) => P
} | { 
    createOption?: undefined 
    CreateOptionForm?: undefined 
})


/**
 * A standardized autocomplete component.
 *
 * @typeParam T - The type of each option in the autocomplete.
 * @typeParam P - Type of the prepopulated inputs that is passed to the form in charge of creating a new T object
 *
 * @returns A React component that renders an MUI Autocomplete with standard behavior.
 */
const StandardAutocomplete = <T,P = void>(props: StandardAutocompleteProps<T,P>) => {
    const {getOptionLabel,
        getOptionKey,
        createOption,
        isOptionEqualToValue: isOptionsEqualToValue,
        CreateOptionForm
        } = props
    const initialState = props.initialState ?? {value: null, modalOpen: false, inputValue: ''}
    const [state, setState] = useState<StandardAutocompleteState<T>>(initialState)
    const filterOptions = props.filterOptions ?? ((options, filterState) => {
        const filtered = createFilterOptions<T>()(options, filterState)
        if(CreateOptionForm && filtered.length === 0){
            return [createOption as T]
        } 
        return filtered
    })   
    const getPrepopulatedInput = CreateOptionForm && props.getPrepopulatedInput 
    const handleClose = () => setState(state => ({...state, modalOpen: false}))
    const theme = useTheme()
    return <Box>
        <Autocomplete<T>
            value={state.value}
            inputValue={state.inputValue}
            disableClearable={false}
            isOptionEqualToValue={props.isOptionEqualToValue}
            options={props.options}
            getOptionLabel={getOptionLabel}
            getOptionKey={getOptionKey}
            renderInput={props.renderInput ?? (params => <TextField {...params} required={props.required} label={props.label ?? 'Choose'}/>)}
            renderOption={(liprops, option) => {
                const {key : defaultKey, ...restProps} = liprops
                const key = getOptionKey ? getOptionKey(option) : defaultKey 
                if(createOption && isOptionsEqualToValue(createOption as T, option)){
                    return <li {...restProps} key={key} style={{fontStyle: 'italic'}}>{getOptionLabel(option)}</li>
                }
                return <li {...restProps} key={key}>{getOptionLabel(option)}</li>
            }}
            filterOptions={filterOptions}
            onChange={(_, option) => {
                if(createOption && option && isOptionsEqualToValue(createOption as T, option)){
                    setState(state => ({...state, modalOpen: true}))
                    return 
                }
                const newState : StandardAutocompleteState<T> = {...state, value: option, inputValue: option ? getOptionLabel(option) : ''}
                setState(newState)
                props.onChange && props.onChange(option)
            }}
            onInput={event => {
                const textInput = (event.target as HTMLInputElement).value
                setState(state => ({...state, inputValue: textInput}))
            }}
        />
        {createOption && CreateOptionForm &&
            <Modal
                open={state.modalOpen}
                onClose={handleClose}
            >
                <Box sx={{bgcolor: theme.palette.background.paper}}>
                    <Button
                        onClick={handleClose}
                    >Close</Button>
                    <CreateOptionForm
                        prePopulatedInputs={getPrepopulatedInput && getPrepopulatedInput(state)}
                        handleClose={handleClose}
                    />
                </Box>
            </Modal>
        }
    </Box>
}

export default StandardAutocomplete