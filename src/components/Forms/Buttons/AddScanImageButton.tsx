import Card from "@mui/material/Card/Card"
import Modal from "@mui/material/Modal/Modal"
import ScanForm from "../ScanForm/ScanForm"
import CardContent from "@mui/material/CardContent/CardContent"
import Typography from "@mui/material/Typography/Typography"
import AddPhotoIcon from "@mui/icons-material/AddAPhoto"
import { useState } from "react"
import { Box } from "@mui/material"

type AddScanImageButtonProps = {
    label: string,
    onSelectedImage: (imageFile : File) => unknown
    selectedImage?: File
}

type AddScanImageButtonState = {
    modalOpen : boolean
    selectedImage?: File
}

const AddScanImageButton = (props: AddScanImageButtonProps) => {
    const [state, setState] = useState<AddScanImageButtonState>({
        modalOpen: false,
        selectedImage: undefined,
    })
    const selectedImage = props.selectedImage ?? state.selectedImage
    return <Box display={"flex"} justifyContent={'center'} >
        <Card onClick={() => setState(state => ({...state, modalOpen: true}))} sx={{px: 4}} >
        <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: 400, maxWidth: 200, justifyContent: 'center' }} >
            {!selectedImage && 
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} component={'div'} >
                    <AddPhotoIcon sx={{fontSize: 150}} />
                    <Typography >{props.label ?? 'Add Image'}</Typography>
                </Box>
            }
            {selectedImage && 
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "space-between",  my: 2}}>
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        style={{
                            inset: 0,
                            width: 'auto',
                            height: selectedImage ? 300 : 'auto',
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
            sx={{display: "flex", justifyContent: 'center', alignItems: "center"}}
        >   
        <Box sx={{bgcolor: 'background.paper', height: 'fit-content', minHeight: '50%', minWidth: '80%', padding: 2, display: "flex", justifyContent: "center",alignItems : 'center'}} >            
            <ScanForm
                onCropImage={(image) =>{
                    if (props.onSelectedImage){
                        console.log('WERE ARE GERE')
                        props.onSelectedImage(image)
                        setState(state => ({...state, modalOpen: false}))                     
                    } else {
                        setState(state => ({...state, selectedImage: image, modalOpen: false}))                     
                    }
                }}
            />
        </Box>
        </Modal>
    </Box>
}

export default AddScanImageButton