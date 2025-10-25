import { FormControl, FormLabel, TextField } from '@mui/material';
import PublisherAutocomplete from '../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete';
import MultiArtistAutocomplete from '../Fields/Autocomplete/MultiArtistAutocomplete/MultiArtistAutocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createTitle } from '@/backend/api/title';
import FileInput from '../Fields/FileUpload/FileInput';
import objectToFormData from '@/utils/formData';
import { useCallback, useEffect, useState } from 'react';
import StandardSelect from '../Fields/Select/StandardSelect/StandardSelect';
import SeriesAutocomplete from '../Fields/Autocomplete/SeriesAutocomplete/SeriesAutocomplete';
import PublisherCollectionAutocomplete from '../Fields/Autocomplete/PublisherCollectionAutocomplete.tsx/PublisherCollectionAutocomplete';
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons';
import { SupportedLanguage } from '@/types/common';
import FormLayout from '../FormLayout/FormLayout';

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
  const {
    onTitleCreated,
    prePopulatedName,
    artistsContributions,
    artistsMap,
    publisher,
    description,
    releaseDate,
    language,
    coverImageFile,
    series,
    isbn,
  } = props
  const createInitialState = useCallback((): NewTitleFormState => ({
    name: prePopulatedName ?? '',
    artistsContributions: artistsContributions ?? [],
    publisher: publisher?.id ?? null,
    description: description ?? '',
    releaseDate: releaseDate ?? '',
    language: language ?? 'fr',
    coverImageFile,
    isbn: isbn ?? '',
    series,
  }), [artistsContributions, coverImageFile, description, isbn, language, prePopulatedName, publisher?.id, releaseDate, series])

  const [titleForm, setTitleForm] = useState<NewTitleFormState>(() => createInitialState())
  useEffect( () => {
    prePopulatedName && setTitleForm(title => ({...title, name: prePopulatedName}))
  } , [prePopulatedName])

  const displayLangName = new Intl.DisplayNames([navigator.language || 'en'], {type: 'language'})

  return  <FormLayout onSubmit={ async (event) => {
        event.stopPropagation()
        event.preventDefault()
        console.log("Form submitted", titleForm)
        const createdTitle = await createTitle(objectToFormData(titleForm))
        console.log("response from createTitle", createdTitle)
        onTitleCreated && onTitleCreated(createdTitle)
      }}
      >
        <TextField
          label="Title"
          value={titleForm.name}
          onChange={(event) => setTitleForm((title) => ({...title, name: event.target.value}))}
          required
        />
        <TextField
          label="Isbn"
          value={titleForm.isbn}
          onChange={(event) => setTitleForm((title) => ({...title, isbn: event.target.value}))}
        />
        <SeriesAutocomplete
          onChange={series => setTitleForm(title => ({...title, series})) }
        />
        <PublisherCollectionAutocomplete
          onChange={collection => setTitleForm(title => ({...title, collection: collection}))}
        />
        <FormControl component='fieldset'>
          <FormLabel component="legend" sx={{mb: 1}} >Author</FormLabel>
          <TextField
            label="Description"
            value={titleForm.description}
            onChange={(event) => setTitleForm((title) => ({...title, description: event.target.value}))}
            multiline
            rows={3}
          />
        </FormControl>
        <MultiArtistAutocomplete artistsMap={artistsMap} artistsContributions={artistsContributions} onMultiArtistChange={(contributions) => {
          const validContributions  = contributions.filter((contribution) => !!contribution?.artist && !!contribution?.skills)
          setTitleForm(titleForm => ({...titleForm, artistsContributions: validContributions.map(({artist, skills})=> ({artist : artist as number, skills}))}))
        }} />
        <PublisherAutocomplete
          onChange={(_, selectedPublisher) => setTitleForm(title => ({...title, publisher: selectedPublisher?.id ?? null})) }
          required
          value={publisher}
        />
        <DatePicker
          label="Release Date"
          value={titleForm.releaseDate ? dayjs(titleForm.releaseDate) : null}
          onChange={(newDate) => setTitleForm((title) => ({...title, releaseDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <FileInput
            label={"Choose a cover image"}
            accept='image/*'
            direction="column"
            spacing={1}
            onFileChange={(event) => setTitleForm(title => ({...title, coverImageFile: event.target.files?.[0]})) }
        />
        <StandardSelect
          options={[{label: displayLangName.of('fr') ?? 'fr', value: 'fr'}, {label: displayLangName.of('en') ?? 'en', value: 'en'}]}
          defaultValue={{
            label: displayLangName.of(language ?? 'fr') ?? language ?? 'fr',
            value: language ?? 'fr',
          }}
          multiple={false}
          onChange={(lang) => setTitleForm(title => ({...title, language: lang?.value ?? 'fr'}))}
          textInputLabel='Select a language'
        />
        <FormSubmitAndResetButtons
          state={titleForm}
          handleReset={() => setTitleForm(createInitialState())}
          submitLabel="Enregistrer l'œuvre"
        />
      </FormLayout>
}

export default TitleForm
