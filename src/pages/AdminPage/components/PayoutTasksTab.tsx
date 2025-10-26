import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import { isAxiosError } from 'axios';

import { getPayoutTasks, updatePayoutTask } from '@/backend/api/payoutTasks';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { notification } from '@/utils/padNotification';

const formatCurrency = (amountInCents: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(amountInCents / 100);

const formatDateTime = (date?: string) => (date ? dayjs(date).format('DD MMM YYYY · HH:mm') : '—');

type PayoutTaskFormValues = {
  status: string;
};

function PayoutTasksTab() {
  const [tasks, setTasks] = useState<PayoutTask[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<'all' | PayoutTaskPaymentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  const { control, handleSubmit, reset } = useForm<PayoutTaskFormValues>({
    defaultValues: { status: '' },
  });

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const statusOptions = useMemo(() => {
    const statuses = new Set<string>();
    tasks.forEach((task) => {
      if (task.status) {
        statuses.add(task.status);
      }
    });

    return Array.from(statuses).sort((left, right) => left.localeCompare(right));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (paymentTypeFilter !== 'all' && task.paymentType !== paymentTypeFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystacks = [
        task.seller?.pseudo,
        task.seller?.id,
        task.sellerId,
        task.orderRef,
        task.orderItemId,
        task.orderItemName,
      ]
        .filter((value): value is string | number => value !== null && value !== undefined)
        .map((value) => String(value).toLowerCase());

      return haystacks.some((value) => value.includes(normalizedQuery));
    });
  }, [paymentTypeFilter, searchQuery, tasks]);

  useEffect(() => {
    if (!selectedTaskId && filteredTasks.length > 0) {
      setSelectedTaskId(filteredTasks[0].id);
    }
    if (selectedTaskId && !filteredTasks.some((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(filteredTasks[0]?.id ?? null);
    }
  }, [filteredTasks, selectedTaskId]);

  useEffect(() => {
    reset({ status: selectedTask?.status ?? '' });
  }, [reset, selectedTask]);

  const fetchTasks = useCallback(
    async (controller: AbortController) => {
      setLoading(true);
      try {
        const data = await getPayoutTasks(statusFilter === 'all' ? undefined : statusFilter, controller.signal);
        console.log('[Admin] Loaded payout tasks', data);
        setTasks(data);
      } catch (error) {
        if (!isAxiosError(error) || error.code !== 'ERR_CANCELED') {
          console.error('Failed to load payout tasks', error);
          notification.show('Failed to load payout tasks', {
            severity: 'error',
            autoHideDuration: 3500,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [statusFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(controller);
    return () => controller.abort();
  }, [fetchTasks, refreshToken]);

  const handleRefresh = () => {
    setRefreshToken((value) => value + 1);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedTask) {
      return;
    }

    const nextStatus = values.status.trim();
    if (!nextStatus) {
      notification.show('Please provide a status before saving.', {
        severity: 'warning',
        autoHideDuration: 2500,
      });
      return;
    }

    setUpdating(true);
    try {
      await updatePayoutTask(selectedTask.id, { status: nextStatus });
      notification.show(`Payout task #${selectedTask.id} updated`, {
        severity: 'success',
        autoHideDuration: 2500,
      });
      setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error('Failed to update payout task', error);
      notification.show('Unable to update payout task.', {
        severity: 'error',
        autoHideDuration: 3500,
      });
    } finally {
      setUpdating(false);
    }
  });

  return (
    <Stack spacing={4} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, xl: 3 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Payout tasks</Typography>
              <Button onClick={handleRefresh} startIcon={<RefreshIcon />} disabled={loading} size="small">
                Refresh
              </Button>
            </Stack>
            <Stack spacing={1.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <MenuItem value="all">All statuses</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                size="small"
                label="Payment type"
                value={paymentTypeFilter}
                onChange={(event) => setPaymentTypeFilter(event.target.value as 'all' | PayoutTaskPaymentType)}
              >
                <MenuItem value="all">All payment types</MenuItem>
                <MenuItem value="ORDER">Order</MenuItem>
                <MenuItem value="REFUND">Refund</MenuItem>
              </TextField>
              <TextField
                fullWidth
                size="small"
                label="Search tasks"
                placeholder="Search seller, order ref, item ID or name"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </Stack>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {loading ? <LinearProgress /> : null}
              <List disablePadding>
                {filteredTasks.length === 0 && !loading ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No payout tasks found.
                    </Typography>
                  </Box>
                ) : null}
                {filteredTasks.map((task) => {
                  const sellerLabel =
                    task.seller?.pseudo ||
                    (task.seller?.id != null ? `Seller #${task.seller.id}` : null) ||
                    (task.sellerId != null ? `Seller #${task.sellerId}` : null);

                  const secondaryLine = [
                    formatCurrency(task.amount),
                    sellerLabel,
                    task.orderItemName || task.orderItemId,
                  ]
                    .filter((value): value is string => Boolean(value))
                    .join(' · ');

                  return (
                    <ListItem key={task.id} disablePadding>
                      <ListItemButton selected={task.id === selectedTaskId} onClick={() => setSelectedTaskId(task.id)}>
                        <ListItemText
                          primary={`Task #${task.id} · ${task.paymentType}${
                            task.orderRef ? ` · ${task.orderRef}` : ''
                          }`}
                          secondary={
                            <Stack spacing={0.25}>
                              <Typography variant="body2" color="text.primary">
                                {secondaryLine || '—'}
                              </Typography>
                              {task.status ? (
                                <Typography variant="caption" color="text.secondary">
                                  Status: {task.status}
                                </Typography>
                              ) : null}
                            </Stack>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 8, xl: 9 }}>
          {selectedTask ? (
            <FormLayout
              component="form"
              onSubmit={onSubmit}
              surface="card"
              title={`Payout task #${selectedTask.id}`}
              description={`Created ${formatDateTime(selectedTask.createdAt)}`}
              actions={[
                <Button key="save" type="submit" variant="contained" disabled={updating}>
                  {updating ? <CircularProgress size={20} /> : 'Save status'}
                </Button>,
              ]}
            >
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h6">{formatCurrency(selectedTask.amount)}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Payment type
                    </Typography>
                    <Typography variant="body1">{selectedTask.paymentType}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Seller
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body1">
                      {selectedTask.seller?.pseudo ||
                        (selectedTask.seller?.id != null ? `Seller #${selectedTask.seller.id}` : null) ||
                        (selectedTask.sellerId != null ? `Seller #${selectedTask.sellerId}` : '—')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seller ID · {selectedTask.seller?.id ?? selectedTask.sellerId ?? '—'}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order information
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">Order reference · {selectedTask.orderRef || '—'}</Typography>
                    <Typography variant="body2">Item ID · {selectedTask.orderItemId || '—'}</Typography>
                    <Typography variant="body2">Item name · {selectedTask.orderItemName || '—'}</Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Update status
                  </Typography>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        freeSolo
                        options={statusOptions}
                        value={field.value ?? ''}
                        onChange={(_event, value) => field.onChange(value ?? '')}
                        renderInput={(params) => <TextField {...params} label="Status" required />}
                      />
                    )}
                  />
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Metadata
                  </Typography>
                  {selectedTask.metadata ? (
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: (theme) => theme.palette.action.hover,
                        overflowX: 'auto',
                        fontSize: '0.85rem',
                      }}
                    >
                      {JSON.stringify(selectedTask.metadata, null, 2)}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      This payout task does not include metadata.
                    </Typography>
                  )}
                </Stack>
                <Divider />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last update
                    </Typography>
                    <Typography variant="body2">{formatDateTime(selectedTask.updatedAt)}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current status
                    </Typography>
                    <Typography variant="body2">{selectedTask.status}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Raw payload
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) => theme.palette.action.hover,
                      overflowX: 'auto',
                      fontSize: '0.85rem',
                    }}
                  >
                    {JSON.stringify(selectedTask, null, 2)}
                  </Box>
                </Stack>
              </Stack>
            </FormLayout>
          ) : (
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, minHeight: 320 }}>
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }} spacing={1}>
                <Typography variant="subtitle1">Select a payout task to view its details.</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Pick a payout task from the list to inspect its metadata and update the processing status.
                </Typography>
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}

export default PayoutTasksTab;
