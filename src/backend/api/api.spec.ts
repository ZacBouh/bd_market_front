import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from './api';
import { logout } from '@/hooks/useUser';
import { routerNavigate } from '@/utils/routerNavigate';

vi.mock('@/hooks/useUser', () => ({
  logout: vi.fn(),
}));

type RejectedInterceptor = (error: unknown) => unknown;

const getUnauthorizedInterceptor = () => {
  const handler = (api.interceptors.response as unknown as { handlers: { rejected?: RejectedInterceptor }[] }).handlers.at(-1)
    ?.rejected;

  if (!handler) {
    throw new Error('Unauthorized interceptor is not registered');
  }

  return handler;
};

type RouterNavigateTestAdapter = {
  getIntendedTo: () => string | undefined;
  setIntendedTo: (path: string) => void;
  navigate: (to: string) => void;
  setNavigate: (fn: (to: string, option?: { replace?: boolean }) => void) => void;
  postLoginRedirect: (defaultTo?: string) => void;
};

const routerNavigateForTest = routerNavigate as unknown as RouterNavigateTestAdapter;

describe('api unauthorized interceptor', () => {
  const getIntendedToSpy = vi.spyOn(routerNavigateForTest, 'getIntendedTo');
  const setIntendedToSpy = vi.spyOn(routerNavigateForTest, 'setIntendedTo');
  const navigateSpy = vi.spyOn(routerNavigateForTest, 'navigate');

  beforeEach(() => {
    vi.clearAllMocks();
    routerNavigateForTest.setNavigate(vi.fn());
    window.history.replaceState({}, '', '/shopping-cart?success=true');
  });

  afterEach(() => {
    routerNavigateForTest.postLoginRedirect('/');
    window.sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('stores the intended path and redirects to login on 401 responses', async () => {
    getIntendedToSpy.mockReturnValueOnce(undefined);

    const interceptor = getUnauthorizedInterceptor();

    const error = { response: { status: 401 } };

    await expect(interceptor(error)).rejects.toBe(error);

    expect(window.sessionStorage.getItem('redirectAfterLogin')).toBe('/shopping-cart?success=true');
    expect(setIntendedToSpy).toHaveBeenCalledWith('/shopping-cart?success=true');
    expect(logout).toHaveBeenCalledTimes(1);

    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('keeps the existing intended path when already defined', async () => {
    getIntendedToSpy.mockReturnValueOnce('/protected-area');

    const interceptor = getUnauthorizedInterceptor();

    const error = { response: { status: 401 } };

    await expect(interceptor(error)).rejects.toBe(error);

    expect(setIntendedToSpy).not.toHaveBeenCalled();
    expect(logout).toHaveBeenCalledTimes(1);

    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('passes through non-401 responses without redirecting', async () => {
    getIntendedToSpy.mockReturnValueOnce(undefined);

    const interceptor = getUnauthorizedInterceptor();

    const error = { response: { status: 500 } };

    await expect(interceptor(error)).rejects.toBe(error);

    expect(setIntendedToSpy).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
