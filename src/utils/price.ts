const DEFAULT_CURRENCY = 'euro';

const currencyToIso = (currency?: string) => {
  if (!currency) {
    return 'EUR';
  }

  if (currency.toLowerCase() === 'euro') {
    return 'EUR';
  }

  return currency.toUpperCase();
};

const parseNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    if (Number.isFinite(value)) {
      return value;
    }

    return undefined;
  }

  const normalized = value.replace(',', '.').trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
};

const convertPriceFromApi = (value: string | number | null | undefined) => {
  const cents = parseNumber(value);

  if (cents === undefined) {
    return undefined;
  }

  const euros = cents / 100;

  return euros.toFixed(2);
};

const convertPriceToApi = (value: string | number | null | undefined) => {
  const euros = parseNumber(value);

  if (euros === undefined) {
    return undefined;
  }

  return Math.round(euros * 100);
};

const formatCurrencyFromCents = (cents: number, currency?: string) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyToIso(currency ?? DEFAULT_CURRENCY),
  }).format(cents / 100);

const formatCurrencyAmount = (
  amount: string | number | null | undefined,
  currency?: string,
) => {
  const cents = convertPriceToApi(amount);

  if (cents === undefined) {
    return undefined;
  }

  return formatCurrencyFromCents(cents, currency);
};

export {
  convertPriceFromApi,
  convertPriceToApi,
  currencyToIso,
  formatCurrencyAmount,
  formatCurrencyFromCents,
};
