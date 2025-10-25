import { TextField } from '@mui/material';
import { newPublisherForm, initialState } from './atom';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createPublisher } from '@/backend/api/publisher';
import { useEffect } from 'react';
import objectToFormData from '@/utils/formData';
import FileInput from '../Fields/FileUpload/FileInput';
import FormLayout from '../FormLayout/FormLayout';
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons';

type PublisherFormProps = {
    prePopulatedName?: string,
    onSuccess?: (createdPublisher? : CreatedPublisher) => void
}

const PublisherForm = (props : PublisherFormProps) => {
    const {prePopulatedName, onSuccess} = props
    const [publisherForm, setPublisherForm] = useAtom<NewPublisher>(newPublisherForm)
    useEffect(() => {
        prePopulatedName && setPublisherForm((publisher) => ({...publisher, name: prePopulatedName}))
    }
     ,[prePopulatedName, setPublisherForm])

    return <FormLayout onSubmit={async (event) => {
            event.stopPropagation()
            event.preventDefault()
            console.log("Form submitted", publisherForm)
            const createdPublisher = await createPublisher(objectToFormData(publisherForm))
            console.log("Publisher Form Response", createdPublisher)
            onSuccess && onSuccess(createdPublisher)
        }}
        >
            <TextField
            label="Name"
            value={publisherForm.name}
            onChange={(event) => setPublisherForm((publisher) => ({...publisher, name: event.target.value}))}
            required
            />
            <TextField
            label="Description"
            value={publisherForm.description}
            onChange={(event) => setPublisherForm((publisher) => ({...publisher, description: event.target.value}))}
            multiline
            rows={3}
            />
            <DatePicker
            label="Creation Date"
            value={publisherForm.birthDate ? dayjs(publisherForm.birthDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, birthDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
            label="Death Date"
            value={publisherForm.deathDate ? dayjs(publisherForm.deathDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, deathDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            slotProps={{ textField: { fullWidth: true } }}
            />
            <FileInput
                label={"Choose a logo"}
                accept='image/*'
                direction="column"
                spacing={1}
                onFileChange={(event) => setPublisherForm(publisherForm => ({...publisherForm, coverImageFile: event.target.files?.[0]})) }
            />
            <FormSubmitAndResetButtons
                state={publisherForm}
                handleReset={() => setPublisherForm(() => ({ ...initialState }))}
                submitLabel="Enregistrer l'éditeur"
            />
        </FormLayout>
}

export default PublisherForm
export type {PublisherFormProps}
