import AddScanImageButton from "@/components/Forms/Buttons/AddScanImageButton"
import { Box,  Container,  Stack,  } from "@mui/material"
import { useEffect, useState } from "react"
import indexStorage from "@/store/indexedDbStorage"
import FormSubmitAndResetButtons from "@/components/Forms/Buttons/FormSubmitAndResetButtons"
import objectToFormData from "@/utils/formData"
import { scanPicture } from "@/backend/api/scan"
import ScanResultHandler from "./ScanResultHandler"
import type { ScanResultHandlerProps } from "./ScanResultHandler"

export type ScanPageState = {
    BACK_COVER?: File,
    FRONT_COVER?: File,
    SPINE?: File
    hasScanResult: boolean, 
    scanResult?:  ScanResultHandlerProps['data']
} 

const ScanPage = () => {
    const [state, setState] = useState<ScanPageState>({hasScanResult: false}) 
    const [hydrated, setHydrated] = useState(false)
    const [get, set, remove] = indexStorage
    
    useEffect(() => {
        console.log('loading files from index')
        get('scanPageState', {hasScanResult: false})
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
  
    return <Container sx={{maxWidth: '100vw'}}>
            {!state.hasScanResult && 
                <Box component={'form'} onSubmit={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    const payload = objectToFormData(state)
                    scanPicture(payload, (data) =>{
                        console.log("Scan Picture response", data)
                        setState(state => ({...state, hasScanResult: true, scanResult: data}))
                    })
                }}  sx={{maxWidth: '100%'}} >
                
                    <Stack direction="row" gap={4} maxWidth={'100vw'} >
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
                                setState({hasScanResult: false})
                            }}
                        />
                    }
                </Box>
            }
            {state.hasScanResult && 
                <ScanResultHandler
                    resetHandler={() => setState(state => ({...state, hasScanResult: false}))}
                    data={state.scanResult}
                />
            }
    </Container>
}

export default ScanPage