import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createPublisher } from '@/backend/api/publisher';
import { useCallback, useEffect, useState } from 'react';
import objectToFormData from '@/utils/formData';
import FileInput from '../Fields/FileUpload/FileInput';
import FormLayout, { FormLayoutSurface } from '../FormLayout/FormLayout';
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons';

type PublisherFormProps = {
    prePopulatedName?: string,
    onSuccess?: (createdPublisher? : CreatedPublisher) => void
    surface?: FormLayoutSurface
    publisher?: CreatedPublisher | null
    onSubmit?: (formData: FormData, state: NewPublisher) => Promise<unknown> | unknown
    submitLabel?: string
}

const PublisherForm = (props : PublisherFormProps) => {
    const {prePopulatedName, onSuccess, surface = 'card', publisher, onSubmit, submitLabel} = props
    const createInitialState = useCallback((): NewPublisher => ({
        name: publisher?.name ?? prePopulatedName ?? '',
        description: publisher?.description ?? '',
        birthDate: publisher?.birthDate ?? null,
        deathDate: publisher?.deathDate ?? null,
        coverImageFile: undefined,
    }), [prePopulatedName, publisher?.birthDate, publisher?.deathDate, publisher?.description, publisher?.name])

    const [publisherForm, setPublisherForm] = useState<NewPublisher>(() => createInitialState())

    useEffect(() => {
        setPublisherForm(createInitialState())
    }, [createInitialState])

    return <FormLayout onSubmit={async (event) => {
            event.stopPropagation()
            event.preventDefault()
            console.log("Form submitted", publisherForm)
            const formData = objectToFormData(publisherForm)
            if (onSubmit) {
                await onSubmit(formData, publisherForm)
            } else {
                const createdPublisher = await createPublisher(formData)
                console.log("Publisher Form Response", createdPublisher)
                onSuccess && onSuccess(createdPublisher)
                setPublisherForm(createInitialState())
            }
        }}
        surface={surface}
        >
            <TextField
            label="Name"
            value={publisherForm.name}
            onChange={(event) => setPublisherForm((publisherState) => ({...publisherState, name: event.target.value}))}
            required
            />
            <TextField
            label="Description"
            value={publisherForm.description ?? ''}
            onChange={(event) => setPublisherForm((publisherState) => ({...publisherState, description: event.target.value}))}
            multiline
            rows={3}
            />
            <DatePicker
            label="Creation Date"
            value={publisherForm.birthDate ? dayjs(publisherForm.birthDate) : null}
            onChange={(newDate) => setPublisherForm((publisherState) => ({...publisherState, birthDate: newDate ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : null}))}
            slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
            label="Death Date"
            value={publisherForm.deathDate ? dayjs(publisherForm.deathDate) : null}
            onChange={(newDate) => setPublisherForm((publisherState) => ({...publisherState, deathDate: newDate ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : null}))}
            slotProps={{ textField: { fullWidth: true } }}
            />
            <FileInput
                label={"Choose a logo"}
                accept='image/*'
                direction="column"
                spacing={1}
                onFileChange={(event) => setPublisherForm(publisherFormState => ({...publisherFormState, coverImageFile: event.target.files?.[0]})) }
            />
            <FormSubmitAndResetButtons
                state={publisherForm}
                handleReset={() => setPublisherForm(() => createInitialState())}
                submitLabel={submitLabel ?? "Save publisher"}
            />
        </FormLayout>
}

export default PublisherForm
export type {PublisherFormProps}
