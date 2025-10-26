declare global {
  type PayoutTaskSeller = {
    id: number;
    pseudo: string;
  };

  type PayoutTask = {
    id: number;
    amount: number;
    status: PayoutTaskStatus;
    paymentType: PayoutTaskPaymentType;
    createdAt: string;
    updatedAt: string;
    sellerId?: number | null;
    seller?: PayoutTaskSeller | null;
    orderRef?: string | null;
    orderItemId?: string | null;
    orderItemName?: string | null;
    metadata?: Record<string, unknown> | null;
  };

  type UpdatePayoutTaskPayload = {
    status: string;
  };

  type AdminUser = {
    id: number;
    pseudo: string;
    email: string;
    roles: string[];
    emailVerified?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
  };

  type UpdateAdminUserPayload = {
    id: number;
    email?: string;
    pseudo?: string;
    roles?: string[];
  };

  type PayoutTaskPaymentType = 'ORDER' | 'REFUND';

  type PayoutTaskStatus =
    | 'PENDING_PAYMENT_INFORMATION'
    | 'PENDING_TO_PAY'
    | 'PAID'
    | 'ARCHIVED';
}

export {};
