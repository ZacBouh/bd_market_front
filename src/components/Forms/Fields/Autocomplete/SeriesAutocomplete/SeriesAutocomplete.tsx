import { getSeries } from "@/backend/api/series"
import AddSeriesForm, { AddSeriesFormProps } from "@/components/Forms/AddSeriesForm/AddSeriesForm"
import { useSeries } from "@/hooks/useSeries"
import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material"
import {  useEffect, useState } from "react"

type SeriesAutocompleteProps = {
    label?: string
    required?: true
    onChange?: (series: CreatedSeries | null) => any
    getOptionLabel? : (option: CreatedSeries) => string
}

type SeriesAutocompleteState = {
    value: CreatedSeries | null
    modalOpen: boolean
    inputValue: string,
}

const SeriesAutocomplete = (props : SeriesAutocompleteProps) => {
    const initialState : SeriesAutocompleteState = {
        value: null,
        modalOpen: false,
        inputValue: '',
    }
    useEffect( () => {
        return getSeries()
    } , []) 
    const label = props.label ?? 'Series'
    const [series] = useSeries()
    const createTitleOption : CreatedSeries = {...series[0], id: 0, name:'Add New Series'}      
    const [state, setState] = useState(initialState)
    const getOptionLabel = props.getOptionLabel ?? ((option : CreatedSeries) => `${option.name} - ${option?.publisher?.name}`)  
    return <Box>
        <Autocomplete<CreatedSeries>
               value={state.value}
               inputValue={state.inputValue}
               disableClearable={false}
               options={series}
               getOptionLabel={getOptionLabel}
               getOptionKey={option => option.id}
               renderInput={(params) => <TextField {...params} required label={label}/>}
               renderOption={(liprops, option) =>{
                   const {key, ...restProps} = liprops
                   if(option.id === 0){
                       return <li {...restProps} key={key} style={{fontStyle: 'italic'}} >{option.name}</li>
                   }
                   return <li {...liprops} key={key}>{option.name} - {option.publisher.name}</li>
               }}
               filterOptions={(options, state) => {
                   const filtered = options.filter((option) => `${option.name}`.toLowerCase().includes(state.inputValue.toLowerCase()))
                   const inputExists = options.some((option) => `${option.name}`.toLowerCase() === state.inputValue.toLowerCase())
                   return !inputExists ? [...filtered, createTitleOption] : filtered
               }}
               onChange={(_, option, ...args) => {
                   if(option?.id === 0){
                       setState(state => ({...state, modalOpen: true}))
                       return 
                   }
                   const newState : SeriesAutocompleteState = {...state, value: option, inputValue: option ? getOptionLabel(option) : ''}
                   setState(newState)
                   props.onChange && props.onChange(option)
               }}
               onInput={(event) => {
                   const textInput = (event.target as HTMLInputElement).value
                   setState(state => ({...state, inputValue: textInput}))
               }}
           />
           <CreateSeriesModal 
                open={state.modalOpen}
                prePopulatedName={state.inputValue}
                prePolutatedLanguage={state.value?.language}
                handleClose={() => setState(state => ({...state, modalOpen: false}))}
                onSeriesCreated={(series)  =>{
                    const newState : SeriesAutocompleteState = {...state, value: series, inputValue: series.name}
                    setState(newState)
                }}
           />
    </Box>
}

type CreateSeriesModalProps = {
    open: boolean,
    handleClose: (any?: any) => void
} & AddSeriesFormProps

const CreateSeriesModal = (props : CreateSeriesModalProps) => {
    const {onSeriesCreated, prePolutatedLanguage, prePopulatedName, ...ModalProps} = props
    return <Modal
            {...ModalProps}
        >
        <Box>
            <Button
                onClick={props.handleClose}
            >Close</Button>
            <AddSeriesForm
                onSeriesCreated={(series) =>{ 
                    onSeriesCreated && onSeriesCreated(series)
                }}    
                prePolutatedLanguage={prePolutatedLanguage}
                prePopulatedName={prePopulatedName}
            />
        </Box>
    </Modal>
}

export default SeriesAutocomplete