import { store, ordersAtom } from '@/store';

import { api } from './api';

const getOrders = (userId: number, callback?: (orders: Order[]) => unknown) => {
  const controller = new AbortController();

  api
    .get<Order[]>('/orders', {
      params: { userid: userId },
      signal: controller.signal,
    })
    .then((response) => {
      store.set(ordersAtom, response.data);
      callback?.(response.data);
    });

  return () => controller.abort();
};

export { getOrders };
