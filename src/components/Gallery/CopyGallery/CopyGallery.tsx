import { Button, CardActions, Grid2 } from '@mui/material';  // MUI's Grid v2
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
import { API_BASE_URL } from '@/backend/api/api';

type CopyGalleryProps = {
    copies: CreatedCopy[]
}

const CopyGallery = (props : CopyGalleryProps) => {
    const {copies, ...restProps} = props
    
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {copies.map((copy, i) => (
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
                  image={API_BASE_URL + copy?.coverImage?.url}
                  alt={copy?.coverImage?.imageName}
                />
                <CardContent>
                  <Typography variant="h6">{copy.title.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {copy?.title?.artistsContributions?.[0].artist.fullName}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{mt: 'auto', flexGrow: 0}}>
                <Button size="small" color='secondary' variant='contained' disabled>{copy.price} {copy.currency}</Button>
                <Button size="small" color='secondary' variant='contained' disabled>{copy.copyCondition}</Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default CopyGallery
