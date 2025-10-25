import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import PublisherForm from '@/components/Forms/PublisherForm/PublisherForm';
import PublisherGallery from '@/components/Gallery/PublisherGallery/PublisherGallery';
import PageHero from '@/components/PageHero';
import { usePublishers } from '@/hooks';

function PublisherPage() {
  const { publishers } = usePublishers();
  return (
    <>
      <meta name="title" content="Page 3" />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="Add a Publisher"
            description="Register publishing houses so you can associate them with collections and titles across the platform."
            align="center"
          />
          <PublisherForm />
        </Stack>
      </Container>
      <PublisherGallery publishers={publishers} />
    </>
  );
}

export default PublisherPage;
