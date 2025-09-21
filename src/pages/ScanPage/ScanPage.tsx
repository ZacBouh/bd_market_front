import AddScanImageButton from "@/components/Forms/Buttons/AddScanImageButton"
import { Button, Card, CardContent, Container, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import indexStorage from "@/store/indexedDbStorage"
import FormSubmitAndResetButtons from "@/components/Forms/Buttons/FormSubmitAndResetButtons"
import objectToFormData from "@/utils/formData"

export type ScanPageState = {
    BACK_COVER?: File,
    FRONT_COVER?: File,
    SPINE?: File
} 

const ScanPage = () => {
    const [state, setState] = useState<ScanPageState>({}) 
    const [hydrated, setHydrated] = useState(false)
    const [get, set, remove] = indexStorage
    
    useEffect(() => {
        console.log('loading files from index')
        get('scanPageState', {})
        .then(storedState =>{
            setState(storedState)
            setHydrated(true)
        })
    },[])

    useEffect(() => {
        if(hydrated){
            console.log('storing file in index')
            set('scanPageState', state)
        }
    }, [state])

    const hasFile = Object.keys(state).filter(key => state[key as keyof typeof state] instanceof File).length > 0
    console.log("has file : %s", hasFile)
  
    return <Container component={'form'} onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        const payload = objectToFormData(state)
        
    }} >
                <Stack direction="row" gap={4}>
                    <AddScanImageButton 
                        label="Front Cover"
                        onSelectedImage={(imageFile) => setState(state => ({...state, FRONT_COVER: imageFile})) }
                        selectedImage={state.FRONT_COVER}
                    />
                    <AddScanImageButton 
                        label="Back Cover"
                        onSelectedImage={(imageFile) => setState(state => ({...state, BACK_COVER: imageFile}))}
                        selectedImage={state.BACK_COVER}
                    />
                    <AddScanImageButton 
                        label="Spine"
                        onSelectedImage={(imageFile) => setState(state => ({...state, SPINE: imageFile})) }
                        selectedImage={state.SPINE}
                    />
                </Stack>
                {hasFile && 
                    <FormSubmitAndResetButtons
                        state={state}
                        handleReset={() => {
                            remove('scanPageState')
                            setState({})
                        }}
                    />
                }
            </Container>
}

export default ScanPage