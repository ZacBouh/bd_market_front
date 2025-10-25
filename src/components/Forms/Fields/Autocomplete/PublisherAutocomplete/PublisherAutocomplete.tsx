import AppModal from '@/components/Common/AppModal'
import PublisherForm, { PublisherFormProps } from '@/components/Forms/PublisherForm/PublisherForm'
import { getPublishers } from '@/backend/api/publisher'
import { usePublishers } from '@/hooks'
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  Box,
  ModalProps,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

type PublisherAutocompleteProps = Omit<
  AutocompleteProps<CreatedPublisher, false, false, false>,
  'freeSolo' | 'renderInput' | 'options'
> & {
  required: boolean
  onChange?: (
    event: null | React.SyntheticEvent<Element, Event>,
    publisher: CreatedPublisher | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<CreatedPublisher>
  ) => void
  value?: CreatedPublisher
}

type CreatePublisherModalProps = Omit<ModalProps, 'children'> & {
  prePopulatedName: string
  onPublisherCreated: PublisherFormProps['onSuccess']
}

const CreatePublisherModal = (props: CreatePublisherModalProps) => {
  const { prePopulatedName, onPublisherCreated, ...modalProps } = props
  return (
    <AppModal {...modalProps}>
      <PublisherForm prePopulatedName={prePopulatedName} onSuccess={onPublisherCreated} />
    </AppModal>
  )
}

const PublisherAutocomplete = (props: PublisherAutocompleteProps) => {
  const { required, onChange } = props
  const { publishers } = usePublishers()
  const label = 'Publisher'
  const [modalOpen, setModalOpen] = useState(false)
  const createPublisherOption = { ...publishers[0], id: 0, name: 'Add New Publisher' }
  const [inputValue, setInputValue] = useState(props.value?.name ?? '')
  const [prevInputValue, setPrevInputValue] = useState('')
  const [value, setValue] = useState<CreatedPublisher | null>(props.value ?? null)
  useEffect(() => getPublishers(), [])
  return (
    <Box>
      <Autocomplete
        inputValue={inputValue}
        value={props.value ?? value}
        options={publishers}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
        renderInput={(params) => <TextField {...params} required={required} label={label} />}
        renderOption={(renderProps, option) => {
          const { key, ...itemProps } = renderProps
          if (option.id === 0) {
            return (
              <li {...itemProps} key={key} style={{ fontStyle: 'italic' }}>
                {option.name}
              </li>
            )
          }
          return (
            <li {...itemProps} key={key}>
              {option.name}
            </li>
          )
        }}
        filterOptions={(options, autocompleteState) => {
          const filtered = options.filter((option) =>
            option.name.toLowerCase().includes(autocompleteState.inputValue.toLowerCase())
          )
          const inputExists = options.some(
            (option) => option.name.toLowerCase() === autocompleteState.inputValue.toLowerCase()
          )
          return !inputExists ? [...filtered, createPublisherOption] : filtered
        }}
        onChange={(_, option, reason, details) => {
          if (option?.id === 0) {
            setModalOpen(true)
            setInputValue(prevInputValue)
            return
          }
          setPrevInputValue(option?.name ?? '')
          setInputValue(option?.name ?? '')
          setValue(option)
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
        onClose={() => {
          getPublishers()
          setModalOpen(false)
        }}
        prePopulatedName={prevInputValue}
        onPublisherCreated={(newPublisher) => {
          if (newPublisher) {
            setInputValue(newPublisher.name)
            setValue(newPublisher)
            onChange && onChange(null, newPublisher, 'selectOption', { option: newPublisher })
            setModalOpen(false)
          }
        }}
      />
    </Box>
  )
}

export default PublisherAutocomplete
