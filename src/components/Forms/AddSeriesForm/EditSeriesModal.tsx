import { Button, Stack, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core/useNotifications';

import AppModal from '@/components/Common/AppModal';
import AddSeriesForm, { AddSeriesFormProps } from './AddSeriesForm';
import { getSeries, updateSeries } from '@/backend/api/series';

const mapSeriesToInitialValues = (series?: CreatedSeries) => {
  if (!series) {
    return undefined;
  }

  return {
    id: series.id,
    name: series.name,
    language: series.language,
    onGoingStatus: series.onGoingStatus,
    publisherId: series.publisher?.id,
    publisher: series.publisher as CreatedPublisher | undefined,
  } satisfies Partial<NewSeries> & { publisher?: CreatedPublisher };
};

const EditSeriesModal = ({ open, handleClose, series }: { open: boolean; handleClose: () => void; series?: CreatedSeries }) => {
  const notifications = useNotifications();
  const initialValues = mapSeriesToInitialValues(series);

  const handleSubmit: AddSeriesFormProps['onSubmit'] = async (formData, state) => {
    if (!series) {
      return;
    }

    formData.set('id', String(series.id));
    if (state.language) {
      formData.set('language', state.language);
    }
    if (state.onGoingStatus) {
      formData.set('onGoingStatus', state.onGoingStatus);
    }
    if (state.publisherId) {
      formData.set('publisherId', String(state.publisherId));
    }

    try {
      const response = await updateSeries(formData);
      notifications.show(response.message ?? 'Series updated successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getSeries();
      handleClose();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Series not found.' : 'Failed to update the series.');
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
          <Typography variant="h5">Edit {series?.name}</Typography>
          <Button color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Stack>
        <AddSeriesForm
          surface="plain"
          initialValues={initialValues}
          submitLabel="Update series"
          onSubmit={handleSubmit}
        />
      </Stack>
    </AppModal>
  );
};

export default EditSeriesModal;
