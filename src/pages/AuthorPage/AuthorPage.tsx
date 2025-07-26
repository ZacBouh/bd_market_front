import { FullSizeCentered } from '@/components/styled';
import AuthorForm from '@/components/Forms/AuthorForm/AuthorForm';
import Typography from '@mui/material/Typography';

const   AuthorPage = () => {
  
  return (
    <>
      <meta name="title" content="Page 2" />
      <FullSizeCentered>
        <Typography variant="h3">Add an author</Typography>
        <AuthorForm/>
      </FullSizeCentered>
    </>
  );
}

export default AuthorPage;
