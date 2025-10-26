import { Button, Stack, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core/useNotifications';

import AppModal from '@/components/Common/AppModal';
import ArtistForm, { ArtistFormProps } from './ArtistForm';
import { getArtists, updateArtist } from '@/backend/api/artist';

const normalizeArtistInitialValues = (artist?: CreatedArtist) => {
  if (!artist) {
    return undefined;
  }

  return {
    firstName: artist.firstName ?? '',
    lastName: artist.lastName ?? '',
    pseudo: artist.pseudo ?? '',
    dateOfBirth: (artist as CreatedArtist & { birthDate?: string }).birthDate ?? (artist as any).dateOfBirth ?? '',
    dateOfDeath: (artist as CreatedArtist & { deathDate?: string }).deathDate ?? (artist as any).dateOfDeath ?? '',
    skills: artist.skills ?? [],
  } satisfies Partial<ArtistForm>;
};

const EditArtistModal = ({ open, handleClose, artist }: { open: boolean; handleClose: () => void; artist?: CreatedArtist }) => {
  const notifications = useNotifications();
  const initialValues = normalizeArtistInitialValues(artist);

  const handleSubmit: ArtistFormProps['onSubmit'] = async (formData, state) => {
    if (!artist) {
      return;
    }

    formData.set('id', String(artist.id));
    formData.set('birthDate', state.dateOfBirth ?? '');
    formData.set('deathDate', state.dateOfDeath ?? '');

    try {
      const response = await updateArtist(formData);
      notifications.show(response.message ?? 'Artist updated successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getArtists();
      handleClose();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Artist not found.' : 'Failed to update the artist.');
      notifications.show(errorMessage, {
        severity: 'error',
        autoHideDuration: 4000,
      });
    }
  };

  return (
    <AppModal open={open} onClose={handleClose}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5">Edit {artist?.firstName} {artist?.lastName}</Typography>
          <Button color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Stack>
        <ArtistForm
          surface="plain"
          initialValues={initialValues}
          submitLabel="Update artist"
          onSubmit={handleSubmit}
        />
      </Stack>
    </AppModal>
  );
};

export default EditArtistModal;
