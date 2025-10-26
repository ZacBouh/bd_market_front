import type { PayoutTaskStatus } from '@/types/enums/PayoutTaskStatus';

import { api } from './api';

const getPayoutTasks = async (
  status?: PayoutTaskStatus,
  signal?: AbortSignal,
) => {
  const response = await api.get<PayoutTask[]>('/payment/payout-tasks', {
    params: status ? { status } : undefined,
    signal,
  });

  return response.data;
};

const updatePayoutTask = (id: number, payload: UpdatePayoutTaskPayload) =>
  api.patch<PayoutTask>(`/payment/payout-tasks/${id}`, payload);

export { getPayoutTasks, updatePayoutTask };
