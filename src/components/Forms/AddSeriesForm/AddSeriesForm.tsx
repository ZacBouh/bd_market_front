import { Box, Button, TextField } from "@mui/material"
import { useState } from "react"
import PublisherAutocomplete from "../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete"
import FileInput from "../Fields/FileUpload/FileInput"
import LanguageSelect from "../Fields/Select/LanguageSelect/LanguageSelect"
import OnGoingStatusSelect from "../Fields/Select/OnGoingStatusSelect/OnGoingStatusSelect"
import objectToFormData from "@/utils/formData"
import { createSeries } from "@/backend/api/series"

const AddSeriesForm = () => {
    const initialState : Partial<NewSeries> = {
        name: '',
        language: 'fr',
    } 
    const [newSeries, setNewSeries] = useState<Partial<NewSeries>>(initialState)
    return <Box component={'form'}
        onSubmit={(event) =>{
            event.preventDefault()
            event.stopPropagation()
            console.log('Submitted form ', newSeries)
            const formdata = objectToFormData(newSeries)
            console.log(formdata)
            createSeries(formdata)
        }}
    >
        <TextField
            label={'Name'}
            value={newSeries?.name}
            required
            fullWidth
            onChange={(event) => setNewSeries(series => ({...series, name: event.target.value}))}
        />
        <PublisherAutocomplete
            onChange={(_, publisher) => setNewSeries(series => ({...series, publisherId: publisher?.id}))}
            required
        />
        <FileInput 
              label={"Choose a cover image"}
              accept='image/*'
              onFileChange={(event) => setNewSeries(series => ({...series, coverImageFile: event.target.files?.[0]})) } 
          />
        <LanguageSelect
            onChange={(lang) => setNewSeries(series => ({...series, language: lang?.value})) }
            required
        />
        <OnGoingStatusSelect
            onChange={(status) => setNewSeries(series => ({...series, onGoingStatus: status?.value}))}
        />
        <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => console.log("clicked reset, not implemented")} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
        </Box>
    </Box>
}

export default AddSeriesForm