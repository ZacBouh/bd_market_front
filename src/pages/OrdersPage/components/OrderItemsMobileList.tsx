import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { formatCurrency, formatDateTime, formatOrderItemStatus } from '../utils';

type OrderItemsMobileListProps = {
  items: Order['items'];
  orderRef: string;
  confirmingItemKey: string | null;
  cancellingItemKey: string | null;
  isOrderBeingCancelled: boolean;
  onConfirm: (orderRef: string, itemId: number) => void;
  onCancel: (orderRef: string, itemId: number) => void;
};

const OrderItemsMobileList = ({
  items,
  orderRef,
  confirmingItemKey,
  cancellingItemKey,
  isOrderBeingCancelled,
  onConfirm,
  onCancel,
}: OrderItemsMobileListProps) => (
  <Stack spacing={1.5}>
    {items.map((item) => {
      const isConfirming = confirmingItemKey === `${orderRef}:${item.id}`;
      const isCancelling = cancellingItemKey === `${orderRef}:${item.id}`;
      const isDisabled =
        item.status === 'CANCELED' ||
        !!item.buyerConfirmedAt ||
        isConfirming ||
        isCancelling ||
        isOrderBeingCancelled;

      return (
        <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack spacing={0.25}>
              <Typography variant="subtitle2" fontWeight={600}>
                {item.copy.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller · {item.seller.pseudo}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatOrderItemStatus(item.status)}
              </Typography>
            </Stack>

            <Divider flexItem sx={{ my: 0 }} />

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Price
              </Typography>
              <Typography variant="subtitle2" fontWeight={600}>
                {formatCurrency(item.price, item.currency)}
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  disabled={isDisabled}
                  onClick={() => onConfirm(orderRef, item.id)}
                  startIcon={<CheckIcon fontSize="small" />}
                >
                  Confirm
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  color="inherit"
                  disabled={isDisabled}
                  onClick={() => onCancel(orderRef, item.id)}
                  startIcon={<CloseIcon fontSize="small" />}
                >
                  Cancel
                </Button>
              </Stack>
              {item.buyerConfirmedAt ? (
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Confirmed on {formatDateTime(item.buyerConfirmedAt)}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      );
    })}
  </Stack>
);

export default OrderItemsMobileList;
