import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import AddPublisherCollectionForm from '@/components/Forms/AddPublisherCollectionForm/AddPublisherCollectionForm';
import PageHero from '@/components/PageHero';

const PublisherCollectionPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
        <PageHero
          title="Add a Collection"
          description="Group titles under publisher collections to keep catalogs organized and searchable."
          align="center"
        />
        <AddPublisherCollectionForm />
      </Stack>
    </Container>
  );
};

export default PublisherCollectionPage;
