import { Box, Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

import {
  FAQItem,
  FAQList,
  FinalCtaSection,
  HeroActions,
  HeroContent,
  HeroLayout,
  HeroSection,
  HeroTagline,
  Section,
  SectionSubtitle,
  SectionTitle,
  TextList,
  TextListItem,
  TextSection,
} from './styled';

function Welcome() {
  const navigate = useNavigate();

  const handleCreateAccount = () => navigate('/subscribe');
  const handleLogin = () => navigate('/login');

  const heroHighlights = ['Library workspace', 'Marketplace listings', 'Cover scanning'];

  const collectionFeatures = [
    {
      title: 'Personal library',
      description: 'Search the catalog and keep every issue organized in one place.',
    },
    {
      title: 'Cover scanning',
      description: 'Upload front, back, and spine photos to pre-fill title details.',
    },
    {
      title: 'Condition & pricing',
      description: 'Track each copy’s grade, asking price, and purchase cost.',
    },
    {
      title: 'Cover gallery',
      description: 'Browse crisp cover art for the books you already own.',
    },
    {
      title: 'Edit & manage',
      description: 'Update details, replace covers, or remove copies whenever you need.',
    },
  ];

  const marketplaceFeatures = [
    {
      title: 'Search the market',
      description: 'Browse copies listed by the community with live filters.',
    },
    {
      title: 'Filter by condition',
      description: 'Zero-in on the grades and sort order that matter most to you.',
    },
    {
      title: 'Price ranges & currency',
      description: 'Set min and max price targets and choose the currency you prefer.',
    },
    {
      title: 'List from your library',
      description: 'Publish a copy for sale directly from the collection view.',
    },
  ];

  const faqs = [
    {
      question: 'How do I add comics to my library?',
      answer: 'Search for an existing title or run a cover scan, then fill in condition, price, and photos.',
    },
    {
      question: 'Do I have to sell to use Comic Hood?',
      answer: 'No. Keep a private library and only list copies when it makes sense for you.',
    },
    {
      question: 'Can I list a copy for sale later?',
      answer: 'Yes. Toggle the “Put for Sale” action on any copy in your library when you’re ready.',
    },
  ];

  return (
    <>
      <meta name="title" content="Welcome" />
      <Box component="main">
        <HeroSection>
          <Container maxWidth="lg">
            <HeroLayout container spacing={{ xs: 4, md: 6 }}>
              <Grid item xs={12} md={8} lg={7}>
                <HeroContent>
                  <Stack spacing={2}>
                    <Typography component="p" variant="overline" sx={{ letterSpacing: 2 }}>
                      Manage your collection. Buy & sell when you want.
                    </Typography>
                    <Typography component="h1" variant="h2" fontWeight={800}>
                      Comic Hood is your collection manager + marketplace for comics, manga & BD.
                    </Typography>
                  </Stack>
                  <HeroTagline>
                    {heroHighlights.map((text) => (
                      <Typography component="span" key={text} variant="body1">
                        {text}
                      </Typography>
                    ))}
                  </HeroTagline>
                  <HeroActions>
                    <Button color="secondary" onClick={handleCreateAccount} size="large" variant="contained">
                      Create your account, it's free!
                    </Button>
                    <Typography variant="body1">Free • ~1 minute • No card needed</Typography>
                  </HeroActions>
                  <Typography variant="body2">
                    Already a member?{' '}
                    <Button
                      color="inherit"
                      onClick={handleLogin}
                      size="small"
                      sx={{ textTransform: 'none', padding: 0 }}
                    >
                      <strong>Log in</strong>
                    </Button>
                  </Typography>
                </HeroContent>
              </Grid>
            </HeroLayout>
          </Container>
        </HeroSection>

        <Section>
          <Container maxWidth="lg">
            <SectionTitle component="h2" variant="h4">
              Collection, then marketplace
            </SectionTitle>
            <SectionSubtitle variant="body1">
              Start by building your private library. When you’re ready, the marketplace is right where you already manage your books.
            </SectionSubtitle>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Typography component="h3" variant="h5" fontWeight={700} gutterBottom>
                  Your Collection (inside your account)
                </Typography>
                <TextList>
                  {collectionFeatures.map(({ title, description }) => (
                    <TextListItem key={title}>
                      <strong>{title}</strong> — {description}
                    </TextListItem>
                  ))}
                </TextList>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography component="h3" variant="h5" fontWeight={700} gutterBottom>
                  Marketplace (when you need it)
                </Typography>
                <TextList>
                  {marketplaceFeatures.map(({ title, description }) => (
                    <TextListItem key={title}>
                      <strong>{title}</strong> — {description}
                    </TextListItem>
                  ))}
                </TextList>
              </Grid>
            </Grid>
          </Container>
        </Section>

        <TextSection>
          <Container maxWidth="sm">
            <Stack alignItems="center" spacing={2} textAlign="center">
              <Typography component="h2" variant="h5" fontWeight={700}>
                Start your private hub today
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign up to unlock the full library workspace, cover scanning, and integrated marketplace tools.
              </Typography>
              <Button color="secondary" onClick={handleCreateAccount} size="large" variant="contained">
                Create your account, it's free!
              </Button>
            </Stack>
          </Container>
        </TextSection>

        <Section>
          <Container maxWidth="md">
            <SectionTitle component="h2" variant="h4">
              How it works
            </SectionTitle>
            <Stack divider={<Divider flexItem />} spacing={3}>
              <Typography variant="body1">
                <strong>1) Create your account</strong> — unlock the library workspace and scanning tools.
              </Typography>
              <Typography variant="body1">
                <strong>2) Add books</strong> — search existing titles or scan covers to pre-fill the details.
              </Typography>
              <Typography variant="body1">
                <strong>3) Track & enjoy</strong> — update condition, prices, and cover art as your collection grows.
              </Typography>
              <Typography variant="body1">
                <strong>4) Sell when ready</strong> — publish listings straight from the copies you already track.
              </Typography>
            </Stack>
          </Container>
        </Section>

        <Section>
          <Container maxWidth="md">
            <SectionTitle component="h2" variant="h4">
              Feature highlights
            </SectionTitle>
            <TextList>
              <TextListItem>
                <strong>Unified dashboard</strong> — add copies, upload covers, and manage sale status from one place.
              </TextListItem>
              <TextListItem>
                <strong>Cover scanning</strong> — analyze your photos to jump-start title and copy details.
              </TextListItem>
              <TextListItem>
                <strong>Marketplace filters</strong> — sort by newest, narrow by grade, and set price ranges.
              </TextListItem>
              <TextListItem>
                <strong>Editable copies</strong> — adjust pricing, replace covers, or remove items in seconds.
              </TextListItem>
              <TextListItem>
                <strong>Collection gallery</strong> — browse your books through rich cover cards.
              </TextListItem>
            </TextList>
          </Container>
        </Section>

        <Section>
          <Container maxWidth="md">
            <SectionTitle component="h2" variant="h4">
              FAQ (short)
            </SectionTitle>
            <FAQList>
              {faqs.map(({ question, answer }) => (
                <FAQItem key={question}>
                  <Typography component="h3" variant="h6" fontWeight={700}>
                    {question}
                  </Typography>
                  <Typography variant="body1">{answer}</Typography>
                </FAQItem>
              ))}
            </FAQList>
          </Container>
        </Section>

        <FinalCtaSection>
          <Container maxWidth="md">
            <Stack alignItems="center" spacing={3} textAlign="center">
              <Typography component="h2" variant="h4" fontWeight={700}>
                Ready to organize your shelves—and trade on your terms?
              </Typography>
              <Typography variant="body1">
                Comic Hood keeps your collection front and center, with marketplace tools ready whenever you are.
              </Typography>
              <Button color="secondary" onClick={handleCreateAccount} size="large" variant="contained">
                Create your account, it's free!
              </Button>
            </Stack>
          </Container>
        </FinalCtaSection>
      </Box>
    </>
  );
}

export default Welcome;
