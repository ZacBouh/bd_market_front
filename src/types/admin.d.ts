declare global {
  type PayoutTaskVendor = {
    id: number;
    name: string;
    email?: string | null;
  };

  type PayoutTask = {
    id: number;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    vendorId?: number;
    vendor?: PayoutTaskVendor | null;
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
    googleSub?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };

  type UpdateAdminUserPayload = {
    id: number;
    email?: string;
    pseudo?: string;
    roles?: string[];
    status?: string | null;
    googleSub?: string | null;
  };
}

export {};
