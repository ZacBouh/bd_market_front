import { Grid2 } from '@mui/material';  // MUI's Grid v2
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
import { useState } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';

import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getPublishers, removePublisher } from '@/backend/api/publisher';
import EditPublisherModal from '@/components/Forms/PublisherForm/EditPublisherModal';
import { useUser } from '@/hooks/useUser';
import { USER_ROLES } from '@/types/enums/UserRole';
import { getImageUrl } from '@/utils/image';
import galleryCardStyles from '@/components/Gallery/galleryCardStyles';

type PublisherGalleryProps = {
    publishers: CreatedPublisher[]
}

const PublisherGallery = (props : PublisherGalleryProps) => {
    const {publishers} = props
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedPublisher, setSelectedPublisher] = useState<CreatedPublisher | undefined>(undefined)
    const notifications = useNotifications()
    const { user } = useUser()
    const isAdmin = user?.user.roles?.includes(USER_ROLES.ADMIN) ?? false

    const handleRemovePublisher = async (publisherId: CreatedPublisher['id'], hardDelete = false) => {
      try {
        const response = await removePublisher(publisherId, { hardDelete })
        notifications.show(response.message ?? 'Publisher removed successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        getPublishers()
      } catch (error) {
        const axiosError = error as { response?: { data?: ApiResponse; status?: number } }
        const errorMessage =
          axiosError?.response?.data?.message ??
          (axiosError?.response?.status === 404 ? 'Publisher not found.' : 'Failed to remove the publisher.')
        notifications.show(errorMessage, {
          severity: 'error',
          autoHideDuration: 4000,
        })
      }
    }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {publishers.map((publisher, i) => (
          <Grid2
            key={i}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card sx={galleryCardStyles.card}>
              <CardActionArea sx={galleryCardStyles.actionArea}>
                <CardMedia
                  component="img"
                  image={getImageUrl(publisher?.coverImage?.url)}
                  alt={publisher?.coverImage?.imageName ?? publisher.name}
                  sx={galleryCardStyles.media}
                />
                <CardContent>
                  <Typography variant="h6">{publisher.name}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonMenu
                  ButtonElement={IconButton}
                  buttonProps={{ children: <MoreVertIcon />, sx: { borderRadius: 2 } }}
                  menuItems={[
                    {
                      label: 'Update Publisher',
                      handleClick: () => {
                        setSelectedPublisher(publisher)
                        setEditModalOpen(true)
                      },
                    },
                    {
                      label: 'Delete Publisher',
                      handleClick: () => handleRemovePublisher(publisher.id),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: 'Hard Delete Publisher',
                            handleClick: () => handleRemovePublisher(publisher.id, true),
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
      <EditPublisherModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        publisher={selectedPublisher}
      />
    </Container>
  );
}

export default PublisherGallery
