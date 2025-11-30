import axios, { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { Alert, Box, CircularProgress, Container, Stack, Typography } from '@mui/material';

import CopyDetails from '@/components/CopyDetails';
import { getCopyById } from '@/backend/api/copy';

type RouteParams = {
  copyId?: string;
};

const CopyDetailsPage = () => {
  const { copyId } = useParams<RouteParams>();
  const [copy, setCopy] = useState<DetailedCopy | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const normalizedCopyId = useMemo(() => {
    if (!copyId) {
      return undefined;
    }

    const parsed = Number(copyId);

    if (!Number.isFinite(parsed)) {
      return undefined;
    }

    return parsed;
  }, [copyId]);

  useEffect(() => {
    if (!copyId) {
      setError('Copy identifier is missing.');
      setCopy(null);
      return;
    }

    if (normalizedCopyId === undefined) {
      setError('Invalid copy identifier.');
      setCopy(null);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(undefined);
    setCopy(null);

    getCopyById(normalizedCopyId, { signal: controller.signal })
      .then((result) => {
        setCopy(result);
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError)) {
          return;
        }

        const axiosError = requestError as AxiosError<ApiResponse>;
        const message = axiosError.response?.data?.message ?? 'Failed to load copy details.';

        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [copyId, normalizedCopyId]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h3" component="h1">
          Copy details
        </Typography>
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}
        {!loading && error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && copy && <CopyDetails copy={copy} />}
        {!loading && !error && !copy && (
          <Alert severity="info">No copy information available.</Alert>
        )}
      </Stack>
    </Container>
  );
};

export default CopyDetailsPage;
