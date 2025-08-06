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
    artists: CreatedArtist[]
}

const ArtistGallery = (props : TitleGalleryProps) => {
    const {artists, ...restProps} = props
    
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {artists.map((artist, i) => (
          <Grid2
            key={i}
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
              <CardActionArea sx={{ flexGrow: 1 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={API_BASE_URL + "" + artist?.coverImage?.url}
                  alt={artist?.coverImage?.imageName}
                />
                <CardContent>
                  <Typography variant="h6">{artist.firstName} {artist.lastName}</Typography>
                  {artist.skills?.sort().map(skill => (
                    <Typography key={skill}  variant="body2" color="text.secondary">
                        {skill}
                    </Typography>
                  ))}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default ArtistGallery
