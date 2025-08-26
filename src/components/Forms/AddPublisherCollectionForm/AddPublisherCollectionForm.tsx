import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import PublisherAutocomplete from "../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete"
import dayjs from "dayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import FileInput from "../Fields/FileUpload/FileInput"

const AddPublisherCollectionForm = () => {
    const initialState : Partial<NewPublisherCollection> = {
        name: ''
    }
    const [collection, setCollection] = useState<Partial<NewPublisherCollection>>(initialState)
    return <Box component='form'
        onSubmit={(event) =>{
            event.stopPropagation()
            event.preventDefault()
            console.log("Publisher Collection form ", collection)
        }}
    >
        <TextField
            label='Name'
            value={collection?.name}
            onChange={(event) => setCollection(collection => ({...collection, name: event.target.value }))}
            fullWidth
            required
        />
        <PublisherAutocomplete
            onChange={(_, publisher) => setCollection(collection => ({...collection, publisherId: publisher?.id})) }
            required
        />
        <TextField
            label='Description'
            value={collection?.description}
            onChange={(event) => setCollection(collection => ({...collection, description: event.target.value }))}
            fullWidth
            multiline
            rows={3}
        />
        <DatePicker 
            label="Creation Date"
            value={collection.birthDate ? dayjs(collection.birthDate) : null}
            onChange={(newDate) => setCollection((publisher) => ({...publisher, birthDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
        />
        <DatePicker 
            label="End Date"
            value={collection.deathDate ? dayjs(collection.deathDate) : null}
            onChange={(newDate) => setCollection((publisher) => ({...publisher, deathDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
        />
        <FileInput
                label={"Choose a logo"}
                accept='image/*'
                onFileChange={(event) => setCollection(collection => ({...collection, coverImageFile: event.target.files?.[0]})) }
        />
        <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => console.log("clicked reset, not implemented")} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
        </Box>
    </Box>
}

export default AddPublisherCollectionForm