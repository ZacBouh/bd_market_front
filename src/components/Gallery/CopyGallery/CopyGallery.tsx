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

import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getCopies, removeCopy, updateCopy } from '@/backend/api/copy';
import EditCopyModal from '@/components/Forms/AddCopyForm/EditCopyModal';
import objectToFormData from '@/utils/formData';
import PutCopyForSaleModal from './PutCopyForSaleModal';
import { convertPriceToApi, formatCurrencyAmount } from '@/utils/price';
import { useUser } from '@/hooks/useUser';
import { USER_ROLES } from '@/types/enums/UserRole';
import { getImageUrl } from '@/utils/image';

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
  const { user } = useUser();
  const isAdmin = user?.user.roles?.includes(USER_ROLES.ADMIN) ?? false;

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
      price: convertPriceToApi(price.amount),
      boughtForPrice: convertPriceToApi(targetCopy.boughtForPrice),
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

  const handleCopyRemoval = async (copyId: CreatedCopy['id'], hardDelete = false) => {
    try {
      const response = await removeCopy(copyId, { hardDelete });
      notifications.show(response.message ?? 'Copy removed successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getCopies();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404
          ? 'Copy not found.'
          : 'Failed to remove the copy.');
      notifications.show(errorMessage, {
        severity: 'error',
        autoHideDuration: 4000,
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {copies.map((copy) => {
          const priceLabel = formatCurrencyAmount(copy.price, copy.currency);

          return (
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
                  image={getImageUrl(copy?.coverImage?.url)}
                  alt={copy?.coverImage?.imageName ?? copy.title.name}
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
                  {priceLabel && (
                    <Chip
                      label={priceLabel}
                      size="small"
                      color="default"
                      variant="filled"
                    />
                  )}
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
                            price: convertPriceToApi(copy.price),
                            boughtForPrice: convertPriceToApi(copy.boughtForPrice),
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
                      handleClick: () => handleCopyRemoval(copy.id),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: 'Hard Delete Copy',
                            handleClick: () => handleCopyRemoval(copy.id, true),
                          } as const,
                        ]
                      : []),
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
          );
        })}
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
