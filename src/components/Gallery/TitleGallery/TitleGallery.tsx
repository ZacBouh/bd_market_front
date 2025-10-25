import { Grid2 } from '@mui/material';  // MUI's Grid v2
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
import { API_BASE_URL } from '@/backend/api/api';

type TitleGalleryProps = {
    titles: CreatedTitle[]
    onTitleClick?: (title: CreatedTitle) => unknown  
}

const getArtistDisplayName = (contribution: CreatedContribution) => {
  const { artist } = contribution ?? {}
  if (!artist) {
    return undefined
  }

  const fullName = artist.fullName ?? artist.name
  if (fullName && fullName.trim().length > 0) {
    return fullName
  }

  const composedName = [artist.firstName, artist.lastName]
    .filter((part): part is string => !!part && part.trim().length > 0)
    .join(' ')

  if (composedName.length > 0) {
    return composedName
  }

  return artist.pseudo?.trim().length ? artist.pseudo : undefined
}

const normaliseContributions = (
  contributions?: CreatedContribution[] | Record<string | number, CreatedContribution>,
) => {
  if (!contributions) {
    return []
  }

  if (Array.isArray(contributions)) {
    return contributions
  }

  return Object.values(contributions)
}

const getContributorsLabel = (contributions?: CreatedContribution[] | Record<string | number, CreatedContribution>) => {
  const normalised = normaliseContributions(contributions)

  if (normalised.length === 0) {
    return '?'
  }

  const names = normalised
    .map((contribution) => getArtistDisplayName(contribution))
    .filter((name): name is string => !!name && name.trim().length > 0)

  if (names.length === 0) {
    return '?'
  }

  return names.join(', ')
}

const TitleGallery = (props : TitleGalleryProps) => {
    const {titles} = props
    
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {titles.map((title) => (
          <Grid2
            key={title.id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardActionArea sx={{ flexGrow: 1 }} onClick={() => props.onTitleClick && props.onTitleClick(title) } >
                <CardMedia
                  component="img"
                  height="300"
                  image={API_BASE_URL + title?.coverImage?.url}
                  alt={title?.coverImage?.imageName}
                />
                <CardContent>
                  <Typography variant="h6">{title.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {getContributorsLabel(title?.artistsContributions)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default TitleGallery
