import { Box, Button, FormControl, FormLabel, TextField } from '@mui/material';
import { newTitleForm, newTitleFormInitialState } from './atom';
import { useAtom } from 'jotai';
import PublisherAutocomplete from '../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete';
import MultiArtistAutocomplete from '../Fields/Autocomplete/MultiArtistAutocomplete/MultiArtistAutocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createTitle } from '@/backend/api/title';
import FileInput from '../Fields/FileUpload/FileInput';
import objectToFormData from '@/utils/formData';
import { useEffect } from 'react';

export type TitleFormProps = {
  prePopulatedName?: string,
  onTitleCreated?: (createdTitle: CreatedTitle) => any
}

const TitleForm = (props : TitleFormProps) => {
    const {onTitleCreated, prePopulatedName} = props
    const [titleForm, setTitleForm] = useAtom(newTitleForm)
    useEffect( () => {
      prePopulatedName && setTitleForm(title => ({...title, name: prePopulatedName})) 
    } , [prePopulatedName])
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
          <FormControl component='fieldset'  fullWidth>
            <FormLabel component="legend" sx={{mb: 1}} >Author</FormLabel>
            <TextField 
              label="Description"
              value={titleForm.description}
              onChange={(event) => setTitleForm((title) => ({...title, description: event.target.value}))}
              fullWidth
            />
          </FormControl>
          <MultiArtistAutocomplete onMultiArtistChange={(contributions) => {
            const validContributions  = contributions.filter((contribution) => !!contribution?.artist && !!contribution?.skills)
            setTitleForm(titleForm => ({...titleForm, artistsContributions: validContributions.map(({artist, skills})=> ({artist : artist as number, skills}))}))  
          }} />
          <PublisherAutocomplete
            onChange={(_, publisher) => setTitleForm(title => ({...title, publisher: publisher?.id ?? null})) }
            required
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
          <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
          <Button onClick={() => setTitleForm(newTitleFormInitialState)} >Reset</Button>
          <Button type='submit' >Ajouter</Button>
          </Box>
        </Box>
}

export default TitleForm