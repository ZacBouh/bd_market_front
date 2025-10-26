import { Grid2 } from '@mui/material';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
  CardActions,
  IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useState } from 'react';

import { API_BASE_URL } from '@/backend/api/api';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getPublisherCollections, removePublisherCollection } from '@/backend/api/publisherCollection';
import EditPublisherCollectionModal from '@/components/Forms/AddPublisherCollectionForm/EditPublisherCollectionModal';
import { useUser } from '@/hooks/useUser';
import { USER_ROLES } from '@/types/enums/UserRole';

const PublisherCollectionGallery = ({ collections }: { collections: CreatedPublisherCollection[] }) => {
  const notifications = useNotifications();
  const { user } = useUser();
  const isAdmin = user?.user.roles?.includes(USER_ROLES.ADMIN) ?? false;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CreatedPublisherCollection | undefined>(undefined);

  const handleRemoveCollection = async (collectionId: CreatedPublisherCollection['id'], hardDelete = false) => {
    try {
      const response = await removePublisherCollection(collectionId, { hardDelete });
      notifications.show(response.message ?? 'Collection removed successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getPublisherCollections();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Collection not found.' : 'Failed to remove the collection.');
      notifications.show(errorMessage, {
        severity: 'error',
        autoHideDuration: 4000,
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {collections.map((collection) => (
          <Grid2 key={collection.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
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
                  image={collection.coverImage?.url ? `${API_BASE_URL}${collection.coverImage.url}` : undefined}
                  alt={collection.coverImage?.imageName ?? collection.name}
                  sx={{
                    width: '100%',
                    objectFit: 'cover',
                    backgroundColor: collection.coverImage?.url ? undefined : 'grey.100',
                  }}
                />
                <CardContent>
                  <Typography variant="h6">{collection.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Publisher: {collection.publisher?.name ?? 'Unknown'}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonMenu
                  ButtonElement={IconButton}
                  buttonProps={{ children: <MoreVertIcon />, sx: { borderRadius: 2 } }}
                  menuItems={[
                    {
                      label: 'Update Collection',
                      handleClick: () => {
                        setSelectedCollection(collection);
                        setEditModalOpen(true);
                      },
                    },
                    {
                      label: 'Delete Collection',
                      handleClick: () => handleRemoveCollection(collection.id),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: 'Hard Delete Collection',
                            handleClick: () => handleRemoveCollection(collection.id, true),
                          } as const,
                        ]
                      : []),
                  ]}
                />
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <EditPublisherCollectionModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        collection={selectedCollection}
      />
    </Container>
  );
};

export default PublisherCollectionGallery;
