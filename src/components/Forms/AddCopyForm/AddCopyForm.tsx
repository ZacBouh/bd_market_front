import { Box, Button } from "@mui/material"
import TitleAutocomplete from "../Fields/Autocomplete/TitleAutocomplete/TitleAutocomplete"
import { useUser } from "@/hooks/useUser"
import { useState } from "react"
import CopyConditionSelect from "../Fields/Select/CopyConditionSelect/CopyConditionSelect"
import FileInput from "../Fields/FileUpload/FileInput"
import PriceInputSelect from "../Fields/Select/PriceInputSelect/PriceInputSelect"
import { createCopy } from "@/backend/api/copy"
import objectToFormData from "@/utils/formData"


const AddCopyForm = () => {
    const {user} = useUser()
    const initialState : NewCopy = {
        titleId: null,
        ownerId: user?.user.id ?? null,
        boughtForCurrency: 'euro',
        currency: 'euro'
    }
    const [newCopy, setNewCopy] = useState<NewCopy>(initialState)
    return <Box component='form'
        onSubmit={(event) => {
            event.stopPropagation()
            event.preventDefault()
            console.log("Add Copy Form Submitted", newCopy)
            createCopy(objectToFormData(newCopy))
        }}
        sx={{width: '100%'}}
    >
        
        <TitleAutocomplete 
            onChangeCallback={(_, title) => setNewCopy(newCopy => ({...newCopy, titleId: title?.id}))} 
        />
        <CopyConditionSelect onChange={(condition) => setNewCopy(newCopy => ({...newCopy, copyCondition: condition.value})) }/>    
        <PriceInputSelect
            label="Sell Price"
            onChange={(price) => {
                const updatedCopy = {...newCopy, price: price.amount, currency: price.currency }
                setNewCopy(updatedCopy)
            } }
        />
        <PriceInputSelect
            label="Bought for"
            onChange={(price) => {
                const updatedCopy : NewCopy = {...newCopy, boughtForPrice: price.amount, boughtForCurrency: price.currency  }
                setNewCopy(updatedCopy)
            } }
        />
        <FileInput
            label="Choose an Image"
            accept="image/*"
            onFileChange={(event) => setNewCopy(newCopy => ({...newCopy, coverImageFile: event.target.files?.[0]})) }
        />
        <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => console.log("clicked reset, not implemented")} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
        </Box>
    </Box>
}

export default AddCopyForm