import AddPublisherCollectionForm from "@/components/Forms/AddPublisherCollectionForm/AddPublisherCollectionForm"
import { Container, Typography } from "@mui/material"

const PublisherCollectionPage = () => {
    return <Container>
        <Typography variant="h3" >Add a Collection</Typography>
        <AddPublisherCollectionForm/>
    </Container>
}

export default PublisherCollectionPage