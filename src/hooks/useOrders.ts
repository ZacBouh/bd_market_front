import { useAtom } from 'jotai';

import { ordersAtom } from '@/store';

export function useOrders() {
  const [orders, setOrders] = useAtom(ordersAtom);

  return { orders, setOrders };
}
