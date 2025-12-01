import { renderHook, act } from '@testing-library/react-hooks';
import getCurrentDiagnostic from '@kitman/modules/src/Medical/shared/services/getCurrentDiagnostic';
import useLoadNonRedoxDiagnostic from '../useLoadNonRedoxDiagnostic';

jest.mock(
  '@kitman/modules/src/Medical/shared/services/getCurrentDiagnostic',
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

describe('useLoadNonRedoxDiagnostic()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches diagnostic and hydrates form when non-redox, open, and ids provided', async () => {
    const mockDiagnostic = { id: 123, diagnostic_type: { id: 1 } };
    getCurrentDiagnostic.mockResolvedValueOnce(mockDiagnostic);

    const setRequestStatus = jest.fn();
    const dispatch = jest.fn();

    const params = {
      isRedoxOrg: false,
      isOpen: true,
      athleteId: 10,
      diagnosticId: 20,
      setRequestStatus,
      dispatch,
    };

    await act(async () => {
      renderHook(() => useLoadNonRedoxDiagnostic(params));
    });

    expect(setRequestStatus).toHaveBeenCalledWith('PENDING');
    expect(getCurrentDiagnostic).toHaveBeenCalledWith(10, 20);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_DIAGNOSTIC_TO_UPDATE',
      diagnosticToUpdate: mockDiagnostic,
    });
    expect(setRequestStatus).toHaveBeenLastCalledWith(null);
  });

  it('does nothing when redox org or panel closed or missing ids', async () => {
    const setRequestStatus = jest.fn();
    const dispatch = jest.fn();

    await act(async () => {
      renderHook(() =>
        useLoadNonRedoxDiagnostic({
          isRedoxOrg: true,
          isOpen: true,
          athleteId: 10,
          diagnosticId: 20,
          setRequestStatus,
          dispatch,
        })
      );
    });
    expect(getCurrentDiagnostic).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(setRequestStatus).not.toHaveBeenCalled();
  });
});
