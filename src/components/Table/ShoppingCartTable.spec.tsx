import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ShoppingCartTable from './ShoppingCartTable';
import { shoppingCartAtom } from '@/store/shoppingCart';
import { pay, UnavailableCopiesError } from '@/backend/api/payment';
import { notification } from '@/utils/padNotification';

vi.mock('@/backend/api/payment', async () => {
  const actual = await vi.importActual<typeof import('@/backend/api/payment')>('@/backend/api/payment');

  return {
    ...actual,
    pay: vi.fn(),
  };
});

vi.mock('@/utils/padNotification', () => ({
  notification: {
    show: vi.fn(),
    close: vi.fn(),
    setNotificationFunc: vi.fn(),
  },
}));

type MockedFn = ReturnType<typeof vi.fn>;

const mockedPay = pay as unknown as MockedFn;
const mockedNotification = notification as unknown as { show: MockedFn };

const createCopy = (id: number, price: string): CreatedCopy => ({
  id,
  price,
  currency: 'euro',
  copyCondition: 'mint',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  owner: {},
  title: {
    id,
    name: `Copy ${id}`,
    artistsContributions: [
      {
        id,
        artist: { id, fullName: 'Author Name' },
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

describe('ShoppingCartTable', () => {
  const renderWithStore = (copies: CreatedCopy[]) => {
    const store = createStore();
    store.set(shoppingCartAtom, { copies });

    return render(
      <Provider store={store}>
        <ShoppingCartTable />
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes an item and recalculates the total price', async () => {
    const user = userEvent.setup();
    const firstCopy = createCopy(1, '10.00');
    const secondCopy = createCopy(2, '5.00');

    renderWithStore([firstCopy, secondCopy]);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
    expect(screen.getByText('Copy 1')).toBeInTheDocument();
    expect(screen.getByText('Copy 2')).toBeInTheDocument();
    const initialTotalRow = screen.getByText('Total').closest('tr');
    if (!initialTotalRow) {
      throw new Error('Total row not found');
    }
    expect(initialTotalRow).toHaveTextContent('15,00');

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    await user.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Copy 1')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Copy 2')).toBeInTheDocument();
    const totalRow = screen.getByText('Total').closest('tr');
    if (!totalRow) {
      throw new Error('Total row not found after removal');
    }
    expect(totalRow).toHaveTextContent('5,00');
  });

  it('empties the cart and resets the total', async () => {
    const user = userEvent.setup();
    const copies = [createCopy(1, '12.00'), createCopy(2, '8.00')];

    renderWithStore(copies);

    const emptyButton = screen.getByRole('button', { name: 'Empty Cart' });
    await user.click(emptyButton);

    expect(screen.queryByText('Copy 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Copy 2')).not.toBeInTheDocument();
    expect(screen.getByText(/0,00/)).toBeInTheDocument();
  });

  it('calls pay with the generated request id and disables controls while processing', async () => {
    const user = userEvent.setup();
    const copy = createCopy(1, '10.00');

    mockedPay.mockResolvedValueOnce(undefined);
    const uuidSpy = vi
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue('123e4567-e89b-12d3-a456-426614174000');

    renderWithStore([copy]);

    const payButton = screen.getByRole('button', { name: 'Pay' });
    await user.click(payButton);

    await waitFor(() => {
      expect(mockedPay).toHaveBeenCalledWith({ requestId: '123e4567-e89b-12d3-a456-426614174000' });
    });

    const redirectingButton = screen.getByRole('button', { name: 'Redirecting…' });
    expect(redirectingButton).toBeDisabled();

    uuidSpy.mockRestore();
  });

  it('shows the unavailable message and re-enables actions when the API reports conflicts', async () => {
    const user = userEvent.setup();
    const copies = [createCopy(1, '10.00'), createCopy(2, '5.00')];

    mockedPay.mockRejectedValueOnce(new UnavailableCopiesError('Unavailable copies', [copies[0].id]));

    renderWithStore(copies);

    const payButton = screen.getByRole('button', { name: 'Pay' });
    await user.click(payButton);

    await waitFor(() => {
      expect(mockedNotification.show).toHaveBeenCalledWith('Unavailable copies', {
        severity: 'error',
        autoHideDuration: 4000,
      });
    });

    expect(screen.getByRole('button', { name: 'Pay' })).not.toBeDisabled();
    const unavailableRow = within(screen.getAllByRole('row')[1]);
    expect(unavailableRow.getByText('Copy 1')).toBeInTheDocument();
  });
});
