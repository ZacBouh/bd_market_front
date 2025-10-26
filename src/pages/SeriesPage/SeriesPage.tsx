import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';

import AddSeriesForm from '@/components/Forms/AddSeriesForm/AddSeriesForm';
import PageHero from '@/components/PageHero';
import { getSeries } from '@/backend/api/series';
import SeriesGallery from '@/components/Gallery/SeriesGallery/SeriesGallery';
import { useSeries } from '@/hooks/useSeries';

const SeriesPage = () => {
  useEffect(() => getSeries(), []);
  const [series] = useSeries();
  return (
    <>
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="Add a Series"
            description="Organize titles into series so readers can explore connected stories more easily."
            align="center"
          />
          <AddSeriesForm onSeriesCreated={() => getSeries()} />
        </Stack>
      </Container>
      <SeriesGallery series={series ?? []} />
    </>
  );
};

export default SeriesPage;
