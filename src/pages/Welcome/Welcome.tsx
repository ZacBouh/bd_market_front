import { Box, Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

import {
  FAQItem,
  FAQList,
  FinalCtaSection,
  HeroActions,
  HeroContent,
  HeroSection,
  HeroTagline,
  Section,
  SectionSubtitle,
  SectionTitle,
  TextList,
  TextListItem,
} from './styled';

function Welcome() {
  const navigate = useNavigate();

  const handleCreateAccount = () => navigate('/subscribe');
  const handleLogin = () => navigate('/login');

  const heroHighlights = ['Edition-first catalog', 'AI Scan', 'Secure payments'];

  const collectionFeatures = [
    {
      title: 'Personal Library',
      description: 'catalog by series, publisher, language, ISBN.',
    },
    {
      title: 'AI Scan',
      description: 'snap a cover; we suggest edition metadata you can confirm or tweak.',
    },
    {
      title: 'Condition & Notes',
      description: 'simple scale (Mint → Acceptable) plus your remarks.',
    },
    {
      title: 'Duplicates & Sets',
      description: 'spot doubles, group variants and runs.',
    },
    {
      title: 'Wishlist & Alerts',
      description: 'track what you’re hunting; get notified when copies appear.',
    },
    {
      title: 'Valuation Glimpse',
      description: 'see recent floor/median prices for editions you own.',
    },
    {
      title: 'Import/Export',
      description: 'CSV in & out so your data never feels locked in.',
    },
    {
      title: 'Privacy Controls',
      description: 'keep everything private or share a read-only view—your call.',
    },
  ];

  const marketplaceFeatures = [
    {
      title: 'Edition-first search',
      description: 'land on the exact edition, then compare copies.',
    },
    {
      title: 'List from your library',
      description: 'pick a book you own, set condition & price, publish.',
    },
    {
      title: 'Secure checkout (Stripe)',
      description: 'payment details never touch our servers.',
    },
    {
      title: 'Funds on hold',
      description: 'until both sides confirm the exchange.',
    },
    {
      title: 'Simple dispute path',
      description: 'if something doesn’t match.',
    },
  ];

  const faqs = [
    {
      question: 'Can I use Comic Hood just for collection tracking?',
      answer: 'Yes. Catalog, wishlist, and alerts work even if you never sell.',
    },
    {
      question: 'Is my collection public?',
      answer: 'No. It’s private by default. You can share a read-only view if you choose.',
    },
    {
      question: 'Do I need an ISBN to add a book?',
      answer: 'No. Title/series/publisher works, and AI Scan helps pre-fill details.',
    },
    {
      question: 'When do sellers get paid?',
      answer: 'After buyer and seller confirm the exchange. You’ll see status updates in your dashboard.',
    },
  ];

  return (
    <>
      <meta name="title" content="Welcome" />
      <Box component="main">
        <HeroSection>
          <Container maxWidth="lg">
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
                  Create your account
                </Button>
                <Typography variant="body1">Free • ~1 minute • No card needed</Typography>
              </HeroActions>
              <Typography variant="body2">
                Already a member?{' '}
                <Button color="inherit" onClick={handleLogin} size="small" sx={{ textTransform: 'none', padding: 0 }}>
                  <strong>Log in</strong>
                </Button>
              </Typography>
            </HeroContent>
          </Container>
        </HeroSection>

        <Section>
          <Container maxWidth="md">
            <SectionTitle component="h2" variant="h4">
              Why sign up first?
            </SectionTitle>
            <TextList>
              <TextListItem>
                <strong>Private by default</strong> — your library, wishlists, and prices are member-only.
              </TextListItem>
              <TextListItem>
                <strong>Less spam, more trust</strong> — verified accounts only.
              </TextListItem>
              <TextListItem>
                <strong>One profile</strong> for collection, selling, and purchases.
              </TextListItem>
            </TextList>
          </Container>
        </Section>

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

        <Section>
          <Container maxWidth="md">
            <SectionTitle component="h2" variant="h4">
              How it works
            </SectionTitle>
            <Stack divider={<Divider flexItem />} spacing={3}>
              <Typography variant="body1">
                <strong>1) Create your account</strong> — unlock library, wishlist, and alerts.
              </Typography>
              <Typography variant="body1">
                <strong>2) Add books</strong> — import CSV or use AI Scan to speed up cataloging.
              </Typography>
              <Typography variant="body1">
                <strong>3) Track & enjoy</strong> — manage duplicates, set goals, get edition alerts.
              </Typography>
              <Typography variant="body1">
                <strong>4) Sell when ready</strong> — list directly from your collection, get paid after confirmation.
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
                <strong>Smart Search</strong> with typo tolerance & ISBN support.
              </TextListItem>
              <TextListItem>
                <strong>Clear Conditions</strong> explained in plain language.
              </TextListItem>
              <TextListItem>
                <strong>Photo-first listings</strong> that show real wear.
              </TextListItem>
              <TextListItem>
                <strong>Helpful notifications</strong> that say what happened and what’s next.
              </TextListItem>
              <TextListItem>
                <strong>Minimal data</strong> — only what’s needed to buy/sell; EXIF cleanup on uploads.
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
                Create your account — free, fast, and collector-friendly
              </Button>
            </Stack>
          </Container>
        </FinalCtaSection>
      </Box>
    </>
  );
}

export default Welcome;
