import { renderHook, act } from '@testing-library/react-hooks';
import { useBulkActions, BulkActionsContextProvider } from '../BulkActions';

const wrapper = ({ children }) => (
  <BulkActionsContextProvider>{children}</BulkActionsContextProvider>
);

describe('<BulkActionsContext/>', () => {
  const option = { label: 'Athlete 1', value: '1' };
  const diagnostics = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('returns correct state on updateBulkActionsMode', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });

    expect(result.current.bulkActionsState.bulkActionsMode).toEqual(false);

    const payload = {
      status: true,
    };

    act(() => {
      result.current.updateBulkActionsMode(payload);
    });

    expect(result.current.bulkActionsState.bulkActionsMode).toEqual(true);
  });

  it('returns correct state on updateSingleDiagnostic', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });
    const hook = result.current;

    const payload = {
      diagnosticId: 1,
      checked: true,
      diagnosticCount: diagnostics.length,
    };

    act(() => {
      hook.updateSingleDiagnostic(payload);
    });

    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(1);
    expect(result.current.bulkActionsState.bulkActionsDiagnostics).toEqual([1]);

    payload.checked = false;

    act(() => {
      hook.updateSingleDiagnostic(payload);
    });

    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(0);
  });

  it('returns correct state on single diagnostic that selects all updates values accordingly', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });

    const payload = {
      diagnosticId: 1,
      checked: true,
      diagnosticCount: diagnostics.length,
    };

    act(() => {
      result.current.updateSingleDiagnostic(payload);
    });
    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(1);
    expect(result.current.bulkActionsState.bulkActionsDiagnostics).toEqual([1]);
    expect(result.current.bulkActionsState.allDiagnosticsChecked).toEqual(
      false
    );

    payload.diagnosticId = 2;

    act(() => {
      result.current.updateSingleDiagnostic(payload);
    });
    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(2);
    expect(result.current.bulkActionsState.bulkActionsDiagnostics).toEqual([
      1, 2,
    ]);
    expect(result.current.bulkActionsState.allDiagnosticsChecked).toEqual(
      false
    );

    payload.diagnosticId = 3;

    act(() => {
      result.current.updateSingleDiagnostic(payload);
    });
    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(3);
    expect(result.current.bulkActionsState.bulkActionsDiagnostics).toEqual([
      1, 2, 3,
    ]);
    expect(result.current.bulkActionsState.allDiagnosticsChecked).toEqual(true);

    payload.diagnosticId = 2;
    payload.checked = false;

    act(() => {
      result.current.updateSingleDiagnostic(payload);
    });
    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(2);
    expect(result.current.bulkActionsState.bulkActionsDiagnostics).toEqual([
      1, 3,
    ]);
    expect(result.current.bulkActionsState.allDiagnosticsChecked).toEqual(
      false
    );
  });

  it('returns correct state on updateAllDiagnostics', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });

    const payload = {
      checked: true,
      diagnostics,
    };

    act(() => {
      result.current.updateAllDiagnostics(payload);
    });
    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(3);
    expect(result.current.bulkActionsState.bulkActionsDiagnostics).toEqual([
      1, 2, 3,
    ]);
    expect(result.current.bulkActionsState.allDiagnosticsChecked).toEqual(true);

    payload.checked = false;

    act(() => {
      result.current.updateAllDiagnostics(payload);
    });
    expect(
      result.current.bulkActionsState.bulkActionsDiagnostics.length
    ).toEqual(0);
    expect(result.current.bulkActionsState.allDiagnosticsChecked).toEqual(
      false
    );
  });

  it('updates player header properly', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });
    const hook = result.current;

    act(() => {
      hook.updatePlayerHeader({
        player: option,
      });
    });

    expect(result.current.bulkActionsState.playerHeader).toEqual(option);
  });

  it('returns correct state on updateReasonHeader', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });
    const hook = result.current;

    act(() => {
      hook.updateReasonHeader({
        reasonId: 1,
      });
    });

    expect(result.current.bulkActionsState.reasonHeader).toEqual(1);
  });

  it('returns correct state on clearBulkActions', () => {
    const { result } = renderHook(() => useBulkActions(), { wrapper });

    expect(result.current.bulkActionsState.bulkActionsMode).toEqual(false);

    const payload = {
      status: true,
    };

    act(() => {
      result.current.updateBulkActionsMode(payload);
    });

    expect(result.current.bulkActionsState.bulkActionsMode).toEqual(true);

    act(() => {
      result.current.clearBulkActions();
    });

    expect(result.current.bulkActionsState.bulkActionsMode).toEqual(false);
  });
});
