import { getArtists } from "@/backend/api/artist"
import ArtistForm, { ArtistFormProps } from "@/components/Forms/ArtistForm/ArtistForm"
import { useArtists } from "@/hooks/useArtist"
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteProps, Box, Modal, ModalProps, TextField } from "@mui/material"
import { useEffect, useState } from "react"


export type ArtistAutoCompleteState = {
    inputValue : string,
    prevInputValue: string,
    value: CreatedArtist | null,
    modalOpen: boolean
}

export type ArtistAutocompleteProps = Omit<AutocompleteProps<CreatedArtist, false, false, false>, 
    'freeSolo'| 'renderInput' | 'options'
> & {
    required?: boolean
    onChangeCallback?: (event: null | React.SyntheticEvent<Element, Event>, artist: CreatedArtist | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<CreatedArtist> | undefined  ) => void
}

type CreateArtistModalProps = Omit<ModalProps, 'children'> & {
    prePopulatedName: string,
    onArtistCreated: ArtistFormProps['onSuccess']
}

const CreateArtistModal = (props : CreateArtistModalProps ) => {
    const {prePopulatedName, onArtistCreated, ...modalProps} = props
    return <Modal {...modalProps}>
        <Box sx={{bgcolor: 'background.paper'}}>
            <ArtistForm prePopulatedName={prePopulatedName} onSuccess={onArtistCreated} />
        </Box>
    </Modal>
}
const ArtistAutocomplete = (props : ArtistAutocompleteProps) => {
    const {required, sx, onChangeCallback, ...restProps} = props
    const label = "Artist"
    const {artistsList} = useArtists()
    useEffect( () => getArtists() , [])
    const createArtistOption = {...artistsList[0], id: 0, pseudo: '', firstName: 'Add New Artist', lastName: ''}
    const [state, setState] = useState<ArtistAutoCompleteState>({
        inputValue: '',
        prevInputValue: '',
        value: null,
        modalOpen: false
    })
   return <Box sx={sx}>
       <Autocomplete
            disableClearable={false}
            inputValue={state.inputValue}
            value={state.value}
            options={artistsList}
            getOptionLabel={option => `${option?.firstName} ${option?.lastName}${option?.pseudo && ` aka ${option?.pseudo}`}`}
            renderInput={(params) => <TextField {...params} required={required} label={label}/>}
            renderOption={(props, option) => {
                const {key, ...itemProps} = props
                if(option.id === 0){
                    return <li {...itemProps} key={option.id} style={{fontStyle:'italic'}}>
                        {option.firstName}        
                    </li>
                }
                return <li {...itemProps} key={key}>{option?.firstName} {option?.lastName} {option?.pseudo && `aka ${option.pseudo}`}</li>
            }}
            filterOptions={(options, state) => {
                const filtered = options.filter((option) => `${option?.firstName} ${option?.lastName} ${option?.pseudo && option.pseudo}`.toLowerCase().includes(state.inputValue.toLowerCase()))
                const inputExists = options.some((option) => `${option?.firstName} ${option?.lastName}${option?.pseudo && ` aka ${option.pseudo}`}`.toLowerCase() === state.inputValue.toLowerCase())
                return !inputExists ? [...filtered, createArtistOption] : filtered
            }}
            onChange={(_, option, ...args) => {
                if(option?.id === 0){
                    setState(state => ({...state, modalOpen: true, inputValue: state.prevInputValue}))
                    return
                }
                setState(state => ({
                    ...state,
                    prevInputValue: option ? getArtistOptionLabel(option) : '',
                    inputValue: option ? getArtistOptionLabel(option) : '',
                    value: option
                }))
                onChangeCallback && onChangeCallback(_, option, ...args)
            }}
            onInput={(event) => {
                const textInput = (event.target as HTMLInputElement).value
                setState(state => ({...state, prevInputValue: textInput, inputValue: textInput}))
            }}
            {...restProps}
       /> 
       <CreateArtistModal 
            open={state.modalOpen}
            prePopulatedName={state.prevInputValue}
            onArtistCreated={(newArtist) => {
                if(newArtist){
                    console.log('updating state with new artist')
                    setState(state => ({
                        ...state,
                        inputValue: getArtistOptionLabel(newArtist),
                        value: newArtist, 
                        modalOpen: false
                    }))
                    getArtists()
                    onChangeCallback && onChangeCallback(null, newArtist, 'selectOption', {option: newArtist})
                } 
            }}
            onClose={() => setState(state => ({...state, modalOpen: false}))} 
        />
   </Box> 
}

const getArtistOptionLabel = (artistOption: CreatedArtist) => {
    return `${artistOption?.firstName} ${artistOption?.lastName}${artistOption?.pseudo && ` aka ${artistOption.pseudo}`}`
}

export default ArtistAutocomplete