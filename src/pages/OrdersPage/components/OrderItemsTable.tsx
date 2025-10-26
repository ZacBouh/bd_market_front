import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { formatCurrency, formatDateTime, formatOrderItemStatus } from '../utils';

type OrderItemsTableProps = {
  items: Order['items'];
  orderRef: string;
  confirmingItemKey: string | null;
  cancellingItemKey: string | null;
  isOrderBeingCancelled: boolean;
  onConfirm: (orderRef: string, itemId: number) => void;
  onCancel: (orderRef: string, itemId: number) => void;
};

const OrderItemsTable = ({
  items,
  orderRef,
  confirmingItemKey,
  cancellingItemKey,
  isOrderBeingCancelled,
  onConfirm,
  onCancel,
}: OrderItemsTableProps) => (
  <TableContainer component={Paper} variant="outlined">
    <Table
      size="small"
      sx={{
        '& .MuiTableCell-root': {
          px: 2.5,
          py: 1.5,
        },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell>Seller</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="center" sx={{ width: 200 }} />
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {item.copy.name}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell>{item.seller.pseudo}</TableCell>
            <TableCell>{formatOrderItemStatus(item.status)}</TableCell>
            <TableCell align="right">{formatCurrency(item.price, item.currency)}</TableCell>
            <TableCell align="center">
              <Stack spacing={0.5} alignItems="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    size="small"
                    variant="contained"
                    disabled={
                      item.status === 'CANCELED' ||
                      !!item.buyerConfirmedAt ||
                      confirmingItemKey === `${orderRef}:${item.id}` ||
                      cancellingItemKey === `${orderRef}:${item.id}` ||
                      isOrderBeingCancelled
                    }
                    onClick={() => onConfirm(orderRef, item.id)}
                    startIcon={<CheckIcon fontSize="small" />}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    disabled={
                      item.status === 'CANCELED' ||
                      !!item.buyerConfirmedAt ||
                      cancellingItemKey === `${orderRef}:${item.id}` ||
                      isOrderBeingCancelled
                    }
                    onClick={() => onCancel(orderRef, item.id)}
                    startIcon={<CloseIcon fontSize="small" />}
                  >
                    Cancel
                  </Button>
                </Stack>
                {item.buyerConfirmedAt ? (
                  <Typography variant="caption" color="text.secondary">
                    Confirmed on {formatDateTime(item.buyerConfirmedAt)}
                  </Typography>
                ) : null}
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OrderItemsTable;
