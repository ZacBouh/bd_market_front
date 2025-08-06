import { FullSizeCentered } from '@/components/styled';
import Typography from '@mui/material/Typography';
import TitleForm from '@/components/Forms/TitleForm/TitleForm';
import { getTitles } from '@/backend/api/titles';
import { useEffect } from 'react';

function TitlePage() {
  useEffect( getTitles() ,[])
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
