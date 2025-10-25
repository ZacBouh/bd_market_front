import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import AddSeriesForm from '@/components/Forms/AddSeriesForm/AddSeriesForm';
import PageHero from '@/components/PageHero';

const SeriesPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
        <PageHero
          title="Add a Series"
          description="Organize titles into series so readers can explore connected stories more easily."
          align="center"
        />
        <AddSeriesForm />
      </Stack>
    </Container>
  );
};

export default SeriesPage;
