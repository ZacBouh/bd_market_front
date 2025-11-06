import { Grid, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(12, 0, 10),
  backgroundColor: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, rgba(19, 24, 40, 0.9), rgba(19, 24, 40, 0.6))`,
  backgroundRepeat: 'no-repeat',
  color: alpha(theme.palette.common.white, 0.92),
}));

const HeroLayout = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(8),
}));

const HeroContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  maxWidth: 760,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    alignItems: 'center',
  },
  '& .MuiTypography-root': {
    color: alpha(theme.palette.common.white, 0.92),
  },
  '& .MuiTypography-body1': {
    color: alpha(theme.palette.common.white, 0.85),
  },
  '& .MuiTypography-body2': {
    color: alpha(theme.palette.common.white, 0.75),
  },
  '& .MuiTypography-overline': {
    color: alpha(theme.palette.common.white, 0.7),
  },
}));

const HeroTagline = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: theme.typography.body1.fontSize,
  color: alpha(theme.palette.common.white, 0.75),
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

const TextSection = styled(Section)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
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
  HeroLayout,
  Section,
  SectionSubtitle,
  SectionTitle,
  TextSection,
  TextList,
  TextListItem,
};
