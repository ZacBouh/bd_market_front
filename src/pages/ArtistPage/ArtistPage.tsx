import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { getArtists } from '@/backend/api/artist';
import ArtistForm from '@/components/Forms/ArtistForm/ArtistForm';
import ArtistGallery from '@/components/Gallery/ArtistGallery/ArtistGallery';
import PageHero from '@/components/PageHero';
import { useArtists } from '@/hooks';

const ArtistPage = () => {
  const { artists } = useArtists();
  return (
    <>
      <meta name="title" content="Page 2" />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="Add an Artist"
            description="Create artist records so contributors can be credited accurately across every title."
            align="center"
          />
          <ArtistForm onSuccess={() => getArtists()} />
        </Stack>
      </Container>
      <ArtistGallery artists={artists} />
    </>
  );
};

export default ArtistPage;
