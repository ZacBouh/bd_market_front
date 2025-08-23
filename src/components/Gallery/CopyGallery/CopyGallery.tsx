import { Box, Button, CardActions, Chip, Grid2, IconButton } from '@mui/material';  // MUI's Grid v2
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
import { API_BASE_URL } from '@/backend/api/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getCopies, removeCopy } from '@/backend/api/copy';
import EditCopyModal from '@/components/Forms/AddCopyForm/EditCopyModal';
import { useState } from 'react';

type CopyGalleryProps = {
    copies: CreatedCopy[]
}

const CopyGallery = (props : CopyGalleryProps) => {
  const {copies, ...restProps} = props
  const [editCopyModalOpen, setEditCopyModalOpen] = useState(false)
  const [editedCopy, setEditedCopy] = useState<CreatedCopy | undefined>(undefined)
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
              <CardActions sx={{mt: 'auto', display: 'flex', justifyContent: 'space-between'}}>
                <Box>
                  {copy.price && <Chip label={`${copy.price} ${copy.currency}`} size="small" color='default' variant='filled' /> }
                  <Chip label={copy.copyCondition} size="small" color='default' variant='filled' />
                </Box>
                <ButtonMenu 
                  ButtonElement={IconButton} 
                  buttonProps={{children: <MoreVertIcon/>, sx: {ml: 'auto', borderRadius: 2}}} 
                  menuItems={[
                    {label: 'Remove from library', handleClick: () => {
                       removeCopy(copy.id, (response) =>{
                       console.log(response?.message)
                       getCopies()
                    })}}, 
                    {label: 'Edit Copy', handleClick: () => {
                      setEditCopyModalOpen(true)
                      setEditedCopy(copy)
                    }}
                  ]}
                >
                </ButtonMenu>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
        <EditCopyModal open={editCopyModalOpen} handleClose={() => setEditCopyModalOpen(false)} copy={editedCopy}  />
    </Container>
  );
}

export default CopyGallery
