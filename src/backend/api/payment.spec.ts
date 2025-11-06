import { AxiosError, type AxiosResponse } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pay, UnavailableCopiesError } from './payment';
import { api } from './api';
import { store } from '@/store';
import { shoppingCartAtom } from '@/store/shoppingCart';

vi.mock('./api', async () => {
  const actual = await vi.importActual<typeof import('./api')>('./api');

  return {
    ...actual,
    api: {
      ...actual.api,
      post: vi.fn(),
    },
  };
});

const mockedApi = api as typeof api & { post: ReturnType<typeof vi.fn> };

const createCopy = (id: number): CreatedCopy => ({
  id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  owner: {},
  price: '10.00',
  currency: 'euro',
  copyCondition: 'mint',
  title: {
    id,
    name: `Copy ${id}`,
    artistsContributions: [
      {
        id,
        artist: { id, fullName: 'Artist', name: 'Artist' },
        skills: [],
        title: id,
      } as CreatedContribution,
    ],
  } as Partial<CreatedTitle>,
  coverImage: {
    id,
    fileName: `cover-${id}.jpg`,
    originalFileName: null,
    fileMimeType: null,
    fileSize: 0,
    imageDimensions: null,
    imageName: `cover-${id}`,
    url: `/images/${id}.jpg`,
    updatedAt: new Date().toISOString(),
  },
});

const restoreLocation = () => {
  const { protocol, host } = window.location;
  window.history.replaceState({}, '', `${protocol}//${host}/`);
};

describe('pay', () => {
  beforeEach(() => {
    store.set(shoppingCartAtom, { copies: [] });
    mockedApi.post.mockReset();
    restoreLocation();
  });

  it('throws when the shopping cart is empty', async () => {
    await expect(pay({ requestId: 'req-1' })).rejects.toThrow('Shopping cart contains no Copy');
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('sends the checkout request and forwards the user on success', async () => {
    const copy = createCopy(1);
    store.set(shoppingCartAtom, { copies: [copy] });

    const originalLocation = window.location;
    const assignSpy = vi.fn();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        assign: assignSpy,
      } as Location,
    });

    mockedApi.post.mockResolvedValue({ data: { url: 'https://checkout.example.com' } } as AxiosResponse<{ url: string }>);

    try {
      await pay({ requestId: 'checkout-123' });

      expect(mockedApi.post).toHaveBeenCalledWith('/payment', {
        copies: [copy.id],
        requestId: 'checkout-123',
      });
      expect(assignSpy).toHaveBeenCalledWith('https://checkout.example.com');
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
      });
    }
  });

  it('wraps 409 conflicts into an UnavailableCopiesError', async () => {
    const copy = createCopy(42);
    store.set(shoppingCartAtom, { copies: [copy] });

    const axiosError = new AxiosError(
      'Conflict',
      undefined,
      undefined,
      undefined,
      {
        status: 409,
        data: { error: 'Some items are no longer available', unavailableCopyIds: [copy.id] },
      } as AxiosResponse<unknown>,
    );

    mockedApi.post.mockRejectedValueOnce(axiosError);

    await expect(pay({ requestId: 'req-409' })).rejects.toMatchObject({
      message: 'Some items are no longer available',
      copyIds: [copy.id],
    });
  });

  it('falls back to the default message when the API omits details', async () => {
    const copy = createCopy(7);
    store.set(shoppingCartAtom, { copies: [copy] });

    const axiosError = new AxiosError(
      'Conflict',
      undefined,
      undefined,
      undefined,
      {
        status: 409,
        data: {},
      } as AxiosResponse<unknown>,
    );

    mockedApi.post.mockRejectedValueOnce(axiosError);

    await expect(pay({ requestId: 'req-409' })).rejects.toEqual(
      new UnavailableCopiesError('Some items are no longer available for sale.', []),
    );
  });
});
