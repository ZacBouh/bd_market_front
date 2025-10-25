import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import SubscribeForm from '@/components/Forms/SubscribeForm/SubscribeForm';
import PageHero from '@/components/PageHero';

function SubscribePage() {
  return (
    <>
      <meta name="title" content="Subscribe" />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="Subscribe"
            description="Join our mailing list to receive curated news, releases, and featured marketplace picks."
            align="center"
          />
          <SubscribeForm />
        </Stack>
      </Container>
    </>
  );
}

export default SubscribePage;
