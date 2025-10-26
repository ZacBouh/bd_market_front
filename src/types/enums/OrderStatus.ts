export const OrderStatus = {
  PENDING: 'Pending',
  PAID_PENDING_HANDOVER: 'Paid — Pending handover',
  IN_PROGRESS_PARTIAL: 'In progress — Partial handover',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
  REFUNDED: 'Refunded',
} as const;

export type OrderStatus = keyof typeof OrderStatus;
