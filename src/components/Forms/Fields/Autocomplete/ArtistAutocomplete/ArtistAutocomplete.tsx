import { CreatedArtist, getArtists } from "@/backend/api/artists"
import AuthorForm, { AuthorFormProps } from "@/components/Forms/AuthorForm/AuthorForm"
import { useArtists } from "@/hooks/useArtist"
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteProps, Box, Modal, ModalProps, TextField } from "@mui/material"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"

const artistAutoCompleteAtom = atom<artistAutoCompleteState>({
    inputValue: '',
    prevInputValue: '',
    value: null,
    modalOpen: false
})

type artistAutoCompleteState = {
    inputValue : string,
    prevInputValue: string,
    value: CreatedArtist | null,
    modalOpen: boolean
}

type ArtistAutocompleteProps = Omit<AutocompleteProps<CreatedArtist, false, false, false>, 
    'freeSolo'| 'renderInput' | 'options'
> & {
    required?: boolean
    onChange?: (event: null | React.SyntheticEvent<Element, Event>, artist: CreatedArtist | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<CreatedArtist> | undefined  ) => void
}

type CreateArtistModalProps = Omit<ModalProps, 'children'> & {
    prePopulatedName: string,
    onArtistCreated: AuthorFormProps['onSuccess']
}

const CreateArtistModal = (props : CreateArtistModalProps ) => {
    const {prePopulatedName, onArtistCreated, ...modalProps} = props
    return <Modal {...modalProps}>
        <Box sx={{bgcolor: 'background.paper'}}>
            <AuthorForm prePopulatedName={prePopulatedName} onSuccess={onArtistCreated} />
        </Box>
    </Modal>
}
const ArtistAutocomplete = (props : ArtistAutocompleteProps) => {
    const {required, onChange} = props
    const label = "Artist"
    const {artistsList} = useArtists()
    useEffect( () => getArtists() , [])
    const createArtistOption = {...artistsList[0], id: 0, pseudo: '', firstName: 'Add New Artist', lastName: ''}
    const [state, setState] = useAtom(artistAutoCompleteAtom)
   return <Box>
       <Autocomplete
            inputValue={state.inputValue}
            value={state.value}
            options={artistsList}
            getOptionLabel={option => `${option?.firstName} ${option?.lastName}${option?.pseudo && ` aka ${option?.pseudo}`}`}
            renderInput={(params) => <TextField {...params} required={required} label={label}/>}
            renderOption={(props, option) => {
                if(option.id === 0){
                    return <li {...props} key={option.id} style={{fontStyle:'italic'}}>
                        {option.firstName}        
                    </li>
                }
                return <li {...props} key={option.id}>{option?.firstName} {option?.lastName} {option?.pseudo && `aka ${option.pseudo}`}</li>
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
                option && setState(state => ({
                    ...state,
                    prevInputValue: getArtistOptionLabel(option),
                    inputValue: getArtistOptionLabel(option),
                }))
                onChange && onChange(_, option, ...args)
            }}
            onInput={(event) => {
                const textInput = (event.target as HTMLInputElement).value
                setState(state => ({...state, prevInputValue: textInput, inputValue: textInput}))
            }}
            {...props}
       /> 
       <CreateArtistModal 
            open={state.modalOpen}
            prePopulatedName={state.prevInputValue}
            onArtistCreated={(newArtist) => {
                if(newArtist){
                    setState(state => ({
                        ...state,
                        inputValue: getArtistOptionLabel(newArtist),
                        value: newArtist, 
                        modalOpen: false
                    }))
                    onChange && onChange(null, newArtist, 'selectOption', {option: newArtist})  
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