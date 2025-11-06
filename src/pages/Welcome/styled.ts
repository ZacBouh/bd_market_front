import { Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(12, 0, 10),
  backgroundColor: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, rgba(19, 24, 40, 0.9), rgba(19, 24, 40, 0.6))`,
  backgroundRepeat: 'no-repeat',
  color: theme.palette.primary.contrastText,
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

const HeroArtwork = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 320,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 3,
    background: `radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 60%), radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.15), transparent 55%)`,
  },
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(6),
  },
}));

const HeroArtworkPrimary = styled('img')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: 'min(100%, 340px)',
  borderRadius: theme.shape.borderRadius * 2.5,
  boxShadow: theme.shadows[18],
}));

const HeroArtworkSecondary = styled('img')(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(-2),
  bottom: theme.spacing(-4),
  width: 'min(45%, 180px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[12],
  transform: 'rotate(-6deg)',
  [theme.breakpoints.down('sm')]: {
    right: theme.spacing(2),
    bottom: theme.spacing(-2),
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
  HeroArtwork,
  HeroArtworkPrimary,
  HeroArtworkSecondary,
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
