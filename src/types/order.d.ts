interface OrderSeller {
  id: number;
  pseudo: string;
}

interface OrderCopySummary {
  id: number;
  name: string;
}

interface OrderItem {
  id: number;
  copy: OrderCopySummary;
  seller: OrderSeller;
  price: number;
  currency: string;
  status: keyof typeof import('./enums/OrderItemStatus').OrderItemStatus;
  buyerConfirmedAt: string | null;
}

interface OrderPayoutTask {
  id: number;
  orderRef: string;
  seller: OrderSeller;
  amount: number;
  currency: string;
  status: string;
  paymentInformation: Record<string, unknown>;
  createdAt: string;
  paidAt: string | null;
}

interface Order {
  orderRef: string;
  status: keyof typeof import('./enums/OrderStatus').OrderStatus;
  amountTotal: number;
  currency: string;
  items: OrderItem[];
  payoutTasks: OrderPayoutTask[];
  createdAt: string;
  updatedAt: string;
}
