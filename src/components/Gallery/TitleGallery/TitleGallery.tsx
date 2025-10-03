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
                    by {title?.artistsContributions[0]?.artist?.fullName ?? '?'}
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
