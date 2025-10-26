import { getTitles } from '@/backend/api/title'
import TitleForm, { TitleFormProps } from '@/components/Forms/TitleForm/TitleForm'
import AppModal from '@/components/Common/AppModal'
import { useTitles } from '@/hooks'
import { ModalProps } from '@mui/material'
import Autocomplete, { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/Autocomplete'
import Box, { BoxProps } from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { forwardRef, useState } from 'react'
import { getImageUrl } from '@/utils/image'

type TitleAutocompleteProps = {
  sx?: BoxProps['sx']
  required?: boolean
  label?: string
  onChangeCallback: (
    event: React.SyntheticEvent<Element, Event> | null,
    option: CreatedTitle | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<CreatedTitle>
  ) => any
  title?: Partial<CreatedTitle>
  disabled?: boolean
}

type TitleAutocompleteState = AutoCompleteFieldState<CreatedTitle>

type TitleAutoCompleteOptionCardProps = {
  option: CreatedTitle
} & React.HTMLAttributes<HTMLLIElement>

const OptionCard = forwardRef<HTMLLIElement, TitleAutoCompleteOptionCardProps>(({ option, ...props }, ref) => {
  return (
    <li ref={ref} {...props}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1,
          borderRadius: 1,
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(option?.coverImage?.url)}
          alt={option.name}
          sx={{
            width: 48,
            height: 64,
            borderRadius: 1,
            objectFit: 'cover',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
        <Stack>
          <Typography variant="subtitle1" fontWeight="bold">
            {option.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            by {option?.artistsContributions?.[0]?.artist?.fullName}
          </Typography>
        </Stack>
      </Box>
    </li>
  )
})

type CreateTitleModalProps = Omit<ModalProps, 'children'> & TitleFormProps

const CreateTitleModal = (props: CreateTitleModalProps) => {
  const { prePopulatedName, onTitleCreated, ...modalProps } = props
  return (
    <AppModal {...modalProps}>
      <TitleForm surface="plain" prePopulatedName={prePopulatedName} onTitleCreated={onTitleCreated} />
    </AppModal>
  )
}

const TitleAutocomplete = (props: TitleAutocompleteProps) => {
  const { title } = props
  const initialState: TitleAutocompleteState = {
    inputValue: title?.name ?? '',
    prevInputValue: '',
    value: null,
    modalOpen: false,
  }
  const [state, setState] = useState<TitleAutocompleteState>(initialState)
  const { titles } = useTitles()
  const { sx, required, label, onChangeCallback } = props
  const inputLabel = label ?? 'Title'
  const createTitleOption = { ...titles[0], id: 0, name: 'Add New Title' }
  return (
    <Box sx={sx}>
      <Autocomplete<CreatedTitle>
        disableClearable={false}
        inputValue={state.inputValue}
        value={state.value}
        options={titles}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => <TextField {...params} required={required} label={inputLabel} />}
        renderOption={(renderProps, option) => {
          const { key, ...itemProps } = renderProps
          if (option.id === 0) {
            return (
              <li {...itemProps} key={key} style={{ fontStyle: 'italic' }}>
                {option.name}
              </li>
            )
          }
          return <OptionCard option={option} key={option.id} {...itemProps} />
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
        onChange={(_, option, ...args) => {
          if (option?.id === 0) {
            setState((prev) => ({ ...prev, modalOpen: true, inputValue: prev.prevInputValue }))
            return
          }
          setState((prev) => ({
            ...prev,
            prevInputValue: option ? getOptionLabel(option) : '',
            inputValue: option ? getOptionLabel(option) : '',
            value: option,
          }))
          onChangeCallback && onChangeCallback(_, option, ...args)
        }}
        onInput={(event) => {
          const textInput = (event.target as HTMLInputElement).value
          setState((prev) => ({ ...prev, prevInputValue: textInput, inputValue: textInput }))
        }}
        disabled={props.disabled ?? false}
      />
      <CreateTitleModal
        open={state.modalOpen}
        prePopulatedName={state.prevInputValue}
        onClose={() => setState((prev) => ({ ...prev, modalOpen: false }))}
        onTitleCreated={(createdTitle) => {
          if (createdTitle) {
            setState((prev) => ({
              ...prev,
              inputValue: getOptionLabel(createdTitle),
              value: createdTitle,
              modalOpen: false,
            }))
            getTitles()
            onChangeCallback && onChangeCallback(null, createdTitle, 'selectOption', { option: createdTitle })
          }
        }}
      />
    </Box>
  )
}

const getOptionLabel = (option: CreatedTitle) => option.name

export default TitleAutocomplete
