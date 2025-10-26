export const OrderItemStatus = {
  PENDING_HANDOVER: 'Pending handover',
  BUYER_CONFIRMED: 'Buyer confirmed',
  CANCELED: 'Canceled',
} as const;

export type OrderItemStatus = keyof typeof OrderItemStatus;
