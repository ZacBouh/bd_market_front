import { Container, Typography } from '@mui/material';
import { Centered } from '@/components/styled';
import PublisherForm from '@/components/Forms/PublisherForm/PublisherForm';

function PublisherPage() {
  return (
    <>
      <meta name="title" content="Page 3" />
      <Container>
        <Centered>
          <Typography variant="h3">Add a Publisher</Typography>
          <PublisherForm/>
        </Centered>
      </Container>
    </>
  );
}

export default PublisherPage;
