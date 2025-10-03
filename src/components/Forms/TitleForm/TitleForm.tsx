import { Box, Button, FormControl, FormLabel, TextField } from '@mui/material';
import PublisherAutocomplete from '../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete';
import MultiArtistAutocomplete from '../Fields/Autocomplete/MultiArtistAutocomplete/MultiArtistAutocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createTitle } from '@/backend/api/title';
import FileInput from '../Fields/FileUpload/FileInput';
import objectToFormData from '@/utils/formData';
import { useEffect, useState } from 'react';
import StandardSelect from '../Fields/Select/StandardSelect/StandardSelect';
import SeriesAutocomplete from '../Fields/Autocomplete/SeriesAutocomplete/SeriesAutocomplete';
import PublisherCollectionAutocomplete from '../Fields/Autocomplete/PublisherCollectionAutocomplete.tsx/PublisherCollectionAutocomplete';
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons';
import { SupportedLanguage } from '@/types/common';

export type TitleFormProps = {
  onTitleCreated?: (createdTitle: CreatedTitle) => any
  prePopulatedName?: string
  artistsContributions?: NewArtistContribution[] 
  artistsMap?: Record<number, {id: number, firstName: string, lastName: string, pseudo: string}>
  publisher?: {id: number, name: string}
  description?: string
  releaseDate?: string
  language?: SupportedLanguage | undefined
  coverImageFile?: File 
  series?: string
  isbn?: string
}

const TitleForm = (props : TitleFormProps) => {
  const {onTitleCreated, prePopulatedName} = props
  // const [titleForm, setTitleForm] = useAtom(newTitleForm)
  const initialState : NewTitleFormState = {
    name: prePopulatedName ?? '',
    artistsContributions: props.artistsContributions ?? [],
    publisher: props.publisher?.id ?? null,
    description: props.description ?? '',
    releaseDate: '',
    language: props.language ?? 'fr', 
    coverImageFile: undefined,
    isbn: props.isbn ?? ''
  }

  const [titleForm, setTitleForm] = useState(initialState)
  useEffect( () => {
    prePopulatedName && setTitleForm(title => ({...title, name: prePopulatedName})) 
  } , [prePopulatedName])

  const displayLangName = new Intl.DisplayNames([navigator.language || 'en'], {type: 'language'})
  
  return  <Box component='form'  onSubmit={ async (event) => {
        event.stopPropagation()
        event.preventDefault()
        console.log("Form submitted", titleForm)
        const createdTitle = await createTitle(objectToFormData(titleForm)) 
        console.log("response from createTitle", createdTitle)
        onTitleCreated && onTitleCreated(createdTitle)
      }}
        sx={{width:'100%'}}
      >
        <TextField 
          label="Title"
          value={titleForm.name}
          onChange={(event) => setTitleForm((title) => ({...title, name: event.target.value}))}
          required
          fullWidth
        />
        <TextField 
          label="Isbn"
          value={titleForm.isbn}
          onChange={(event) => setTitleForm((title) => ({...title, isbn: event.target.value}))}
          fullWidth
        />
        <SeriesAutocomplete 
          onChange={series => setTitleForm(title => ({...title, series})) }
        />
        <PublisherCollectionAutocomplete 
          onChange={collection => setTitleForm(title => ({...title, collection: collection}))}
        />
        <FormControl component='fieldset'  fullWidth>
          <FormLabel component="legend" sx={{mb: 1}} >Author</FormLabel>
          <TextField 
            label="Description"
            value={titleForm.description}
            onChange={(event) => setTitleForm((title) => ({...title, description: event.target.value}))}
            fullWidth
            multiline
            rows={3}
          />
        </FormControl>
        <MultiArtistAutocomplete artistsMap={props.artistsMap} artistsContributions={props.artistsContributions} onMultiArtistChange={(contributions) => {
          const validContributions  = contributions.filter((contribution) => !!contribution?.artist && !!contribution?.skills)
          setTitleForm(titleForm => ({...titleForm, artistsContributions: validContributions.map(({artist, skills})=> ({artist : artist as number, skills}))})) 
        }} />
        <PublisherAutocomplete
          onChange={(_, publisher) => setTitleForm(title => ({...title, publisher: publisher?.id ?? null})) }
          required
          value={props.publisher}
        />
        <DatePicker 
          label="Release Date"
          value={titleForm.releaseDate ? dayjs(titleForm.releaseDate) : null}
          onChange={(newDate) => setTitleForm((title) => ({...title, releaseDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
        />
        <FileInput 
            label={"Choose a cover image"}
            accept='image/*'
            onFileChange={(event) => setTitleForm(title => ({...title, coverImageFile: event.target.files?.[0]})) } 
        />
        <StandardSelect
          options={[{label: displayLangName.of('fr') ?? 'fr', value: 'fr'}, {label: displayLangName.of('en') ?? 'en', value: 'en'}]}
          defaultValue={
            {label: displayLangName.of( props.language ?? 'fr') ?? props.language ?? 'fr', value: props.language ?? 'fr'}
          }
          multiple={false}
          onChange={(lang) => setTitleForm(title => ({...title, language: lang?.value ?? 'fr'}))}
          textInputLabel='Select a language'
        />
        <FormSubmitAndResetButtons
          state={titleForm}
        />
        <Button onClick={() => console.log(props)}>props</Button>
      </Box>
}

export default TitleForm