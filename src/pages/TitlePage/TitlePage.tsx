import { FullSizeCentered } from '@/components/styled';
import Typography from '@mui/material/Typography';
import TitleForm from '@/components/Forms/TitleForm/TitleForm';
import { getTitles } from '@/backend/api/titles';
import { useEffect } from 'react';
import TitleGallery from '@/components/Gallery/TitleGallery/TitleGallery';
import { useTitles } from '@/hooks';

function TitlePage() {
  useEffect( () => getTitles() ,[])
  const {titles} = useTitles()
  return (
    <>
      <meta name="title" content="Page 1" />
      
      <FullSizeCentered>
        <Typography variant="h3">Add a title</Typography>
        <TitleForm/>
        <TitleGallery titles={titles} />
      </FullSizeCentered>
    </>
  );
}

export default TitlePage;
