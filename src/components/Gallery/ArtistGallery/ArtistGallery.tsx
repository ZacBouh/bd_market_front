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

import { API_BASE_URL } from '@/backend/api/api';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getArtists, removeArtist } from '@/backend/api/artist';
import EditArtistModal from '@/components/Forms/ArtistForm/EditArtistModal';
import { useUser } from '@/hooks/useUser';
import { USER_ROLES } from '@/types/enums/UserRole';

type ArtistGalleryProps = {
    artists: CreatedArtist[]
}

const getArtistFullName = (artist: CreatedArtist) => {
  const parts = [artist.firstName, artist.lastName].filter((part): part is string => !!part && part.trim().length > 0)
  if (parts.length > 0) {
    return parts.join(' ')
  }

  return artist.pseudo ?? 'Unknown artist'
}

const ArtistGallery = ({ artists }: ArtistGalleryProps) => {
    const notifications = useNotifications()
    const { user } = useUser()
    const isAdmin = user?.user.roles?.includes(USER_ROLES.ADMIN) ?? false
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedArtist, setSelectedArtist] = useState<CreatedArtist | undefined>(undefined)

    const handleArtistRemoval = async (artistId: CreatedArtist['id'], hardDelete = false) => {
      try {
        const response = await removeArtist(artistId, { hardDelete })
        notifications.show(response.message ?? 'Artist removed successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        getArtists()
      } catch (error) {
        const axiosError = error as { response?: { data?: ApiResponse; status?: number } }
        const errorMessage =
          axiosError?.response?.data?.message ??
          (axiosError?.response?.status === 404 ? 'Artist not found.' : 'Failed to remove the artist.')
        notifications.show(errorMessage, {
          severity: 'error',
          autoHideDuration: 4000,
        })
      }
    }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {artists.map((artist) => (
          <Grid2
            key={artist.id}
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
                  image={artist?.coverImage?.url ? `${API_BASE_URL}${artist.coverImage.url}` : undefined}
                  alt={artist?.coverImage?.imageName ?? getArtistFullName(artist)}
                  sx={{ backgroundColor: artist?.coverImage?.url ? undefined : 'grey.100' }}
                />
                <CardContent>
                  <Typography variant="h6">{getArtistFullName(artist)}</Typography>
                  {artist.skills?.sort().map(skill => (
                    <Typography key={skill}  variant="body2" color="text.secondary">
                        {skill}
                    </Typography>
                  ))}
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonMenu
                  ButtonElement={IconButton}
                  buttonProps={{ children: <MoreVertIcon />, sx: { borderRadius: 2 } }}
                  menuItems={[
                    {
                      label: 'Update Artist',
                      handleClick: () => {
                        setSelectedArtist(artist)
                        setEditModalOpen(true)
                      },
                    },
                    {
                      label: 'Delete Artist',
                      handleClick: () => handleArtistRemoval(artist.id),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: 'Hard Delete Artist',
                            handleClick: () => handleArtistRemoval(artist.id, true),
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
      <EditArtistModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        artist={selectedArtist}
      />
    </Container>
  );
}

export default ArtistGallery
