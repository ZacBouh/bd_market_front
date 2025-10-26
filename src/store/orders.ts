import { atomWithStorage } from 'jotai/utils';

const ordersAtom = atomWithStorage<Order[]>('orders', []);

export { ordersAtom };
