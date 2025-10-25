import TextField from "@mui/material/TextField"
import { useEffect, useMemo, useState } from "react"
import PublisherAutocomplete from "../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete"
import dayjs from "dayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import FileInput from "../Fields/FileUpload/FileInput"
import objectToFormData from "@/utils/formData"
import { createPublisherCollection } from "@/backend/api/publisherCollection"
import LanguageSelect from "../Fields/Select/LanguageSelect/LanguageSelect"
import FormLayout, { FormLayoutSurface } from "../FormLayout/FormLayout"
import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"

type AddPublisherCollectionFormProps = {
    prePopulatedInputs?: Partial<NewPublisherCollection> & { publisher?: CreatedPublisher }
    surface?: FormLayoutSurface
}

const AddPublisherCollectionForm = (props: AddPublisherCollectionFormProps) => {
    const { prePopulatedInputs, surface = 'card' } = props
    const initialState = useMemo<Partial<NewPublisherCollection>>(() => ({
        name: prePopulatedInputs?.name ?? '',
        description: prePopulatedInputs?.description ?? '',
        language: prePopulatedInputs?.language ?? 'fr',
        publisherId: prePopulatedInputs?.publisherId,
        birthDate: prePopulatedInputs?.birthDate,
        deathDate: prePopulatedInputs?.deathDate,
    }), [prePopulatedInputs])
    const [collection, setCollection] = useState<Partial<NewPublisherCollection>>(initialState)

    useEffect(() => {
        setCollection(initialState)
    }, [initialState])

    return <FormLayout
        surface={surface}
        onSubmit={(event) =>{
            event.stopPropagation()
            event.preventDefault()
            console.log("Publisher Collection form ", collection)
            const formData = objectToFormData(collection)
            createPublisherCollection(formData)
        }}
    >
        <TextField
            label='Name'
            value={collection?.name}
            onChange={(event) => setCollection(collection => ({...collection, name: event.target.value }))}
            required
        />
        <PublisherAutocomplete
            onChange={(_, publisher) => setCollection(collection => ({...collection, publisherId: publisher?.id})) }
            required
            value={prePopulatedInputs?.publisher ?? undefined}
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
            onChange={(newDate) => setCollection((publisher) => ({...publisher, birthDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
            label="End Date"
            value={collection.deathDate ? dayjs(collection.deathDate) : null}
            onChange={(newDate) => setCollection((publisher) => ({...publisher, deathDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
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
            onChange={(lang) => setCollection(collection => ({...collection, language: lang.value}))}
        />
        <FormSubmitAndResetButtons
            state={collection}
            handleReset={() => setCollection(() => ({ ...initialState }))}
            submitLabel="Create collection"
        />
    </FormLayout>
}

export default AddPublisherCollectionForm
