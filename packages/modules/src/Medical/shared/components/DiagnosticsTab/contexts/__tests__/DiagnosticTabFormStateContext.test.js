import { renderHook, act } from '@testing-library/react-hooks';
import {
  useDiagnosticTabForm,
  DiagnosticTabFormContextProvider,
} from '../DiagnosticTabFormContext';

const wrapper = ({ children }) => (
  <DiagnosticTabFormContextProvider>
    {children}
  </DiagnosticTabFormContextProvider>
);

describe('<DiagnosticTabFormStateContext/>', () => {
  it('returns correct state on UPDATE_QUEUED_RECONCILED_DIAGNOSTICS', () => {
    const { result } = renderHook(() => useDiagnosticTabForm(), { wrapper });
    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics
    ).toHaveLength(0);

    const queuedReconciledDiagnosticPayload = {
      athleteId: 112234,
      diagnosticId: 3332211,
      reasonId: 215,
      issue: {
        id: 321325,
        type: 'Injury',
      },
    };
    act(() => {
      result.current.updateQueuedReconciledDiagnostics({
        queuedReconciledDiagnostic: queuedReconciledDiagnosticPayload,
        index: 0,
      });
    });

    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics
    ).toHaveLength(1);
    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics[0]
    ).toEqual(queuedReconciledDiagnosticPayload);
  });

  it('returns correct state on updateRowsToReconcile', () => {
    const { result } = renderHook(() => useDiagnosticTabForm(), { wrapper });
    const hook = result.current;

    act(() => {
      hook.updateRowsToReconcile({ diagnosticId: 1 });
    });

    expect(
      result.current.diagnosticTabFormState.rowsToReconcile.length
    ).toEqual(1);
    expect(result.current.diagnosticTabFormState.rowsToReconcile).toEqual([1]);
  });

  it('returns correct state on updatePlayerOpts', () => {
    const { result } = renderHook(() => useDiagnosticTabForm(), { wrapper });
    const hook = result.current;

    const data = {
      id: 123,
      opt: { value: 123, label: 'John Doe' },
    };

    act(() => {
      hook.updatePlayerOpts(data);
    });

    expect(
      Object.keys(result.current.diagnosticTabFormState.playerOpts).length
    ).toEqual(1);
    expect(result.current.diagnosticTabFormState.playerOpts).toEqual({
      123: data.opt,
    });
  });

  it('returns correct state on updatePlayerInjuryIllnessOpts', () => {
    const { result } = renderHook(() => useDiagnosticTabForm(), { wrapper });
    const hook = result.current;

    const data = {
      id: 123,
      opts: [
        { value: 123, label: 'Chronic Injury' },
        { value: 456, label: 'Muscle Injury' },
      ],
    };

    act(() => {
      hook.updatePlayerInjuryIllnessOpts(data);
    });

    expect(
      Object.keys(result.current.diagnosticTabFormState.playerInjuryIllnessOpts)
        .length
    ).toEqual(1);
    expect(
      result.current.diagnosticTabFormState.playerInjuryIllnessOpts
    ).toEqual({
      123: data.opts,
    });
  });

  it('returns correct state on CLEAR_QUEUED_RECONCILED_DIAGNOSTICS', () => {
    const { result } = renderHook(() => useDiagnosticTabForm(), { wrapper });
    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics
    ).toHaveLength(0);

    const queuedReconciledDiagnosticPayload = {
      athleteId: 112234,
      diagnosticId: 3332211,
      reasonId: 215,
      issue: {
        id: 321325,
        type: 'Injury',
      },
    };
    act(() => {
      result.current.updateQueuedReconciledDiagnostics({
        queuedReconciledDiagnostic: queuedReconciledDiagnosticPayload,
        index: 0,
      });
    });

    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics
    ).toHaveLength(1);
    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics[0]
    ).toEqual(queuedReconciledDiagnosticPayload);
    act(() => {
      result.current.clearQueuedReconciledDiagnostics();
    });

    expect(
      result.current.diagnosticTabFormState.queuedReconciledDiagnostics
    ).toHaveLength(0);
  });
});
