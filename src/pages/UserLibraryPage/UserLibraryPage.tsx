import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';

import AddCopyForm from '@/components/Forms/AddCopyForm/AddCopyForm';
import CopyGallery from '@/components/Gallery/CopyGallery/CopyGallery';
import PageHero from '@/components/PageHero';
import { getCopies } from '@/backend/api/copy';
import { useCopy } from '@/hooks/useCopy';

function UserLibraryPage() {
  const { copies } = useCopy();

  useEffect(() => {
    return getCopies();
  }, []);

  return (
    <>
      <meta name="title" content="Page 4" />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="My Library"
            description="Manage your collection, update cover art, and prepare copies for sale without leaving this page."
            align="center"
          />
          <AddCopyForm />
        </Stack>
      </Container>
      <CopyGallery copies={copies} />
    </>
  );
}

export default UserLibraryPage;
