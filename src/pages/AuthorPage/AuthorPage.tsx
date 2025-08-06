import { Centered } from '@/components/styled';
import AuthorForm from '@/components/Forms/AuthorForm/AuthorForm';
import Typography from '@mui/material/Typography';
import ArtistGallery from '@/components/Gallery/ArtistGallery.tsx/ArtistGallery';
import { useAuthors } from '@/hooks';
import { Container } from '@mui/material';

const   AuthorPage = () => {
  const {artists} = useAuthors()
  return (
    <>
      <meta name="title" content="Page 2" />
      <Container>
        <Centered>
          <Typography variant="h3">Add an author</Typography>
          <AuthorForm/>
        </Centered>
        <ArtistGallery artists={artists}/>
      </Container>
    </>
  );
}

export default AuthorPage;
