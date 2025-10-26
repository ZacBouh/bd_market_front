import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import {
  formatCurrency,
  formatDateOnly,
  formatDateTime,
  formatOrderStatus,
  parseDate,
} from '../utils';
import OrderItemsMobileList from './OrderItemsMobileList';
import OrderItemsTable from './OrderItemsTable';

type OrderAccordionProps = {
  order: Order;
  confirmingItemKey: string | null;
  cancellingItemKey: string | null;
  cancellingOrderRef: string | null;
  onConfirm: (orderRef: string, itemId: number) => void;
  onCancelItem: (orderRef: string, itemId: number) => void;
  onCancelOrder: (orderRef: string) => void;
};

const OrderAccordion = ({
  order,
  confirmingItemKey,
  cancellingItemKey,
  cancellingOrderRef,
  onConfirm,
  onCancelItem,
  onCancelOrder,
}: OrderAccordionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAccordionNarrow = useMediaQuery(theme.breakpoints.down('lg'));

  const itemNames = order.items.map((item) => item.copy.name).join(', ');
  const createdAtDate = parseDate(order.createdAt);
  const updatedAtDate = parseDate(order.updatedAt);
  const showUpdatedMetadata =
    !!order.updatedAt &&
    ((createdAtDate && updatedAtDate
      ? createdAtDate.getTime() !== updatedAtDate.getTime()
      : order.updatedAt !== order.createdAt));
  const orderStatusLabel = formatOrderStatus(order.status);
  const hasConfirmedItems = order.items.some((item) => !!item.buyerConfirmedAt);
  const canCancelOrder = !hasConfirmedItems && order.status !== 'CANCELED';
  const isCancellingOrder = cancellingOrderRef === order.orderRef;
  const isOrderActionInProgress =
    isCancellingOrder || Boolean(cancellingItemKey?.startsWith(`${order.orderRef}:`));

  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`order-${order.orderRef}`}
        id={`order-${order.orderRef}`}
        sx={{
          py: { xs: theme.spacing(1.5), md: theme.spacing(2) },
          '& .MuiAccordionSummary-expandIconWrapper': {
            ml: 2,
          },
          '& .MuiAccordionSummary-content': {
            width: '100%',
            margin: 0,
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <Stack
          direction={isAccordionNarrow ? 'column' : 'row'}
          spacing={isAccordionNarrow ? 1.5 : 2}
          alignItems={isAccordionNarrow ? 'flex-start' : 'center'}
          justifyContent="space-between"
          sx={{ width: '100%', pb: isAccordionNarrow ? 1 : 0 }}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap={!isAccordionNarrow}
              sx={{
                maxWidth: isAccordionNarrow ? '100%' : '60ch',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: {
                  xs: theme.typography.subtitle1.fontSize,
                  md: theme.typography.h6.fontSize,
                },
              }}
            >
              {`Order ${order.orderRef}${itemNames ? ` — ${itemNames}` : ''}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDateOnly(order.createdAt)}
            </Typography>
          </Stack>
          <Stack
            direction={isAccordionNarrow ? 'column' : 'row'}
            spacing={isAccordionNarrow ? 1.5 : 2}
            alignItems={isAccordionNarrow ? 'flex-start' : 'center'}
            sx={{ mr: isAccordionNarrow ? 0 : 1 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {formatCurrency(order.amountTotal, order.currency)}
            </Typography>
            <Chip label={orderStatusLabel} color="primary" variant="outlined" />
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ py: { xs: theme.spacing(2), md: theme.spacing(2.5) } }}>
        <Stack spacing={2.5}>
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
          {isMobile ? (
            <OrderItemsMobileList
              items={order.items}
              orderRef={order.orderRef}
              confirmingItemKey={confirmingItemKey}
              cancellingItemKey={cancellingItemKey}
              isOrderBeingCancelled={isOrderActionInProgress}
              onConfirm={onConfirm}
              onCancel={onCancelItem}
            />
          ) : (
            <OrderItemsTable
              items={order.items}
              orderRef={order.orderRef}
              confirmingItemKey={confirmingItemKey}
              cancellingItemKey={cancellingItemKey}
              isOrderBeingCancelled={isOrderActionInProgress}
              onConfirm={onConfirm}
              onCancel={onCancelItem}
            />
          )}
          {canCancelOrder ? (
            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                onClick={() => onCancelOrder(order.orderRef)}
                disabled={isOrderActionInProgress}
              >
                Cancel entire order
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderAccordion;
