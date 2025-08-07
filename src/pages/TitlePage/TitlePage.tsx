import { Centered, FullSizeCentered } from '@/components/styled';
import Typography from '@mui/material/Typography';
import TitleForm from '@/components/Forms/TitleForm/TitleForm';
import { getTitles } from '@/backend/api/title';
import { useEffect } from 'react';
import TitleGallery from '@/components/Gallery/TitleGallery/TitleGallery';
import { useTitles } from '@/hooks';
import Container from '@mui/material/Container';

function TitlePage() {
  useEffect( () => getTitles() ,[])
  const {titles} = useTitles()
  return (
    <>
      <meta name="title" content="Page 1" />
      <Container>
        <Centered>
          <Typography variant="h3">Add a title</Typography>
          <TitleForm/>
          <TitleGallery titles={titles} />
        </Centered>
      </Container>
    </>
  );
}

export default TitlePage;
