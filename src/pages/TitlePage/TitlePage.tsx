import { FullSizeCentered } from '@/components/styled';
import Typography from '@mui/material/Typography';
import TitleForm from '@/components/Forms/TitleForm/TitleForm';

function TitlePage() {
  
  return (
    <>
      <meta name="title" content="Page 1" />
      
      <FullSizeCentered>
        <Typography variant="h3">Add a title</Typography>
        <TitleForm/>
      </FullSizeCentered>
    </>
  );
}

export default TitlePage;
