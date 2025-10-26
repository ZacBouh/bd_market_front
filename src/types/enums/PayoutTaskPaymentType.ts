export const PAYOUT_TASK_PAYMENT_TYPES = {
  ORDER: 'ORDER',
  REFUND: 'REFUND',
} as const;

export type PayoutTaskPaymentType =
  (typeof PAYOUT_TASK_PAYMENT_TYPES)[keyof typeof PAYOUT_TASK_PAYMENT_TYPES];
