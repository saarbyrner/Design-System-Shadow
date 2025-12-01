import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import useLoadOrderProvidersEffect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useLoadOrderProvidersEffect';

const mockGetOrderProviders = jest.fn();
jest.mock('@kitman/services', () => ({
  getOrderProviders: (...args) => mockGetOrderProviders(...args),
}));

describe('useLoadOrderProvidersEffect', () => {
  beforeEach(() => {
    mockGetOrderProviders.mockReset();
  });

  it('loads providers and seeds diagnostic to update while editing', async () => {
    const dispatch = jest.fn();
    const setOrderProviders = jest.fn();
    const setRequestStatus = jest.fn();
    mockGetOrderProviders.mockResolvedValueOnce({ providers: [1, 2] });

    renderHook(() =>
      useLoadOrderProvidersEffect({
        isEditing: true,
        diagnosticToUpdate: { location: { id: 5 } },
        dispatch,
        setOrderProviders,
        setRequestStatus,
        isOpen: true,
      })
    );

    // allow microtasks to resolve
    await Promise.resolve();
    expect(setOrderProviders).toHaveBeenCalledWith({ providers: [1, 2] });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_DIAGNOSTIC_TO_UPDATE',
      diagnosticToUpdate: { location: { id: 5 } },
    });
    expect(setRequestStatus).not.toHaveBeenCalledWith('FAILURE');
  });

  it('sets FAILURE when loading providers fails', async () => {
    const dispatch = jest.fn();
    const setOrderProviders = jest.fn();
    const setRequestStatus = jest.fn();
    mockGetOrderProviders.mockRejectedValueOnce(new Error('boom'));

    renderHook(() =>
      useLoadOrderProvidersEffect({
        isEditing: true,
        diagnosticToUpdate: { location: { id: 5 } },
        dispatch,
        setOrderProviders,
        setRequestStatus,
        isOpen: true,
      })
    );

    await waitFor(() =>
      expect(setRequestStatus).toHaveBeenCalledWith('FAILURE')
    );
  });
});
