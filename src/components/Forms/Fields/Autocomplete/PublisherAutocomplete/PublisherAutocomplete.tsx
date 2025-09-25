import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteProps, Box, Modal, ModalProps, TextField } from "@mui/material"
import { usePublishers } from "@/hooks"
import  React, { useEffect, useState } from "react"
import {  getPublishers} from "@/backend/api/publisher"
import PublisherForm, { PublisherFormProps } from "@/components/Forms/PublisherForm/PublisherForm"

type PublisherAutocompleteProps = Omit<AutocompleteProps<CreatedPublisher, false, false, false>, 
    'freeSolo'| 'renderInput' | 'options'
> & {
    required: boolean
    onChange?: (event: null | React.SyntheticEvent<Element, Event>, publisher: CreatedPublisher | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<CreatedPublisher> | undefined  ) => void
    value?: CreatedPublisher
}

type CreatePublisherModalProps = Omit<ModalProps, 'children'> & {
    prePopulatedName: string,
    onPublisherCreated: PublisherFormProps['onSuccess']
}

const CreatePublisherModal = (props : CreatePublisherModalProps ) => {
    const {prePopulatedName, onPublisherCreated} = props
    return <Modal {...props}>
        <Box sx={{bgcolor: 'background.paper'}}>
            <PublisherForm prePopulatedName={prePopulatedName} onSuccess={onPublisherCreated} />
        </Box>
    </Modal>
}

const PublisherAutocomplete = (props : PublisherAutocompleteProps ) => {
    const {required, onChange, inputValue: _inputValue} = props 
    const {publishers} = usePublishers()
    const label = "Publisher"
    const [modalOpen, setModalOpen] = useState(false)
    const createPublisherOption = {...publishers[0], id: 0, name: 'Add New Publisher'}
    const [inputValue, setInputValue] = useState(props.value?.name ?? '') 
    const [prevInputValue, setPrevInputValue] = useState('') 
    const [value, setValue] = useState<CreatedPublisher| null>(props.value ?? null)
    useEffect(() => getPublishers() ,[])
    return <Box>
        <Autocomplete
        inputValue={inputValue}
        value={props.value ?? value} 
        options={publishers}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} required={required} label={label}/>}
        renderOption={(props, option) => {
            const {key} = props
            if(option.id === 0){
                return <li {...props} key={key} style={{fontStyle: 'italic'}} >
                    {option.name}
                </li>
            }
            return <li {...props} key={key}>{option.name}</li>
        }}
        filterOptions={(options, state) => {
            const filtered = options.filter((option) => option.name.toLowerCase().includes(state.inputValue.toLowerCase()))
            const inputExists = options.some((option) => option.name.toLowerCase() === state.inputValue.toLowerCase())
            return !inputExists ? [...filtered, createPublisherOption] : filtered
        }}
        onChange={(_, option, reason, details ) => {
            console.log('onChange fired')
            if(option?.id === 0){
                setModalOpen(true)
                setInputValue(prevInputValue)
                return
            }
            setPrevInputValue(option?.name ?? '')
            setInputValue(option?.name ?? '')
            onChange && onChange(_, option, reason, details)
        }}
        onInput={(event) => {
            const textInput = (event.target as HTMLInputElement).value  
            setPrevInputValue(textInput)
            setInputValue(textInput)
         }}
       /> 
       <CreatePublisherModal 
            open={modalOpen}   
            onClose={() =>{
                getPublishers()
                setModalOpen(false)
            }}
            prePopulatedName={prevInputValue}
            onPublisherCreated={(newPublisher) =>{
                if(newPublisher) {
                    setInputValue(newPublisher.name)
                    setValue(newPublisher)
                    onChange && onChange(null, newPublisher, 'selectOption', {option: newPublisher})
                    setModalOpen(false)
                }     
            }}
        />
    </Box> 
}

export default PublisherAutocomplete