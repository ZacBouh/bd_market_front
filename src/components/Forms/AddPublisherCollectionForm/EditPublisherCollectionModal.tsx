import { Button, Stack, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core/useNotifications';

import AppModal from '@/components/Common/AppModal';
import AddPublisherCollectionForm, { type AddPublisherCollectionFormProps } from './AddPublisherCollectionForm';
import { getPublisherCollections, updatePublisherCollection } from '@/backend/api/publisherCollection';

const mapCollectionToInitialValues = (collection?: CreatedPublisherCollection) => {
  if (!collection) {
    return undefined;
  }

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    language: collection.language,
    publisherId: collection.publisher?.id,
    publisher: collection.publisher,
    birthDate: collection.birthDate,
    deathDate: collection.deathDate,
  } satisfies AddPublisherCollectionFormProps['prePopulatedInputs'];
};

const EditPublisherCollectionModal = ({
  open,
  handleClose,
  collection,
}: {
  open: boolean;
  handleClose: () => void;
  collection?: CreatedPublisherCollection;
}) => {
  const notifications = useNotifications();
  const initialValues = mapCollectionToInitialValues(collection);

  const handleSubmit: AddPublisherCollectionFormProps['onSubmit'] = async (formData, state) => {
    if (!collection) {
      return;
    }

    formData.set('id', String(collection.id));
    if (state.language) {
      formData.set('language', state.language);
    }
    if (state.publisherId) {
      formData.set('publisherId', String(state.publisherId));
    }

    try {
      const response = await updatePublisherCollection(formData);
      notifications.show(response.message ?? 'Collection updated successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getPublisherCollections();
      handleClose();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Collection not found.' : 'Failed to update the collection.');
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
          <Typography variant="h5">Edit {collection?.name}</Typography>
          <Button color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Stack>
        <AddPublisherCollectionForm
          surface="plain"
          prePopulatedInputs={initialValues}
          submitLabel="Update collection"
          onSubmit={handleSubmit}
        />
      </Stack>
    </AppModal>
  );
};

export default EditPublisherCollectionModal;
