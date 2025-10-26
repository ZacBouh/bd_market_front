import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
  onConfirm: (orderRef: string, itemId: number) => void;
};

const OrderAccordion = ({ order, confirmingItemKey, onConfirm }: OrderAccordionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`order-${order.orderRef}`}
        id={`order-${order.orderRef}`}
        sx={{
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
              noWrap={!isMobile}
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
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mr: { sm: 1 } }}
          >
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
          {isMobile ? (
            <OrderItemsMobileList
              items={order.items}
              orderRef={order.orderRef}
              confirmingItemKey={confirmingItemKey}
              onConfirm={onConfirm}
            />
          ) : (
            <OrderItemsTable
              items={order.items}
              orderRef={order.orderRef}
              confirmingItemKey={confirmingItemKey}
              onConfirm={onConfirm}
            />
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderAccordion;
