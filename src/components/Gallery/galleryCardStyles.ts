import { SxProps, Theme } from '@mui/material/styles';

type GalleryCardStyles = {
  card: SxProps<Theme>;
  actionArea: SxProps<Theme>;
  media: SxProps<Theme>;
  content: SxProps<Theme>;
};

const cardStyles: GalleryCardStyles['card'] = {
  height: '100%',
  borderRadius: 2,
  transition: 'transform 0.2s, box-shadow 0.3s',
  '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const actionAreaStyles: GalleryCardStyles['actionArea'] = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  p: 0,
};

const mediaStyles: GalleryCardStyles['media'] = {
  width: '100%',
  height: 300,
  objectFit: 'cover',
  display: 'block',
  flexShrink: 0,
};

const contentStyles: GalleryCardStyles['content'] = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: 1,
  minHeight: 120,
};

export const galleryCardStyles: GalleryCardStyles = {
  card: cardStyles,
  actionArea: actionAreaStyles,
  media: mediaStyles,
  content: contentStyles,
};

export default galleryCardStyles;
