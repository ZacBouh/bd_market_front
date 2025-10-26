import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import { isAxiosError } from 'axios';

import { deleteAdminUser, getAdminUsers, updateAdminUser } from '@/backend/api/adminUsers';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { notification } from '@/utils/padNotification';

type UserFormValues = {
  email: string;
  pseudo: string;
  roles: string[];
};

function UserManagementTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hardDelete, setHardDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm<UserFormValues>({
    defaultValues: {
      email: '',
      pseudo: '',
      roles: [],
    },
  });

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const roleOptions = useMemo(() => {
    const options = new Set<string>();
    users.forEach((user) => {
      user.roles.forEach((role) => options.add(role));
    });
    return Array.from(options).sort((left, right) => left.localeCompare(right));
  }, [users]);

  useEffect(() => {
    if (selectedUser) {
      reset({
        email: selectedUser.email,
        pseudo: selectedUser.pseudo,
        roles: Array.from(new Set(selectedUser.roles)),
      });
    } else {
      reset({ email: '', pseudo: '', roles: [] });
    }
    setHardDelete(false);
  }, [reset, selectedUser]);

  const fetchUsers = useCallback(
    async (controller: AbortController) => {
      setLoading(true);
      try {
        const data = await getAdminUsers(controller.signal);
        console.log('[Admin] Loaded users', data);
        setUsers(data);
      } catch (error) {
        if (!isAxiosError(error) || error.code !== 'ERR_CANCELED') {
          console.error('Failed to load users', error);
          notification.show('Failed to load users', {
            severity: 'error',
            autoHideDuration: 3500,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller);
    return () => controller.abort();
  }, [fetchUsers, refreshToken]);

  const handleRefresh = () => {
    setRefreshToken((value) => value + 1);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setHardDelete(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedUser) {
      return;
    }

    setSaving(true);
    try {
      await updateAdminUser({
        id: selectedUser.id,
        email: values.email.trim(),
        pseudo: values.pseudo.trim(),
        roles: values.roles.map((role) => role.trim()).filter(Boolean),
      });
      notification.show(`User #${selectedUser.id} updated`, {
        severity: 'success',
        autoHideDuration: 2500,
      });
      setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error('Failed to update user', error);
      notification.show('Unable to update user.', {
        severity: 'error',
        autoHideDuration: 3500,
      });
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!selectedUser) {
      return;
    }

    setDeleting(true);
    try {
      await deleteAdminUser(selectedUser.id, hardDelete ? true : undefined);
      notification.show(`User #${selectedUser.id} deleted`, {
        severity: 'success',
        autoHideDuration: 2500,
      });
      setDeleteDialogOpen(false);
      setHardDelete(false);
      setSelectedUserId(null);
      setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error('Failed to delete user', error);
      notification.show('Unable to delete user.', {
        severity: 'error',
        autoHideDuration: 3500,
      });
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      [user.pseudo, user.email]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [searchQuery, users]);

  useEffect(() => {
    if (!selectedUserId && filteredUsers.length > 0) {
      setSelectedUserId(filteredUsers[0].id);
    }
    if (selectedUserId && !filteredUsers.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(filteredUsers[0]?.id ?? null);
    }
  }, [filteredUsers, selectedUserId]);

  return (
    <Stack spacing={4} sx={{ mt: 2 }}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5, xl: 4 }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Users</Typography>
              <Button onClick={handleRefresh} startIcon={<RefreshIcon />} disabled={loading} size="small">
                Refresh
              </Button>
            </Stack>
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                label="Search users"
                placeholder="Search by pseudo or email"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {loading ? <LinearProgress /> : null}
              <List disablePadding sx={{ flex: 1, py: 1 }}>
                {filteredUsers.length === 0 && !loading ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found.
                    </Typography>
                  </Box>
                ) : null}
                {filteredUsers.map((user) => {
                  return (
                    <ListItem key={user.id} disablePadding>
                      <ListItemButton
                        selected={user.id === selectedUserId}
                        onClick={() => setSelectedUserId(user.id)}
                        sx={{ alignItems: 'flex-start', py: 1.75, px: 2, gap: 1.5 }}
                      >
                        <Stack spacing={1} flex={1} minWidth={0}>
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            spacing={1.5}
                          >
                            <Stack spacing={0.5} minWidth={0}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                              >
                                {user.pseudo || user.email || `User #${user.id}`}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {user.email || '—'}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              ID · {user.id}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {user.roles.map((role) => (
                              <Chip key={role} label={role} size="small" variant="outlined" />
                            ))}
                            {user.roles.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                No roles assigned
                              </Typography>
                            ) : null}
                            {user.emailVerified === true ? (
                              <Chip label="Email verified" size="small" color="success" variant="outlined" />
                            ) : user.emailVerified === false ? (
                              <Chip label="Email not verified" size="small" color="warning" variant="outlined" />
                            ) : null}
                          </Stack>
                        </Stack>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 7, xl: 8 }}>
          {selectedUser ? (
            <FormLayout
              component="form"
              onSubmit={onSubmit}
              surface="card"
              title={selectedUser.pseudo || selectedUser.email || `User #${selectedUser.id}`}
              description={`Created ${
                selectedUser.createdAt
                  ? dayjs(selectedUser.createdAt).format('DD MMM YYYY · HH:mm')
                  : '—'
              }`}
              actions={[
                <Button key="delete" type="button" color="error" variant="outlined" onClick={handleOpenDeleteDialog}>
                  Delete user
                </Button>,
                <Button key="save" type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={20} /> : 'Save changes'}
                </Button>,
              ]}
              sx={{ maxWidth: 'none', alignSelf: 'stretch', height: '100%' }}
            >
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={3}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="text.secondary">
                      Account
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="text.primary">
                      {selectedUser.pseudo || selectedUser.email || `User #${selectedUser.id}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email || '—'}
                    </Typography>
                  </Stack>
                  <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                    {selectedUser.emailVerified === true ? (
                      <Chip label="Email verified" size="small" color="success" variant="outlined" />
                    ) : selectedUser.emailVerified === false ? (
                      <Chip label="Email not verified" size="small" color="warning" variant="outlined" />
                    ) : null}
                    <Typography variant="body2" color="text.secondary">
                      Account ID · {selectedUser.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last updated · {selectedUser.updatedAt ? dayjs(selectedUser.updatedAt).format('DD MMM YYYY · HH:mm') : '—'}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <TextField {...field} label="Email" type="email" required fullWidth />}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="pseudo"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <TextField {...field} label="Pseudo" required fullWidth />}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Divider />
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Roles
                  </Typography>
                  <Controller
                    name="roles"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        freeSolo
                        options={roleOptions}
                        value={field.value ?? []}
                        onChange={(_event, value) => field.onChange(value)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                          ))
                        }
                        renderInput={(params) => <TextField {...params} label="Roles" placeholder="Add a role" />}
                      />
                    )}
                  />
                </Stack>
                <Divider />
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email verification
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.emailVerified === true
                      ? 'The email address is verified.'
                      : selectedUser.emailVerified === false
                      ? 'The email address is not verified.'
                      : 'Email verification status is unknown.'}
                  </Typography>
                </Stack>
                <Divider />
                <Stack spacing={2}>
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
                    {JSON.stringify(selectedUser, null, 2)}
                  </Box>
                </Stack>
              </Stack>
            </FormLayout>
          ) : (
            <Paper
              elevation={0}
              sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, minHeight: 320, height: '100%' }}
            >
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }} spacing={1}>
                <Typography variant="subtitle1">Select a user to manage their account.</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Pick a user from the list to update their details or adjust their access.
                </Typography>
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {hardDelete
              ? 'This action will permanently remove the user and all associated data.'
              : 'The user will be soft deleted and can be restored later if supported by the backend.'}
          </DialogContentText>
          <FormControlLabel
            control={<Checkbox checked={hardDelete} onChange={(event) => setHardDelete(event.target.checked)} />}
            label="Hard delete"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : hardDelete ? 'Delete permanently' : 'Delete user'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default UserManagementTab;
