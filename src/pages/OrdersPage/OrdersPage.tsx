import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';

import { getOrders } from '@/backend/api/orders';
import PageHero from '@/components/PageHero';
import { useOrders } from '@/hooks/useOrders';
import { useUser } from '@/hooks/useUser';
import { OrderStatus as OrderStatusLabel } from '@/types/enums/OrderStatus';

const currencyToIso = (currency: string) => {
  if (!currency) {
    return 'EUR';
  }

  if (currency.toLowerCase() === 'euro') {
    return 'EUR';
  }

  return currency.toUpperCase();
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyToIso(currency),
  }).format(amount / 100);

const parseDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatDateOnly = (value: string | null) => {
  const date = parseDate(value);

  if (!date) {
    return value ?? '-';
  }

  return date.toLocaleDateString();
};

const formatDateTime = (value: string | null) => {
  const date = parseDate(value);

  if (!date) {
    return value ?? '-';
  }

  return date.toLocaleString();
};

const humanizeStatus = (status: string) =>
  status
    ? status
        .toLowerCase()
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : '-';

const formatOrderStatus = (status: string) =>
  OrderStatusLabel[status as keyof typeof OrderStatusLabel] ?? humanizeStatus(status);

const OrdersPage = () => {
  const { user } = useUser();
  const { orders, setOrders } = useOrders();

  const userId = user?.user?.id;

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
              {ordersByDate.map((order) => {
                const itemNames = order.items.map((item) => item.copy.name).join(', ');
                const createdAtDate = parseDate(order.createdAt);
                const updatedAtDate = parseDate(order.updatedAt);
                const showUpdatedMetadata =
                  !!order.updatedAt &&
                  ((createdAtDate && updatedAtDate
                    ? createdAtDate.getTime() !== updatedAtDate.getTime()
                    : order.updatedAt !== order.createdAt));
                const orderStatusLabel = formatOrderStatus(order.status);

                return (
                  <Accordion key={order.orderRef} disableGutters>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`order-${order.orderRef}`}
                      id={`order-${order.orderRef}`}
                    >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 2 }}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                      sx={{ width: '100%' }}
                    >
                      <Stack spacing={0.5}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          noWrap
                          sx={{
                            maxWidth: { xs: '100%', sm: '60ch' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {`Order ${order.orderRef}${itemNames ? ` — ${itemNames}` : ''}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {formatDateOnly(order.createdAt)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mr: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {formatCurrency(order.amountTotal, order.currency)}
                        </Typography>
                        <Chip label={orderStatusLabel} color="primary" variant="outlined" />
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
                        {showUpdatedMetadata ? (
                          <Typography variant="body2" color="text.secondary">
                            Updated on {formatDateTime(order.updatedAt)}
                          </Typography>
                        ) : null}
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell>Seller</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Price</TableCell>
                              <TableCell>Buyer confirmation</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Stack spacing={0.5}>
                                    <Typography variant="body2" fontWeight={600}>
                                      {item.copy.name}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell>{item.seller.pseudo}</TableCell>
                                <TableCell>{humanizeStatus(item.status)}</TableCell>
                                <TableCell align="right">
                                  {formatCurrency(item.price, item.currency)}
                                </TableCell>
                                <TableCell>{formatDateTime(item.buyerConfirmedAt)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default OrdersPage;
