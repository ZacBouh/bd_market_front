import { TextField } from "@mui/material"
import { useState } from "react"
import PublisherAutocomplete from "../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete"
import FileInput from "../Fields/FileUpload/FileInput"
import LanguageSelect from "../Fields/Select/LanguageSelect/LanguageSelect"
import OnGoingStatusSelect from "../Fields/Select/OnGoingStatusSelect/OnGoingStatusSelect"
import objectToFormData from "@/utils/formData"
import { createSeries } from "@/backend/api/series"
import { SupportedLanguage } from "@/types/common"
import FormLayout, { FormLayoutSurface } from "../FormLayout/FormLayout"
import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"

export type AddSeriesFormProps = {
    prePopulatedName?:string,
    prePolutatedLanguage?: SupportedLanguage,
    onSeriesCreated?: (series: CreatedSeries) => any
    surface?: FormLayoutSurface
}

const AddSeriesForm = (props: AddSeriesFormProps) => {
    const { prePopulatedName, prePolutatedLanguage, onSeriesCreated, surface = 'card' } = props
    const initialState : Partial<NewSeries> = {
        name: prePopulatedName ?? '',
        language: prePolutatedLanguage ?? 'fr',
    }
    const [newSeries, setNewSeries] = useState<Partial<NewSeries>>(initialState)
    return <FormLayout
        surface={surface}
        onSubmit={async (event) =>{
            event.preventDefault()
            event.stopPropagation()
            console.log('Submitted form ', newSeries)
            const formdata = objectToFormData(newSeries)
            console.log(formdata)
            const createdSeries = await createSeries(formdata)
            onSeriesCreated && onSeriesCreated(createdSeries)
        }}
    >
        <TextField
            label={'Name'}
            value={newSeries?.name}
            required
            onChange={(event) => setNewSeries(series => ({...series, name: event.target.value}))}
        />
        <PublisherAutocomplete
            onChange={(_, publisher) => setNewSeries(series => ({...series, publisherId: publisher?.id}))}
            required
        />
        <FileInput
              label={"Choose a cover image"}
              accept='image/*'
              direction="column"
              spacing={1}
              onFileChange={(event) => setNewSeries(series => ({...series, coverImageFile: event.target.files?.[0]})) }
          />
        <LanguageSelect
            defaultValue={props.prePolutatedLanguage}
            onChange={(lang) => setNewSeries(series => ({...series, language: lang?.value})) }
            required
        />
        <OnGoingStatusSelect
            onChange={(status) => setNewSeries(series => ({...series, onGoingStatus: status?.value}))}
        />
        <FormSubmitAndResetButtons
            state={newSeries}
            handleReset={() => setNewSeries(() => ({ ...initialState }))}
            submitLabel="Create series"
        />
    </FormLayout>
}

export default AddSeriesForm
