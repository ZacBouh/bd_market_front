import Box from "@mui/material/Box"
import FileInput from "../Fields/FileUpload/FileInput"
import { Stack } from "@mui/material"
import StandardSelect from "../Fields/Select/StandardSelect/StandardSelect"
import type { ComicBookScanPart } from "@/types/common"
import { ComicBookScanPart as comicBookScanPartOptions } from "@/types/enums/BookScanPart"
import { useEffect, useMemo, useState } from "react"
import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"
import objectToFormData from "@/utils/formData"
import { scanPicture } from "@/backend/api/scan"
import ImageCrop from "../ImageCrop/ImageCrop"

type ScanPartOption<T extends  ComicBookScanPart = ComicBookScanPart> = {
    label: typeof ComicBookScanPart[T]
    value: T 
}

type ScanFormProps = {
    selectBookPart? : true
    onFileChange?: (file : File) => unknown
    onBookPartChange?: (bookPart : ComicBookScanPart) => unknown 
    onCropImage?: (croppedImageFile: File) => unknown
}

type ScanFormState = ScanPartOption & Partial<Record<ComicBookScanPart, File>>


const ScanForm = (props : ScanFormProps) => {
    const defaultValue : ScanPartOption = {
        value: 'BACK_COVER',
        label: 'Back Cover'
    }
    const [state, setState] = useState<ScanFormState>(defaultValue)
    const options : ScanPartOption[] = Object.keys(comicBookScanPartOptions).map(option => ({value : option as ComicBookScanPart, label: comicBookScanPartOptions[option as ComicBookScanPart]})) 
    const file = state[state.value]
    const imageUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file])
    useEffect(() => {
        return () => {
            if(imageUrl) URL.revokeObjectURL(imageUrl)
        }
    }, [imageUrl])
    return <Box component='form'
        onSubmit={event => {
            event.preventDefault()
            event.stopPropagation()
            const payload = objectToFormData(state) 
            console.log(state)
            console.log(payload)
            scanPicture(payload)
        }}  
    >
        <Stack>
        <FileInput
            label={"Select Picture File"}
            inputName={state.value}
            onFileChange={(event) =>{
                const newState : ScanFormState = {...state}
                const file =  event.target.files?.[0]
                newState[state.value] = file
                setState(newState)
                props.onFileChange && file && props.onFileChange(file)
            }}
        />
        { props.selectBookPart && 
            <StandardSelect<ScanPartOption<ComicBookScanPart>, false>
                multiple={false}
                defaultValue={defaultValue}
                options={options}
                onChange={value => {
                    const newState : ScanFormState = {...state, ...value}   
                    const fileEntryLabel = Object.keys(newState).filter(key => Object.keys(comicBookScanPartOptions).includes(key)) as ComicBookScanPart[]
                    if(fileEntryLabel.length > 0){
                        newState[value.value] = newState[fileEntryLabel[0]]
                        delete newState[fileEntryLabel[0]] 
                    } 
                    setState(newState)
                    props.onBookPartChange && props.onBookPartChange(value.value)
                    console.log(`Selected value for Scanning ${value}`)
                }}    
            />        
        }
        </Stack>
        {file && 
            <ImageCrop 
                imgUrl={imageUrl ?? ''}
                clampInside={true}
                onCrop={(croppedImage) => {
                    setState(state => {
                        const newState = {...state}
                        newState[state.value] = croppedImage.file
                        return newState
                    })
                    props.onCropImage && props.onCropImage(croppedImage.file)
                }}
            />
        }
        <FormSubmitAndResetButtons
          state={state}  
        />
    </Box>
}
export default ScanForm