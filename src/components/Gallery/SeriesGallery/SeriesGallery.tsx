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
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useState } from 'react';

import { API_BASE_URL } from '@/backend/api/api';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import { getSeries, removeSeries } from '@/backend/api/series';
import EditSeriesModal from '@/components/Forms/AddSeriesForm/EditSeriesModal';
import { useUser } from '@/hooks/useUser';
import { USER_ROLES } from '@/types/enums/UserRole';
import { onGoingStatusLabel, type SupportedOnGoingStatus } from '@/types/enums/onGoingStatus';

const SeriesGallery = ({ series }: { series: CreatedSeries[] }) => {
  const notifications = useNotifications();
  const { user } = useUser();
  const isAdmin = user?.user.roles?.includes(USER_ROLES.ADMIN) ?? false;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<CreatedSeries | undefined>(undefined);

  const handleRemoveSeries = async (seriesId: CreatedSeries['id'], hardDelete = false) => {
    try {
      const response = await removeSeries(seriesId, { hardDelete });
      notifications.show(response.message ?? 'Series removed successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getSeries();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Series not found.' : 'Failed to remove the series.');
      notifications.show(errorMessage, {
        severity: 'error',
        autoHideDuration: 4000,
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {series.map((item) => (
          <Grid2 key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
                  image={item.coverImage?.url ? `${API_BASE_URL}${item.coverImage.url}` : undefined}
                  alt={item.coverImage?.imageName ?? item.name}
                  sx={{ backgroundColor: item.coverImage?.url ? undefined : 'grey.100' }}
                />
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Publisher: {item.publisher?.name ?? 'Unknown'}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={onGoingStatusLabel[(item.onGoingStatus ?? 'ongoing') as SupportedOnGoingStatus]}
                  size="small"
                  color="default"
                  variant="filled"
                />
                <ButtonMenu
                  ButtonElement={IconButton}
                  buttonProps={{ children: <MoreVertIcon />, sx: { borderRadius: 2 } }}
                  menuItems={[
                    {
                      label: 'Update Series',
                      handleClick: () => {
                        setSelectedSeries(item);
                        setEditModalOpen(true);
                      },
                    },
                    {
                      label: 'Delete Series',
                      handleClick: () => handleRemoveSeries(item.id),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: 'Hard Delete Series',
                            handleClick: () => handleRemoveSeries(item.id, true),
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
      <EditSeriesModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        series={selectedSeries}
      />
    </Container>
  );
};

export default SeriesGallery;
