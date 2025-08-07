import { Container, Typography } from '@mui/material';
import { Centered } from '@/components/styled';
import PublisherForm from '@/components/Forms/PublisherForm/PublisherForm';
import PublisherGallery from '@/components/Gallery/PublisherGallery/PublisherGallery';
import { usePublishers } from '@/hooks';

function PublisherPage() {
  const {publishers} = usePublishers()
  return (
    <>
      <meta name="title" content="Page 3" />
      <Container>
        <Centered>
          <Typography variant="h3">Add a Publisher</Typography>
          <PublisherForm/>
          <PublisherGallery publishers={publishers} />
        </Centered>
      </Container>
    </>
  );
}

export default PublisherPage;
