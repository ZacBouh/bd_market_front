import { Centered } from '@/components/styled';
import ArtistForm from '@/components/Forms/ArtistForm/ArtistForm';
import Typography from '@mui/material/Typography';
import ArtistGallery from '@/components/Gallery/ArtistGallery.tsx/ArtistGallery';
import { useArtists } from '@/hooks';
import { Container } from '@mui/material';
import { getArtists } from '@/backend/api/artists';

const   AuthorPage = () => {
  const {artists} = useArtists()
  return (
    <>
      <meta name="title" content="Page 2" />
      <Container>
        <Centered>
          <Typography variant="h3">Add an artist</Typography>
          <ArtistForm onSuccess={() => getArtists()} />
        </Centered>
        <ArtistGallery artists={artists}/>
      </Container>
    </>
  );
}

export default AuthorPage;
