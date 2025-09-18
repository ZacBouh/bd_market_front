import AddScanImageButton from "@/components/Forms/Buttons/AddScanImageButton"
import ScanForm from "@/components/Forms/ScanForm/ScanForm"


import { Card, CardContent, Container, Modal, Stack, Typography } from "@mui/material"


const ScanPage = () => {
    return <Container>
            <Stack direction="row">
                <AddScanImageButton 
                    label="Back Cover"
                />
            </Stack>
        </Container>
}

export default ScanPage