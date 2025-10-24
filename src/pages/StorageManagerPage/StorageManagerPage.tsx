import { useCallback, useEffect, useMemo, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { deleteUploadedImages, listUploadedImages } from '@/backend/api/storage';
import { API_BASE_URL } from '@/backend/api/api';
import { notification } from '@/utils/padNotification';

const formatFileSize = (size?: number | null): string => {
  if (typeof size !== 'number' || Number.isNaN(size)) {
    return 'Unknown size';
  }

  if (size === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  const exponent = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** exponent;

  const formatted = value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1);

  return `${formatted} ${units[exponent]}`;
};

const buildImageUrl = (url: string): string => {
  if (!url) {
    return '';
  }

  try {
    return new URL(url, API_BASE_URL).toString();
  } catch (error) {
    console.error('Failed to build image URL', error);
    return url;
  }
};

const buildImageSubtitle = (image: UploadedImage): string => {
  const dimensionPart = image.imageDimensions ? `${image.imageDimensions} · ` : '';
  const sizePart = formatFileSize(image.fileSize);
  const updatedAt = image.updatedAt ? dayjs(image.updatedAt).format('MMM D, YYYY HH:mm') : 'Unknown date';

  return `${dimensionPart}${sizePart} · ${updatedAt}`;
};

function StorageManagerPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAllSelected = useMemo(
    () => images.length > 0 && selectedIds.size === images.length,
    [images.length, selectedIds.size],
  );

  const selectedCountLabel = useMemo(() => {
    if (!selectedIds.size) {
      return 'No images selected';
    }

    if (selectedIds.size === 1) {
      return '1 image selected';
    }

    return `${selectedIds.size} images selected`;
  }, [selectedIds.size]);

  const toggleImageSelection = useCallback((id: number) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((previous) => {
      if (isAllSelected) {
        return new Set<number>();
      }

      if (!images.length) {
        return previous;
      }

      return new Set(images.map((image) => image.id));
    });
  }, [images, isAllSelected]);

  const loadImages = useCallback(() => {
    setIsLoading(true);
    const { request, cancel, signal } = listUploadedImages((data) => {
      setImages(data);
      setSelectedIds(new Set());
    });

    request
      .catch((requestError) => {
        const axiosError = requestError as { code?: string };
        if (signal.aborted || axiosError.code === 'ERR_CANCELED') {
          return;
        }

        console.error('Unable to load uploaded images', requestError);
        notification.show('Unable to load uploaded images. Please try again.', {
          severity: 'error',
        });
      })
      .finally(() => {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      });

    return cancel;
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedIds.size) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} selected image${selectedIds.size > 1 ? 's' : ''}?`,
    );

    if (!confirmed) {
      return;
    }

    const idsToDelete = Array.from(selectedIds);
    const idsToDeleteSet = new Set(idsToDelete);

    setIsDeleting(true);

    const { request, signal } = deleteUploadedImages(idsToDelete, (_response) => {
      setImages((previous) => previous.filter((image) => !idsToDeleteSet.has(image.id)));
      setSelectedIds(new Set());
      const deletedCount = idsToDelete.length;
      notification.show(
        `${deletedCount} image${deletedCount > 1 ? 's' : ''} deleted successfully`,
        { severity: 'success' },
      );
    });

    request
      .catch((requestError) => {
        const axiosError = requestError as { code?: string };
        if (signal.aborted || axiosError.code === 'ERR_CANCELED') {
          return;
        }

        console.error('Failed to delete selected images', requestError);
        notification.show('Failed to delete selected images', { severity: 'error' });
      })
      .finally(() => {
        if (!signal.aborted) {
          setIsDeleting(false);
        }
      });
  }, [selectedIds]);

  useEffect(() => {
    const cancel = loadImages();

    return () => {
      cancel();
    };
  }, [loadImages]);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhotoLibraryIcon color="primary" />
          <Typography component="h1" variant="h4">
            Media Library
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => loadImages()}
            disabled={isLoading || isDeleting}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={toggleSelectAll}
            disabled={!images.length}
          >
            {isAllSelected ? 'Deselect all' : 'Select all'}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={!selectedIds.size || isDeleting}
          >
            Delete selected
          </Button>
        </Stack>
      </Stack>

      <Typography sx={{ mt: 1 }} color="text.secondary" variant="body2">
        {selectedCountLabel}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : null}

      {!isLoading && !images.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <Typography color="text.secondary">No images uploaded yet.</Typography>
        </Box>
      ) : null}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {images.map((image) => {
          const selected = selectedIds.has(image.id);
          const subtitle = buildImageSubtitle(image);
          const imageUrl = buildImageUrl(image.url);

          return (
            <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                variant="outlined"
                onClick={() => toggleImageSelection(image.id)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  borderWidth: selected ? 2 : 1,
                  borderColor: (theme) => (selected ? theme.palette.primary.main : theme.palette.divider),
                  transition: (theme) => theme.transitions.create(['transform', 'box-shadow'], { duration: theme.transitions.duration.shortest }),
                  boxShadow: selected ? 4 : 0,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    loading="lazy"
                    src={imageUrl}
                    alt={image.imageName || image.fileName}
                    sx={{
                      height: 220,
                      width: '100%',
                      objectFit: 'cover',
                      borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Checkbox
                    checked={selected}
                    tabIndex={-1}
                    onChange={() => toggleImageSelection(image.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      '&:hover': {
                        bgcolor: 'background.paper',
                      },
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography gutterBottom noWrap variant="subtitle1">
                    {image.imageName || image.originalFileName || image.fileName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default StorageManagerPage;
