import { api } from './api';

const getAdminUsers = async (signal?: AbortSignal) => {
  const response = await api.get<AdminUser[]>('/users', { signal });
  return response.data;
};

const updateAdminUser = (payload: UpdateAdminUserPayload) =>
  api.post<AdminUser>('/users/update', payload);

const deleteAdminUser = (id: number, hardDelete?: boolean) =>
  api.delete<void>('/users', { data: { id, hardDelete } });

export { deleteAdminUser, getAdminUsers, updateAdminUser };
