import { OrderStatus as OrderStatusLabel } from '@/types/enums/OrderStatus';
import { OrderItemStatus as OrderItemStatusLabel } from '@/types/enums/OrderItemStatus';

const currencyToIso = (currency: string) => {
  if (!currency) {
    return 'EUR';
  }

  if (currency.toLowerCase() === 'euro') {
    return 'EUR';
  }

  return currency.toUpperCase();
};

export const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyToIso(currency),
  }).format(amount / 100);

export const parseDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatDateOnly = (value: string | null) => {
  const date = parseDate(value);

  if (!date) {
    return value ?? '-';
  }

  return date.toLocaleDateString();
};

export const formatDateTime = (value: string | null) => {
  const date = parseDate(value);

  if (!date) {
    return value ?? '-';
  }

  return date.toLocaleString();
};

const humanizeStatus = (status: string) =>
  status
    ? status
        .toLowerCase()
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : '-';

export const formatOrderStatus = (status: string) =>
  OrderStatusLabel[status as keyof typeof OrderStatusLabel] ?? humanizeStatus(status);

export const formatOrderItemStatus = (status: string) =>
  OrderItemStatusLabel[status as keyof typeof OrderItemStatusLabel] ?? humanizeStatus(status);
