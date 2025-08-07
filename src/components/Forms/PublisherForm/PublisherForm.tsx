import { Box, Button,  MenuItem, Select, TextField, Typography } from '@mui/material';
import { newPublisherForm, initialState } from './atom';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePublishers } from '@/hooks/usePublisher';
import { createPublisher } from '@/backend/api/publisher';
import { useEffect } from 'react';
import objectToFormData from '@/utils/formData';
import FileInput from '../Fields/FileUpload/FileInput';

type PublisherFormProps = {
    prePopulatedName?: string,
    onSuccess?: (createdPublisher? : CreatedPublisher) => void
}

const PublisherForm = (props : PublisherFormProps) => {
    const {prePopulatedName, onSuccess} = props
    const [publisherForm, setPublisherForm] = useAtom<NewPublisher>(newPublisherForm)
    const {publishers} = usePublishers()
    useEffect(() => {
        prePopulatedName && setPublisherForm((publisher) => ({...publisher, name: prePopulatedName}))
    } 
     ,[prePopulatedName])
    
    return <Box component='form'  onSubmit={async (event) => {
            event.stopPropagation()
            event.preventDefault()
            console.log("Form submitted", publisherForm)
            const createdPublisher = await createPublisher(objectToFormData(publisherForm))
            console.log("Publisher Form Response", createdPublisher)
            onSuccess && onSuccess(createdPublisher)
        }}
          sx={{width:'100%'}}
        >
            <TextField 
            label="Name"
            value={publisherForm.name}
            onChange={(event) => setPublisherForm((publisher) => ({...publisher, name: event.target.value}))}
            required
            fullWidth
            />
            <TextField 
            label="Description"
            value={publisherForm.description}
            onChange={(event) => setPublisherForm((publisher) => ({...publisher, description: event.target.value}))}
            fullWidth
            />
            <DatePicker 
            label="Creation Date"
            value={publisherForm.birthDate ? dayjs(publisherForm.birthDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, birthDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            />
            <DatePicker 
            label="Death Date"
            value={publisherForm.deathDate ? dayjs(publisherForm.deathDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, deathDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            />
            <FileInput
                label={"Choose a logo"}
                accept='image/*'
                onFileChange={(event) => setPublisherForm(publisherForm => ({...publisherForm, coverImageFile: event.target.files?.[0]})) }
            />
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => setPublisherForm(initialState)} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
            </Box>
        </Box>
}

export default PublisherForm
export type {PublisherFormProps}