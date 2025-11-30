import { getSeries } from '@/backend/api/series'
import AddSeriesForm, { AddSeriesFormProps } from '@/components/Forms/AddSeriesForm/AddSeriesForm'
import AppModal from '@/components/Common/AppModal'
import { useSeries } from '@/hooks/useSeries'
import { Autocomplete, Box, Button, ModalProps, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

type SeriesAutocompleteProps = {
  label?: string
  required?: true
  onChange?: (series: CreatedSeries | null) => any
  getOptionLabel?: (option: CreatedSeries) => string
}

type SeriesAutocompleteState = {
  value: CreatedSeries | null
  modalOpen: boolean
  inputValue: string
}

const SeriesAutocomplete = (props: SeriesAutocompleteProps) => {
  const initialState: SeriesAutocompleteState = {
    value: null,
    modalOpen: false,
    inputValue: '',
  }
  useEffect(() => {
    return getSeries()
  }, [])
  const label = props.label ?? 'Series'
  const [series] = useSeries()
  const createTitleOption: CreatedSeries = { ...series[0], id: 0, name: 'Add New Series' }
  const [state, setState] = useState(initialState)
  const getOptionLabel = props.getOptionLabel ?? ((option: CreatedSeries) => `${option.name} - ${option?.publisher?.name}`)
  return (
    <Box>
      <Autocomplete<CreatedSeries>
        value={state.value}
        inputValue={state.inputValue}
        disableClearable={false}
        options={series}
        getOptionLabel={getOptionLabel}
        getOptionKey={(option) => option.id}
        renderInput={(params) => <TextField {...params} required={props.required} label={label} />}
        renderOption={(renderProps, option) => {
          const { key, ...restProps } = renderProps
          if (option.id === 0) {
            return (
              <li {...restProps} key={key} style={{ fontStyle: 'italic' }}>
                {option.name}
              </li>
            )
          }
          return (
            <li {...restProps} key={key}>
              {option.name} - {option.publisher.name}
            </li>
          )
        }}
        filterOptions={(options, autocompleteState) => {
          const filtered = options.filter((option) =>
            `${option.name}`.toLowerCase().includes(autocompleteState.inputValue.toLowerCase())
          )
          const inputExists = options.some(
            (option) => `${option.name}`.toLowerCase() === autocompleteState.inputValue.toLowerCase()
          )
          return !inputExists ? [...filtered, createTitleOption] : filtered
        }}
        onChange={(_, option) => {
          if (option?.id === 0) {
            setState((prev) => ({ ...prev, modalOpen: true }))
            return
          }
          const newState: SeriesAutocompleteState = {
            ...state,
            value: option,
            inputValue: option ? getOptionLabel(option) : '',
          }
          setState(newState)
          props.onChange && props.onChange(option)
        }}
        onInput={(event) => {
          const textInput = (event.target as HTMLInputElement).value
          setState((prev) => ({ ...prev, inputValue: textInput }))
        }}
      />
      <CreateSeriesModal
        open={state.modalOpen}
        prePopulatedName={state.inputValue}
        prePolutatedLanguage={state.value?.language}
        handleClose={() => setState((prev) => ({ ...prev, modalOpen: false }))}
        onSeriesCreated={(newSeries) => {
          getSeries()
          const newState: SeriesAutocompleteState = {
            ...state,
            value: newSeries,
            inputValue: newSeries.name,
            modalOpen: false,
          }
          setState(newState)
          props.onChange && props.onChange(newSeries)
        }}
      />
    </Box>
  )
}

type CreateSeriesModalProps = {
  open: boolean
  handleClose: (any?: any) => void
} & AddSeriesFormProps & Omit<ModalProps, 'children'>

const CreateSeriesModal = (props: CreateSeriesModalProps) => {
  const { onSeriesCreated, prePolutatedLanguage, prePopulatedName, handleClose, ...modalProps } = props
  return (
    <AppModal {...modalProps} onClose={handleClose}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Button onClick={handleClose} sx={{ alignSelf: 'flex-end' }}>
          Close
        </Button>
        <AddSeriesForm
          surface="plain"
          onSeriesCreated={(createdSeries) => {
            onSeriesCreated && onSeriesCreated(createdSeries)
          }}
          prePolutatedLanguage={prePolutatedLanguage}
          prePopulatedName={prePopulatedName}
        />
      </Box>
    </AppModal>
  )
}

export default SeriesAutocomplete
