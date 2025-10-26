import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { confirmOrderItem, getOrders } from '@/backend/api/orders';
import PageHero from '@/components/PageHero';
import { useOrders } from '@/hooks/useOrders';
import { useUser } from '@/hooks/useUser';
import OrderAccordion from './components/OrderAccordion';

const OrdersPage = () => {
  const { user } = useUser();
  const { orders, setOrders } = useOrders();

  const userId = user?.user?.id;
  const [confirmingItemKey, setConfirmingItemKey] = useState<string | null>(null);

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
                  onConfirm={handleConfirm}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default OrdersPage;
