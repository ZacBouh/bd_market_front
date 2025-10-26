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

import { getImageUrl } from '@/utils/image';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getTitles, removeTitle } from '@/backend/api/title';
import EditTitleModal from '@/components/Forms/TitleForm/EditTitleModal';
import { useUser } from '@/hooks/useUser';
import { USER_ROLES } from '@/types/enums/UserRole';

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

const getContributorsLabel = (contributions?: CreatedContribution[] | Record<string | number, CreatedContribution>) => {
  if (!contributions) {
    return '?'
  }

  const contributionsList = Array.isArray(contributions)
    ? contributions
    : Object.values(contributions)

  if (contributionsList.length === 0) {
    return '?'
  }

  const names = contributionsList
    .map((contribution) => getArtistDisplayName(contribution))
    .filter((name): name is string => !!name && name.trim().length > 0)

  if (names.length === 0) {
    return '?'
  }

  if (names.length > 3) {
    const visibleNames = names.slice(0, 2)
    const remainingCount = names.length - visibleNames.length
    return `${visibleNames.join(', ')} and ${remainingCount} more`
  }

  return names.join(', ')
}

const TitleGallery = (props : TitleGalleryProps) => {
    const {titles} = props
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedTitle, setSelectedTitle] = useState<CreatedTitle | undefined>(undefined)
    const notifications = useNotifications()
    const { user } = useUser()
    const isAdmin = user?.user.roles?.includes(USER_ROLES.ADMIN) ?? false

    const handleRemoveTitle = async (titleId: CreatedTitle['id'], hardDelete = false) => {
      try {
        const response = await removeTitle(titleId, { hardDelete })
        notifications.show(response.message ?? 'Title removed successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        })
        getTitles()
      } catch (error) {
        const axiosError = error as { response?: { data?: ApiResponse; status?: number } }
        const errorMessage =
          axiosError?.response?.data?.message ??
          (axiosError?.response?.status === 404 ? 'Title not found.' : 'Failed to remove the title.')
        notifications.show(errorMessage, {
          severity: 'error',
          autoHideDuration: 4000,
        })
      }
    }

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
                  image={getImageUrl(title?.coverImage?.url)}
                  alt={title?.coverImage?.imageName ?? title.name}
                />
                <CardContent>
                  <Typography variant="h6">{title.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {getContributorsLabel(title?.artistsContributions)}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonMenu
                  ButtonElement={IconButton}
                  buttonProps={{ children: <MoreVertIcon />, sx: { borderRadius: 2 } }}
                  menuItems={[
                    {
                      label: 'Update Title',
                      handleClick: () => {
                        setSelectedTitle(title)
                        setEditModalOpen(true)
                      },
                    },
                    {
                      label: 'Delete Title',
                      handleClick: () => handleRemoveTitle(title.id),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: 'Hard Delete Title',
                            handleClick: () => handleRemoveTitle(title.id, true),
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
      <EditTitleModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        title={selectedTitle}
      />
    </Container>
  );
}

export default TitleGallery
