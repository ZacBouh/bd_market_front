import TextField from "@mui/material/TextField"
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import PublisherAutocomplete from "../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete"
import dayjs from "dayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import FileInput from "../Fields/FileUpload/FileInput"
import objectToFormData from "@/utils/formData"
import { createPublisherCollection } from "@/backend/api/publisherCollection"
import LanguageSelect from "../Fields/Select/LanguageSelect/LanguageSelect"
import FormLayout, { FormLayoutSurface } from "../FormLayout/FormLayout"
import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"

export type AddPublisherCollectionFormProps = {
    prePopulatedInputs?: (Partial<NewPublisherCollection> & { publisher?: CreatedPublisher }) & { id?: number }
    surface?: FormLayoutSurface
    onSubmit?: (formData: FormData, state: Partial<NewPublisherCollection>) => Promise<unknown> | unknown
    submitLabel?: string
    onCollectionCreated?: (response?: ApiResponse) => void
}

const AddPublisherCollectionForm = (props: AddPublisherCollectionFormProps) => {
    const { prePopulatedInputs, surface = 'card', onSubmit, submitLabel, onCollectionCreated } = props
    const initialState = useMemo<Partial<NewPublisherCollection>>(() => ({
        name: prePopulatedInputs?.name ?? '',
        description: prePopulatedInputs?.description ?? '',
        language: prePopulatedInputs?.language ?? 'fr',
        publisherId: prePopulatedInputs?.publisherId ?? prePopulatedInputs?.publisher?.id,
        birthDate: prePopulatedInputs?.birthDate,
        deathDate: prePopulatedInputs?.deathDate,
    }), [prePopulatedInputs])
    const [collection, setCollection] = useState<Partial<NewPublisherCollection>>(initialState)
    const [selectedPublisher, setSelectedPublisher] = useState<CreatedPublisher | undefined>(prePopulatedInputs?.publisher)

    useEffect(() => {
        setCollection(initialState)
    }, [initialState])

    useEffect(() => {
        setSelectedPublisher(prePopulatedInputs?.publisher)
    }, [prePopulatedInputs?.publisher])

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.stopPropagation()
        event.preventDefault()
        console.log("Publisher Collection form ", collection)
        const formData = objectToFormData(collection)
        if (collection.language) {
            formData.set('language', collection.language)
        }
        if (onSubmit) {
            await onSubmit(formData, collection)
        } else {
            const response = await createPublisherCollection(formData)
            onCollectionCreated && onCollectionCreated(response)
            setCollection(initialState)
            setSelectedPublisher(prePopulatedInputs?.publisher)
        }
    }, [collection, initialState, onCollectionCreated, onSubmit, prePopulatedInputs?.publisher])

    return <FormLayout
        surface={surface}
        onSubmit={handleSubmit}
    >
        <TextField
            label='Name'
            value={collection?.name}
            onChange={(event) => setCollection(collection => ({...collection, name: event.target.value }))}
            required
        />
        <PublisherAutocomplete
            onChange={(_, publisher) => {
                setSelectedPublisher(publisher ?? undefined)
                setCollection(collection => ({...collection, publisherId: publisher?.id}))
            } }
            required
            value={selectedPublisher}
        />
        <TextField
            label='Description'
            value={collection?.description}
            onChange={(event) => setCollection(collection => ({...collection, description: event.target.value }))}
            multiline
            rows={3}
        />
        <DatePicker
            label="Creation Date"
            value={collection.birthDate ? dayjs(collection.birthDate) : null}
            onChange={(newDate) => setCollection((publisher) => ({...publisher, birthDate: newDate && dayjs(newDate).isValid() ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : undefined}))}
            slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
            label="End Date"
            value={collection.deathDate ? dayjs(collection.deathDate) : null}
            onChange={(newDate) => setCollection((publisher) => ({...publisher, deathDate: newDate && dayjs(newDate).isValid() ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : undefined}))}
            slotProps={{ textField: { fullWidth: true } }}
        />
        <FileInput
                label={"Choose a logo"}
                accept='image/*'
                direction="column"
                spacing={1}
                onFileChange={(event) => setCollection(collection => ({...collection, coverImageFile: event.target.files?.[0]})) }
        />
        <LanguageSelect
            defaultValue={collection.language}
            onChange={(lang) => setCollection(collection => ({...collection, language: lang.value}))}
        />
        <FormSubmitAndResetButtons
            state={collection}
            handleReset={() => {
                setCollection(initialState)
                setSelectedPublisher(prePopulatedInputs?.publisher)
            }}
            submitLabel={submitLabel ?? "Create collection"}
        />
    </FormLayout>
}

export default AddPublisherCollectionForm
