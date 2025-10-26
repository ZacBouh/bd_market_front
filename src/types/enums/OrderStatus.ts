export const OrderStatus = {
  CREATED: 'Created',
  PENDING_PAYMENT: 'Pending Payment',
  PAID_PENDING_HANDOVER: 'Paid — Pending handover',
  PAID_HANDOVER_PENDING_CONFIRMATION: 'Paid — Pending confirmation',
  PAID_HANDOVER_CONFIRMED: 'Paid — Handover confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
} as const;

export type OrderStatus = keyof typeof OrderStatus;
