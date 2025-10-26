import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { cancelOrder, cancelOrderItem, confirmOrderItem, getOrders } from '@/backend/api/orders';
import PageHero from '@/components/PageHero';
import { useOrders } from '@/hooks/useOrders';
import { useUser } from '@/hooks/useUser';
import OrderAccordion from './components/OrderAccordion';

const OrdersPage = () => {
  const { user } = useUser();
  const { orders, setOrders } = useOrders();

  const userId = user?.user?.id;
  const [confirmingItemKey, setConfirmingItemKey] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState<
    | { type: 'item'; orderRef: string; itemId: number }
    | { type: 'order'; orderRef: string }
    | null
  >(null);
  const [cancellingTarget, setCancellingTarget] = useState<typeof cancelDialog>(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    return getOrders(userId);
  }, [userId, setOrders]);

  const ordersByDate = useMemo(
    () =>
      [...orders].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [orders],
  );

  const handleConfirm = useCallback(
    async (orderRef: string, itemId: number) => {
      if (!userId) {
        return;
      }

      const itemKey = `${orderRef}:${itemId}`;
      setConfirmingItemKey(itemKey);

      try {
        await confirmOrderItem(orderRef, itemId);
        getOrders(userId);
      } catch (error) {
        console.error('Failed to confirm order item', error);
      } finally {
        setConfirmingItemKey((current) => (current === itemKey ? null : current));
      }
    },
    [userId],
  );

  const handleRequestCancelItem = useCallback((orderRef: string, itemId: number) => {
    setCancelDialog({ type: 'item', orderRef, itemId });
  }, []);

  const handleRequestCancelOrder = useCallback((orderRef: string) => {
    setCancelDialog({ type: 'order', orderRef });
  }, []);

  const handleCloseCancelDialog = useCallback(() => {
    if (cancellingTarget) {
      return;
    }

    setCancelDialog(null);
  }, [cancellingTarget]);

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelDialog || !userId) {
      return;
    }

    setCancellingTarget(cancelDialog);

    try {
      if (cancelDialog.type === 'item') {
        await cancelOrderItem(cancelDialog.orderRef, cancelDialog.itemId);
      } else {
        await cancelOrder(cancelDialog.orderRef);
      }

      getOrders(userId);
    } catch (error) {
      const targetLabel = cancelDialog.type === 'item' ? 'order item' : 'order';
      console.error(`Failed to cancel ${targetLabel}`, error);
    } finally {
      setCancellingTarget(null);
      setCancelDialog(null);
    }
  }, [cancelDialog, userId]);

  const cancellingItemKey =
    cancellingTarget?.type === 'item' ? `${cancellingTarget.orderRef}:${cancellingTarget.itemId}` : null;
  const cancellingOrderRef =
    cancellingTarget?.type === 'order' ? cancellingTarget.orderRef : null;

  const dialogTitle = cancelDialog?.type === 'item' ? 'Cancel item purchase' : 'Cancel order';
  const cancelActionLabel = cancelDialog?.type === 'item' ? 'Cancel item' : 'Cancel order';
  const keepActionLabel = cancelDialog?.type === 'item' ? 'Keep item' : 'Keep order';

  const cancelDialogItemName = useMemo(() => {
    if (!cancelDialog || cancelDialog.type !== 'item') {
      return null;
    }

    const order = orders.find((entry) => entry.orderRef === cancelDialog.orderRef);
    const item = order?.items.find((entry) => entry.id === cancelDialog.itemId);

    return item?.copy.name ?? null;
  }, [cancelDialog, orders]);

  return (
    <>
      <meta name="title" content="Orders" />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <PageHero
            title="My Orders"
            description="Review your orders and inspect the detailed content of each transaction."
          />
          {ordersByDate.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your recent orders will appear here once you purchase an item from the marketplace.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {ordersByDate.map((order) => (
                <OrderAccordion
                  key={order.orderRef}
                  order={order}
                  confirmingItemKey={confirmingItemKey}
                  cancellingItemKey={cancellingItemKey}
                  cancellingOrderRef={cancellingOrderRef}
                  onConfirm={handleConfirm}
                  onCancelItem={handleRequestCancelItem}
                  onCancelOrder={handleRequestCancelOrder}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Container>

      <Dialog open={!!cancelDialog} onClose={handleCloseCancelDialog} fullWidth maxWidth="xs">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {cancelDialog?.type === 'item' ? (
              <>
                Are you sure you want to cancel the purchase
                {cancelDialogItemName ? ` of ${cancelDialogItemName}` : ' of this item'} from order
                {' '}
                {cancelDialog?.orderRef}?
              </>
            ) : (
              <>Are you sure you want to cancel the entire order {cancelDialog?.orderRef}?</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} disabled={!!cancellingTarget}>
            {keepActionLabel}
          </Button>
          <Button onClick={handleConfirmCancel} color="error" disabled={!!cancellingTarget}>
            {cancelActionLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersPage;
