import { describe, expect, it } from 'vitest';

import {
  convertPriceFromApi,
  convertPriceToApi,
  currencyToIso,
  formatCurrencyAmount,
  formatCurrencyFromCents,
} from './price';

describe('currencyToIso', () => {
  it('returns EUR for undefined currency', () => {
    expect(currencyToIso()).toBe('EUR');
  });

  it('normalizes euro currency name to ISO code', () => {
    expect(currencyToIso('Euro')).toBe('EUR');
  });

  it('uppercases unknown currency codes', () => {
    expect(currencyToIso('usd')).toBe('USD');
  });
});

describe('convertPriceFromApi', () => {
  it('converts cents expressed as a number to a fixed euro string', () => {
    expect(convertPriceFromApi(1999)).toBe('19.99');
  });

  it('converts cents expressed as a string to a fixed euro string', () => {
    expect(convertPriceFromApi('250')).toBe('2.50');
  });

  it('returns undefined for unparsable values', () => {
    expect(convertPriceFromApi('not-a-number')).toBeUndefined();
  });
});

describe('convertPriceToApi', () => {
  it('converts euros expressed as a number to rounded cents', () => {
    expect(convertPriceToApi(19.99)).toBe(1999);
  });

  it('handles localized decimal separators when parsing strings', () => {
    expect(convertPriceToApi('12,34')).toBe(1234);
  });

  it('returns undefined for invalid numeric input', () => {
    expect(convertPriceToApi('12.3.4')).toBeUndefined();
  });
});

describe('formatCurrencyFromCents', () => {
  it('formats cents using the default euro currency', () => {
    expect(formatCurrencyFromCents(1234)).toBe('12,34\u00a0€');
  });

  it('formats cents using the provided currency', () => {
    expect(formatCurrencyFromCents(1234, 'usd')).toBe('12,34\u00a0$US');
  });
});

describe('formatCurrencyAmount', () => {
  it('formats euro amounts expressed as strings', () => {
    expect(formatCurrencyAmount('19.99')).toBe('19,99\u00a0€');
  });

  it('returns undefined when the amount cannot be parsed', () => {
    expect(formatCurrencyAmount('abc')).toBeUndefined();
  });
});
