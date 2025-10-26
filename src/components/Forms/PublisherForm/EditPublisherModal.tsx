import { Button, Stack, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core/useNotifications';

import AppModal from '@/components/Common/AppModal';
import PublisherForm, { PublisherFormProps } from './PublisherForm';
import { getPublishers, updatePublisher } from '@/backend/api/publisher';

const EditPublisherModal = ({
  open,
  handleClose,
  publisher,
}: {
  open: boolean;
  handleClose: () => void;
  publisher?: CreatedPublisher;
}) => {
  const notifications = useNotifications();

  const handleSubmit: PublisherFormProps['onSubmit'] = async (formData) => {
    if (!publisher) {
      return;
    }

    formData.set('id', String(publisher.id));

    try {
      const response = await updatePublisher(formData);
      notifications.show(response.message ?? 'Publisher updated successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getPublishers();
      handleClose();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Publisher not found.' : 'Failed to update the publisher.');
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
          <Typography variant="h5">Edit {publisher?.name}</Typography>
          <Button color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Stack>
        <PublisherForm
          surface="plain"
          prePopulatedName={publisher?.name}
          publisher={publisher}
          onSubmit={handleSubmit}
          submitLabel="Update publisher"
        />
      </Stack>
    </AppModal>
  );
};

export default EditPublisherModal;
