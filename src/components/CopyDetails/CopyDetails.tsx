import dayjs from 'dayjs';
import { ReactNode, useMemo } from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

import { getImageUrl } from '@/utils/image';
import { formatCurrencyAmount } from '@/utils/price';

type CopyDetailsProps = {
  copy: DetailedCopy;
};

type DetailRowProps = {
  label: string;
  value?: ReactNode;
};

const DetailRow = ({ label, value }: DetailRowProps) => (
  <Stack spacing={0.5} direction="row" justifyContent="space-between" alignItems="baseline">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500} textAlign="right">
      {value ?? '—'}
    </Typography>
  </Stack>
);

const formatCondition = (condition?: string) => {
  if (!condition) {
    return undefined;
  }

  const lowerCased = condition.toLowerCase().replaceAll('_', ' ');

  return lowerCased.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date?: string) => (date ? dayjs(date).format('DD MMM YYYY · HH:mm') : undefined);

const CopyDetails = ({ copy }: CopyDetailsProps) => {
  const priceLabel = formatCurrencyAmount(copy.price, copy.currency);
  const boughtForLabel = formatCurrencyAmount(copy.boughtForPrice, copy.boughtForCurrency);
  const ownerName =
    copy.owner?.name ?? copy.owner?.fullName ?? copy.owner?.email ?? copy.owner?.username ?? '—';

  const imageList = useMemo(
    () => copy.uploadedImages?.filter((image) => Boolean(image?.url)) ?? [],
    [copy.uploadedImages],
  );

  return (
    <Stack spacing={4}>
      <Grid2 container spacing={4} alignItems="stretch">
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardMedia
              component="img"
              image={getImageUrl(copy.coverImage?.url)}
              alt={copy.coverImage?.imageName ?? copy.title?.name ?? 'Copy cover'}
              sx={{
                width: '100%',
                maxHeight: 480,
                objectFit: 'cover',
              }}
            />
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Typography variant="h4" component="h1">
                    {copy.title?.name ?? 'Copy details'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Owned by {ownerName}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {priceLabel && <Chip label={priceLabel} color="primary" />}
                    {copy.copyCondition && (
                      <Chip label={formatCondition(copy.copyCondition)} variant="outlined" />
                    )}
                    {copy.forSale !== undefined && (
                      <Chip
                        label={copy.forSale ? 'Available for sale' : 'Not for sale'}
                        color={copy.forSale ? 'success' : 'default'}
                        variant={copy.forSale ? 'filled' : 'outlined'}
                      />
                    )}
                  </Stack>
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <DetailRow label="Title ID" value={copy.title?.id} />
                  <DetailRow label="Copy ID" value={copy.id} />
                  <DetailRow label="Owner ID" value={copy.owner?.id} />
                  <DetailRow label="Listed price" value={priceLabel} />
                  <DetailRow label="Bought for" value={boughtForLabel} />
                  <DetailRow label="Currency" value={copy.currency?.toUpperCase()} />
                  <DetailRow label="Purchase currency" value={copy.boughtForCurrency?.toUpperCase()} />
                  <DetailRow label="Created" value={formatDate(copy.createdAt)} />
                  <DetailRow label="Updated" value={formatDate(copy.updatedAt)} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      {imageList.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Uploaded images
          </Typography>
          <Grid2 container spacing={2}>
            {imageList.map((image) => (
              <Grid2 key={image.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={getImageUrl(image.url)}
                    alt={image.imageName}
                    sx={{ height: 220, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      {image.imageName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {image.originalFileName ?? image.fileName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Stack>
      )}
    </Stack>
  );
};

export default CopyDetails;
