import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';

import { getTitles } from '@/backend/api/title';
import TitleForm from '@/components/Forms/TitleForm/TitleForm';
import TitleGallery from '@/components/Gallery/TitleGallery/TitleGallery';
import PageHero from '@/components/PageHero';
import { useTitles } from '@/hooks';

function TitlePage() {
  useEffect(() => getTitles(), []);
  const { titles } = useTitles();
  return (
    <>
      <meta name="title" content="Page 1" />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="Add a Title"
            description="Expand the catalog by registering new titles and linking them to their creative teams."
            align="center"
          />
          <TitleForm />
        </Stack>
      </Container>
      <TitleGallery titles={titles} />
    </>
  );
}

export default TitlePage;
