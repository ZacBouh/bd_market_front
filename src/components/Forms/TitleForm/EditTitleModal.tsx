import { Button, Stack, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core/useNotifications';

import AppModal from '@/components/Common/AppModal';
import TitleForm, { TitleFormProps } from './TitleForm';
import { getTitles, updateTitle } from '@/backend/api/title';
import type { SupportedLanguage } from '@/types/common';

const normalizeContributions = (title?: CreatedTitle) => {
  if (!title?.artistsContributions) {
    return { contributions: undefined, artistsMap: undefined } as const;
  }

  const contributionsArray: CreatedContribution[] = Array.isArray(title.artistsContributions)
    ? title.artistsContributions
    : Object.values(title.artistsContributions) as CreatedContribution[];

  const contributions = contributionsArray.map<NewArtistContribution>((contribution) => ({
    artist: typeof contribution.artist === 'object' ? contribution.artist.id : contribution.artist,
    skills: contribution.skills,
  }));

  const artistsMap = contributionsArray.reduce<
    Record<number, { id: number; firstName: string; lastName: string; pseudo: string; fullName?: string; name?: string }>
  >((acc, contribution) => {
    const artist = contribution.artist;
    const artistId = typeof artist === 'object' ? artist.id : artist;
    if (typeof artistId !== 'number') {
      return acc;
    }

    if (typeof artist !== 'object') {
      return { ...acc, [artistId]: { id: artistId, firstName: '', lastName: '', pseudo: '' } };
    }

    const fallbackName = artist.fullName ?? artist.name ?? '';
    const fallbackNameParts = fallbackName.trim().split(' ').filter(Boolean);
    const [fallbackFirstName, ...fallbackLastName] = fallbackNameParts;

    const firstName = artist.firstName ?? fallbackFirstName ?? fallbackName ?? '';
    const lastName = artist.lastName ?? (fallbackLastName.length ? fallbackLastName.join(' ') : '');

    return {
      ...acc,
      [artistId]: {
        id: artist.id,
        firstName,
        lastName,
        pseudo: artist.pseudo ?? '',
        fullName: artist.fullName ?? undefined,
        name: artist.name ?? undefined,
      },
    };
  }, {});

  return { contributions, artistsMap } as const;
};

const EditTitleModal = ({ open, handleClose, title }: { open: boolean; handleClose: () => void; title?: CreatedTitle }) => {
  const notifications = useNotifications();
  const { contributions, artistsMap } = normalizeContributions(title);
  const publisherValue = title?.publisher
    ? { id: title.publisher.id, name: title.publisher.name ?? '' }
    : undefined;

  const handleSubmit: TitleFormProps['onSubmit'] = async (formData) => {
    if (!title) {
      return;
    }

    formData.set('id', String(title.id));

    try {
      const response = await updateTitle(formData);
      notifications.show(response.message ?? 'Title updated successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      getTitles();
      handleClose();
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiResponse; status?: number } };
      const errorMessage =
        axiosError?.response?.data?.message ??
        (axiosError?.response?.status === 404 ? 'Title not found.' : 'Failed to update the title.');
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
          <Typography variant="h5">Edit {title?.name}</Typography>
          <Button color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Stack>
        <TitleForm
          surface="plain"
          prePopulatedName={title?.name}
          description={title?.description ?? ''}
          releaseDate={title?.releaseDate ?? ''}
          language={(title?.language as SupportedLanguage | undefined) ?? undefined}
          coverImageFile={undefined}
          artistsContributions={contributions}
          artistsMap={artistsMap}
          publisher={publisherValue}
          isbn={title?.isbn ?? ''}
          series={title?.series}
          onSubmit={handleSubmit}
          submitLabel="Update title"
        />
      </Stack>
    </AppModal>
  );
};

export default EditTitleModal;
