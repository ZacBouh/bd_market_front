import { getArtists } from '@/backend/api/artist'
import ArtistForm, { ArtistFormProps } from '@/components/Forms/ArtistForm/ArtistForm'
import AppModal from '@/components/Common/AppModal'
import { useArtists } from '@/hooks/useArtist'
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  Box,
  ModalProps,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'

export type ArtistAutoCompleteState = {
  inputValue: string
  prevInputValue: string
  value: CreatedArtist | null
  modalOpen: boolean
}

export type ArtistAutocompleteProps = Omit<
  AutocompleteProps<CreatedArtist, false, false, false>,
  'freeSolo' | 'renderInput' | 'options'
> & {
  required?: boolean
  onChangeCallback?: (
    event: null | React.SyntheticEvent<Element, Event>,
    artist: CreatedArtist | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<CreatedArtist>
  ) => void
  value?: CreatedArtist
}

type CreateArtistModalProps = Omit<ModalProps, 'children'> & {
  prePopulatedName: string
  onArtistCreated: ArtistFormProps['onSuccess']
}

const CreateArtistModal = (props: CreateArtistModalProps) => {
  const { prePopulatedName, onArtistCreated, ...modalProps } = props
  return (
    <AppModal {...modalProps}>
      <ArtistForm prePopulatedName={prePopulatedName} onSuccess={onArtistCreated} />
    </AppModal>
  )
}

const ArtistAutocomplete = (props: ArtistAutocompleteProps) => {
  const { required, sx, onChangeCallback, ...restProps } = props
  const label = 'Artist'
  const { artistsList } = useArtists()
  useEffect(() => getArtists(), [])
  const createArtistOption = { ...artistsList[0], id: 0, pseudo: '', firstName: 'Add New Artist', lastName: '' }
  const [state, setState] = useState<ArtistAutoCompleteState>({
    inputValue: props.value ? getArtistOptionLabel(props.value) : '',
    prevInputValue: '',
    value: props.value ?? null,
    modalOpen: false,
  })
  return (
    <Box sx={sx}>
      <Autocomplete
        disableClearable={false}
        inputValue={state.inputValue}
        value={state.value}
        options={artistsList}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}${option?.pseudo && ` aka ${option?.pseudo}`}`}
        renderInput={(params) => <TextField {...params} required={required} label={label} />}
        renderOption={(renderProps, option) => {
          const { key, ...itemProps } = renderProps
          if (option.id === 0) {
            return (
              <li {...itemProps} key={option.id} style={{ fontStyle: 'italic' }}>
                {option.firstName}
              </li>
            )
          }
          return (
            <li {...itemProps} key={key}>
              {option?.firstName} {option?.lastName} {option?.pseudo && `aka ${option.pseudo}`}
            </li>
          )
        }}
        filterOptions={(options, autocompleteState) => {
          const filtered = options.filter((option) =>
            `${option?.firstName} ${option?.lastName} ${option?.pseudo && option.pseudo}`
              .toLowerCase()
              .includes(autocompleteState.inputValue.toLowerCase())
          )
          const inputExists = options.some(
            (option) =>
              `${option?.firstName} ${option?.lastName}${option?.pseudo && ` aka ${option.pseudo}`}`.toLowerCase() ===
              autocompleteState.inputValue.toLowerCase()
          )
          return !inputExists ? [...filtered, createArtistOption] : filtered
        }}
        onChange={(_, option, ...args) => {
          if (option?.id === 0) {
            setState((prev) => ({ ...prev, modalOpen: true, inputValue: prev.prevInputValue }))
            return
          }
          setState((prev) => ({
            ...prev,
            prevInputValue: option ? getArtistOptionLabel(option) : '',
            inputValue: option ? getArtistOptionLabel(option) : '',
            value: option,
          }))
          onChangeCallback && onChangeCallback(_, option, ...args)
        }}
        onInput={(event) => {
          const textInput = (event.target as HTMLInputElement).value
          setState((prev) => ({ ...prev, prevInputValue: textInput, inputValue: textInput }))
        }}
        {...restProps}
      />
      <CreateArtistModal
        open={state.modalOpen}
        prePopulatedName={state.prevInputValue}
        onArtistCreated={(newArtist) => {
          if (newArtist) {
            setState((prev) => ({
              ...prev,
              inputValue: getArtistOptionLabel(newArtist),
              value: newArtist,
              modalOpen: false,
            }))
            getArtists()
            onChangeCallback && onChangeCallback(null, newArtist, 'selectOption', { option: newArtist })
          }
        }}
        onClose={() => setState((prev) => ({ ...prev, modalOpen: false }))}
      />
    </Box>
  )
}

const getArtistOptionLabel = (artistOption: CreatedArtist) => {
  return `${artistOption?.firstName} ${artistOption?.lastName}${artistOption?.pseudo ? ` aka ${artistOption.pseudo}` : ''}`
}

export default ArtistAutocomplete
