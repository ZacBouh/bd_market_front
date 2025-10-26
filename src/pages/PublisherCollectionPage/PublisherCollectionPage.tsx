import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';

import AddPublisherCollectionForm from '@/components/Forms/AddPublisherCollectionForm/AddPublisherCollectionForm';
import PageHero from '@/components/PageHero';
import { getPublisherCollections } from '@/backend/api/publisherCollection';
import PublisherCollectionGallery from '@/components/Gallery/PublisherCollectionGallery/PublisherCollectionGallery';
import { useCollections } from '@/hooks/useCollections';

const PublisherCollectionPage = () => {
  useEffect(() => getPublisherCollections(), []);
  const [collections] = useCollections();
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
        <PageHero
          title="Add a Collection"
          description="Group titles under publisher collections to keep catalogs organized and searchable."
          align="center"
        />
        <AddPublisherCollectionForm onCollectionCreated={() => getPublisherCollections()} />
      </Stack>
      <PublisherCollectionGallery collections={collections ?? []} />
    </Container>
  );
};

export default PublisherCollectionPage;
