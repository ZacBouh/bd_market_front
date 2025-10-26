import { TextField } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import PublisherAutocomplete from "../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete"
import FileInput from "../Fields/FileUpload/FileInput"
import LanguageSelect from "../Fields/Select/LanguageSelect/LanguageSelect"
import OnGoingStatusSelect from "../Fields/Select/OnGoingStatusSelect/OnGoingStatusSelect"
import objectToFormData from "@/utils/formData"
import { createSeries } from "@/backend/api/series"
import { SupportedLanguage } from "@/types/common"
import FormLayout, { FormLayoutSurface } from "../FormLayout/FormLayout"
import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"
import { SupportedOnGoingStatus } from "@/types/enums/onGoingStatus"

export type AddSeriesFormProps = {
    prePopulatedName?:string,
    prePolutatedLanguage?: SupportedLanguage,
    onSeriesCreated?: (series: CreatedSeries) => any
    surface?: FormLayoutSurface
    initialValues?: Partial<NewSeries> & { publisher?: CreatedPublisher }
    onSubmit?: (formData: FormData, state: Partial<NewSeries>) => Promise<unknown> | unknown
    submitLabel?: string
}

const AddSeriesForm = (props: AddSeriesFormProps) => {
    const { prePopulatedName, prePolutatedLanguage, onSeriesCreated, surface = 'card', initialValues, onSubmit, submitLabel } = props
    const createInitialState = useCallback((): Partial<NewSeries> => ({
        name: initialValues?.name ?? prePopulatedName ?? '',
        language: initialValues?.language ?? prePolutatedLanguage ?? 'fr',
        publisherId: initialValues?.publisherId ?? initialValues?.publisher?.id,
        onGoingStatus: initialValues?.onGoingStatus,
    }), [initialValues?.language, initialValues?.name, initialValues?.onGoingStatus, initialValues?.publisher?.id, initialValues?.publisherId, prePolutatedLanguage, prePopulatedName])

    const [newSeries, setNewSeries] = useState<Partial<NewSeries>>(() => createInitialState())
    const [selectedPublisher, setSelectedPublisher] = useState<CreatedPublisher | undefined>(initialValues?.publisher)

    useEffect(() => {
        setNewSeries(createInitialState())
    }, [createInitialState])

    useEffect(() => {
        setSelectedPublisher(initialValues?.publisher)
    }, [initialValues?.publisher])

    return <FormLayout
        surface={surface}
        onSubmit={async (event) =>{
            event.preventDefault()
            event.stopPropagation()
            console.log('Submitted form ', newSeries)
            const formdata = objectToFormData(newSeries)
            if (newSeries.language) {
                formdata.set('language', newSeries.language)
            }
            if (newSeries.onGoingStatus) {
                formdata.set('onGoingStatus', newSeries.onGoingStatus)
            }
            if (onSubmit) {
                await onSubmit(formdata, newSeries)
            } else {
                const createdSeries = await createSeries(formdata)
                onSeriesCreated && onSeriesCreated(createdSeries)
                setNewSeries(createInitialState())
                setSelectedPublisher(initialValues?.publisher)
            }
        }}
    >
        <TextField
            label={'Name'}
            value={newSeries?.name}
            required
            onChange={(event) => setNewSeries(series => ({...series, name: event.target.value}))}
        />
        <PublisherAutocomplete
            onChange={(_, publisher) => {
                setSelectedPublisher(publisher ?? undefined)
                setNewSeries(series => ({...series, publisherId: publisher?.id}))
            }}
            required
            value={selectedPublisher}
        />
        <FileInput
              label={"Choose a cover image"}
              accept='image/*'
              direction="column"
              spacing={1}
              onFileChange={(event) => setNewSeries(series => ({...series, coverImageFile: event.target.files?.[0]})) }
          />
        <LanguageSelect
            defaultValue={newSeries.language as SupportedLanguage}
            onChange={(lang) => setNewSeries(series => ({...series, language: lang?.value})) }
            required
        />
        <OnGoingStatusSelect
            defaultValue={newSeries.onGoingStatus as SupportedOnGoingStatus}
            onChange={(status) => setNewSeries(series => ({...series, onGoingStatus: status?.value}))}
        />
        <FormSubmitAndResetButtons
            state={newSeries}
            handleReset={() => {
                setNewSeries(createInitialState())
                setSelectedPublisher(initialValues?.publisher)
            }}
            submitLabel={submitLabel ?? "Create series"}
        />
    </FormLayout>
}

export default AddSeriesForm
