declare global {
  type PayoutTask = {
    id: number;
    amount: number;
    status: PayoutTaskStatus;
    paymentType: PayoutTaskPaymentType;
    createdAt: string;
    updatedAt: string;
    sellerId: number;
    sellerPseudo: string;
    orderRef: string;
    orderItemId: string;
    orderItemName: string;
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
    status?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };

  type UpdateAdminUserPayload = {
    id: number;
    email?: string;
    pseudo?: string;
    roles?: string[];
    status?: string | null;
  };

  type PayoutTaskPaymentType = 'ORDER' | 'REFUND';

  type PayoutTaskStatus =
    | 'PENDING_PAYMENT_INFORMATION'
    | 'PENDING_TO_PAY'
    | 'PAID'
    | 'ARCHIVED';
}

export {};
