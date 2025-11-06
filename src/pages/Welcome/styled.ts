import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(12, 0, 10),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
}));

const HeroContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  maxWidth: 760,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    alignItems: 'center',
  },
}));

const HeroTagline = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: theme.typography.body1.fontSize,
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  '& span': {
    display: 'flex',
    alignItems: 'center',
  },
  '& span:not(:last-of-type)::after': {
    content: '"•"',
    marginLeft: theme.spacing(1.5),
  },
}));

const HeroActions = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

const Section = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  maxWidth: 680,
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const TextList = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: theme.spacing(3),
  display: 'grid',
  gap: theme.spacing(1.5),
}));

const TextListItem = styled('li')(() => ({
  lineHeight: 1.6,
  '& strong': {
    fontWeight: 700,
  },
}));

const FAQList = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
}));

const FAQItem = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const FinalCtaSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.getContrastText(theme.palette.grey[900]),
}));

export {
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
};
