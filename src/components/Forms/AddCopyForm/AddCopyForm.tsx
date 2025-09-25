import { Box, Button, Card, CardMedia } from "@mui/material"
import TitleAutocomplete from "../Fields/Autocomplete/TitleAutocomplete/TitleAutocomplete"
import { useUser } from "@/hooks/useUser"
import { useState } from "react"
import CopyConditionSelect from "../Fields/Select/CopyConditionSelect/CopyConditionSelect"
import FileInput from "../Fields/FileUpload/FileInput"
import PriceInputSelect from "../Fields/Select/PriceInputSelect/PriceInputSelect"
import { createCopy, updateCopy } from "@/backend/api/copy"
import objectToFormData from "@/utils/formData"
import { API_BASE_URL } from "@/backend/api/api"
import { title } from "process"

type AddCopyFormProps = {
    copyToEdit? : CreatedCopy,
    title?: CreatedTitle
}

const AddCopyForm = (props : AddCopyFormProps) => {
    const {copyToEdit} = props
    const {user} = useUser()
    const initialState : NewCopy = {
        ...copyToEdit,
        titleId: copyToEdit?.title?.id ?? props?.title?.id ,
        ownerId: copyToEdit?.owner?.id  ?? user?.user.id ?? null,
        boughtForCurrency: copyToEdit?.boughtForCurrency ?? 'euro',
        currency: copyToEdit?.currency ?? 'euro',
    }
    const prefilledCoverImageUrl = (() => {
        if(copyToEdit?.coverImage?.url) return copyToEdit?.coverImage?.url
        if(props.title?.coverImage?.url) return props.title?.coverImage?.url
        return false
    })()
    const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(prefilledCoverImageUrl ? API_BASE_URL+ prefilledCoverImageUrl :  undefined) 
    const [newCopy, setNewCopy] = useState<NewCopy>(initialState)
    return <Box component='form'
        onSubmit={(event) => {
            event.stopPropagation()
            event.preventDefault()
            console.log("Add Copy Form Submitted", newCopy)
            if(copyToEdit) {
                updateCopy(objectToFormData(newCopy))
                return 
            }
            createCopy(objectToFormData(newCopy))
        }}
        sx={{width: '100%'}}
    >
        
        <TitleAutocomplete 
            onChangeCallback={(_, title) => setNewCopy(newCopy => ({...newCopy, titleId: title?.id}))} 
            title={copyToEdit?.title ?? props?.title}
            disabled={(copyToEdit || props.title) ? true : false}
        />
        <CopyConditionSelect condition={copyToEdit?.copyCondition ?? ''} onChange={(condition) => setNewCopy(newCopy => ({...newCopy, copyCondition: condition.value})) }/>    
        <PriceInputSelect
            price={copyToEdit ? {amount: copyToEdit?.price ?? '', currency: (copyToEdit?.currency as AcceptedCurrency) ?? 'euro'} : undefined}
            label="Sell Price"
            onChange={(price) => {
                const updatedCopy = {...newCopy, price: price.amount, currency: price.currency }
                setNewCopy(updatedCopy)
            }}
        />
        <PriceInputSelect
            price={copyToEdit ? {amount: copyToEdit?.boughtForPrice ?? '', currency: (copyToEdit?.boughtForCurrency as AcceptedCurrency) ?? 'euro'} : undefined}
            label="Bought for"
            onChange={(price) => {
                const updatedCopy : NewCopy = {...newCopy, boughtForPrice: price.amount, boughtForCurrency: price.currency  }
                setNewCopy(updatedCopy)
            } }
        />
        { coverImagePreviewUrl && 
            <Box sx={{width: {xs: '100%', sm: '50%', md: '33.33%', lg: '25%'}, bgcolor: 'red'}}  >
                <Card
                sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                >
                    <CardMedia
                        component="img"
                        height="300"
                        image={coverImagePreviewUrl}
                        alt={copyToEdit?.coverImage?.imageName}
                    />
                </Card>
            </Box>
        }
        <FileInput
            label={copyToEdit?.coverImage? "Change cover image" : "Choose an Image"}
            accept="image/*"
            onFileChange={(event) => {
                setNewCopy(newCopy => ({...newCopy, coverImageFile: event.target.files?.[0]}))
                event.target.files?.[0] && setCoverImagePreviewUrl(URL.createObjectURL(event.target.files?.[0])) 
            }}
        />
        <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => console.log("clicked reset, not implemented")} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
        </Box>
    </Box>
}

export default AddCopyForm