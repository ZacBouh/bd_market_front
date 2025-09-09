import Box from "@mui/material/Box"
import FileInput from "../Fields/FileUpload/FileInput"
import { Stack } from "@mui/material"
import StandardSelect from "../Fields/Select/StandardSelect/StandardSelect"
import type { ComicBookScanPart } from "@/types/common"
import { ComicBookScanPart as comicBookScanPartOptions } from "@/types/enums/BookScanPart"
import { useState } from "react"
import FormSubmitAndResetButtons from "../Buttons/FormSubmitAndResetButtons"
import objectToFormData from "@/utils/formData"
import { scanPicture } from "@/backend/api/scan"
import ImageCrop from "../ImageCrop/ImageCrop"

type ScanPartOption<T extends  ComicBookScanPart = ComicBookScanPart> = {
    label: typeof ComicBookScanPart[T]
    value: T 
}

type ScanFormState = ScanPartOption & Partial<Record<ComicBookScanPart, File>>


const ScanForm = () => {
    const defaultValue : ScanPartOption = {
        value: 'BACK_COVER',
        label: 'Back Cover'
    }
    const [state, setState] = useState<ScanFormState>(defaultValue)
    const options : ScanPartOption[] = Object.keys(comicBookScanPartOptions).map(option => ({value : option as ComicBookScanPart, label: comicBookScanPartOptions[option as ComicBookScanPart] })) 
    const file = state[state.value]
    return <Box component='form'
        onSubmit={event => {
            event.preventDefault()
            event.stopPropagation()
            const payload = objectToFormData(state) 
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
                newState[state.value] =  event.target.files?.[0]
                setState(newState)
            }}
        />
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
                console.log(`Selected value for Scanning ${value}`)
            }}    
        />        
        </Stack>
        {file && 
            <ImageCrop 
                imgUrl={URL.createObjectURL(file)}
                clampInside={true}
            />
        }
        <FormSubmitAndResetButtons
          state={state}  
        />
    </Box>
}
export default ScanForm