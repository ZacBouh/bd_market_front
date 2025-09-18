import Card from "@mui/material/Card/Card"
import Modal from "@mui/material/Modal/Modal"
import ScanForm from "../ScanForm/ScanForm"
import CardContent from "@mui/material/CardContent/CardContent"
import Typography from "@mui/material/Typography/Typography"
import AddPhotoIcon from "@mui/icons-material/AddAPhoto"
import { useState } from "react"
import { Box } from "@mui/material"

type AddScanImageButtonProps = {
    label: string
}

type AddScanImageButtonState = {
    modalOpen : boolean
    selectedImage?: File
}

const AddScanImageButton = (props: AddScanImageButtonProps) => {
    const [state, setState] = useState<AddScanImageButtonState>({
        modalOpen: false,
        selectedImage: undefined 
    })
    
    return <Box>
        <Card onClick={() => setState(state => ({...state, modalOpen: true}))} >
        <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: 400, maxWidth: 200}} >
            {!state.selectedImage && 
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} component={'div'} >
                    <AddPhotoIcon sx={{fontSize: 150}} />
                    <Typography >{props.label ?? 'Add Image'}</Typography>
                </Box>
            }
            {state.selectedImage && 
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <img
                        src={URL.createObjectURL(state.selectedImage)}
                        style={{
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                    <Typography sx={{mt: 2}} >{props.label ?? 'Add Image'}</Typography>
                </Box>
            }
        </CardContent>
    </Card>
        <Modal 
            open={state.modalOpen}
            onClose={() => setState(state => ({...state, modalOpen: false}))}
        >   
        <Box>
            <ScanForm
                onCropImage={(image) =>{
                    setState(state => ({...state, selectedImage: image, modalOpen: false}))                     
                }}
            />
        </Box>
        </Modal>
    </Box>
}

export default AddScanImageButton