import { renderHook, act } from '@testing-library/react-hooks';

import useDiagnosticForm, { initialFormState } from '../useDiagnosticLinkForm';

describe('useDiagnosticForm', () => {
  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState } = result.current;

    expect(formState.athleteId).toBeNull();

    act(() => {
      result.current.dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 92782,
      });
    });
    expect(result.current.formState.athleteId).toBe(92782);
  });

  it('returns correct state on SET_DIAGNOSTIC_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState } = result.current;

    expect(formState.diagnosticId).toBeNull();

    act(() => {
      result.current.dispatch({
        type: 'SET_DIAGNOSTIC_ID',
        diagnosticId: 61388,
      });
    });

    expect(result.current.formState.diagnosticId).toBe(61388);
  });

  it('returns correct state on UPDATE_QUEUED_LINKS', () => {
    const links = [
      {
        id: 0,
        title: 'this is a fake link title',
        uri: 'www.thisisafakelink.com',
      },
    ];

    const { result } = renderHook(() => useDiagnosticForm());
    const { formState } = result.current;

    expect(formState.queuedLinks).toEqual([]);

    act(() => {
      result.current.dispatch({
        id: 0,
        type: 'UPDATE_QUEUED_LINKS',
        queuedLinks: links,
      });
    });
    expect(result.current.formState.queuedLinks).toEqual(links);
  });

  it('returns correct state on SET_LINK_TITLE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState } = result.current;

    expect(formState.linkTitle).toEqual('');

    act(() => {
      result.current.dispatch({
        type: 'SET_LINK_TITLE',
        linkTitle: 'this is a fake link title',
      });
    });
    expect(result.current.formState.linkTitle).toEqual(
      'this is a fake link title'
    );
  });

  it('returns correct state on SET_LINK_URI', () => {
    const { result } = renderHook(() => useDiagnosticForm());

    act(() => {
      result.current.dispatch({
        id: 0,
        type: 'SET_LINK_URI',
        linkUri: 'www.thisisafakelink.com',
      });
    });

    expect(result.current.formState.linkUri).toEqual('www.thisisafakelink.com');
  });

  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState } = result.current;

    expect(formState).toEqual(initialFormState);

    act(() => {
      result.current.dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(result.current.formState).toEqual(initialFormState);
  });
});
