import Modal from "@mui/material/Modal"
import AddCopyForm from "./AddCopyForm"
import { Button, Container, Stack, Typography } from "@mui/material"

type EditCopyModal = {
    open: boolean
    handleClose : (...args : any) => void
    copy : CreatedCopy | undefined
}

const EditCopyModal = (props : EditCopyModal) => {
    const { open, copy, handleClose } = props
    
    return <Modal 
        open={open}
        onClose={handleClose}
    >   
        <Container sx={{mt: 'auto'}}>
            <Stack>
                <Typography variant="h3" >Edit {copy?.title.name}</Typography>
                <Button onClick={() => handleClose()} >Close</Button>
            </Stack>
            <AddCopyForm
                copyToEdit={copy}
            />
        </Container>
    </Modal>
}

export default EditCopyModal