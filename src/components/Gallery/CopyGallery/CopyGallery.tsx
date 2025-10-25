import { Box, CardActions, Chip, Grid2, IconButton } from '@mui/material';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';

import { API_BASE_URL } from '@/backend/api/api';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getCopies, removeCopy, updateCopy } from '@/backend/api/copy';
import EditCopyModal from '@/components/Forms/AddCopyForm/EditCopyModal';
import objectToFormData from '@/utils/formData';
import PutCopyForSaleModal from './PutCopyForSaleModal';

interface CopyGalleryProps {
  copies: CreatedCopy[];
}

const CopyGallery = ({ copies }: CopyGalleryProps) => {
  const [editCopyModalOpen, setEditCopyModalOpen] = useState(false);
  const [editedCopy, setEditedCopy] = useState<CreatedCopy | undefined>(undefined);
  const [forSaleModalState, setForSaleModalState] = useState<{
    open: boolean;
    copy?: CreatedCopy;
    loading: boolean;
  }>({ open: false, copy: undefined, loading: false });
  const notifications = useNotifications();

  const closeForSaleModal = () => setForSaleModalState({ open: false, copy: undefined, loading: false });

  const openForSaleModal = (copy: CreatedCopy) => {
    setForSaleModalState({ open: true, copy, loading: false });
  };

  const submitForSale = (price: Price) => {
    const targetCopy = forSaleModalState.copy;
    if (!targetCopy) {
      return;
    }
    setForSaleModalState((prev) => ({ ...prev, loading: true }));
    const payload = objectToFormData({
      ...targetCopy,
      forSale: true,
      price: price.amount,
      currency: price.currency,
      titleId: targetCopy.title.id,
      ownerId: targetCopy.owner.id,
    });
    updateCopy(payload, () => {
      notifications.show('Copy listed for sale successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      closeForSaleModal();
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {copies.map((copy) => (
          <Grid2 key={copy.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
              <CardActions sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  {copy.price && <Chip label={`${copy.price} ${copy.currency}`} size="small" color="default" variant="filled" />}
                  <Chip label={copy.copyCondition} size="small" color="default" variant="filled" />
                </Box>
                <ButtonMenu
                  ButtonElement={IconButton}
                  buttonProps={{ children: <MoreVertIcon />, sx: { ml: 'auto', borderRadius: 2 } }}
                  menuItems={[
                    {
                      label: copy.forSale ? 'Remove From Sale' : 'Put For Sale',
                      handleClick: () => {
                        if (copy.forSale) {
                          const payload = objectToFormData({
                            ...copy,
                            forSale: false,
                            titleId: copy.title.id,
                            ownerId: copy.owner.id,
                          });
                          updateCopy(payload, (data) => console.log('Successfully removed copy from sale: ', data));
                        } else {
                          openForSaleModal(copy);
                        }
                      },
                    },
                    {
                      label: 'Remove from Library',
                      handleClick: () => {
                        console.log('removing copy with id: ', copy.id);
                        removeCopy(copy.id, (response) => {
                          console.log(response?.message);
                          getCopies();
                        });
                      },
                    },
                    {
                      label: 'Edit Copy',
                      handleClick: () => {
                        setEditCopyModalOpen(true);
                        setEditedCopy(copy);
                      },
                    },
                  ]}
                />
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <EditCopyModal open={editCopyModalOpen} handleClose={() => setEditCopyModalOpen(false)} copy={editedCopy} />
      <PutCopyForSaleModal
        open={forSaleModalState.open}
        copy={forSaleModalState.copy}
        loading={forSaleModalState.loading}
        onClose={closeForSaleModal}
        onSubmit={submitForSale}
      />
    </Container>
  );
};

export default CopyGallery;
