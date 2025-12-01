import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFixtureToast, { toastIds } from '../useFixtureToast';

describe('useFixtureToast', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(React, 'useReducer').mockImplementation(() => [[], dispatch]);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('onCloseToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.onCloseToast('toast_name');

    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_TOAST_BY_ID',
      id: 'toast_name',
    });
  });

  it('showLineUpTemplateSavedToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showLineUpTemplateSavedToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.saved_line_up_template,
        title: 'Line-up template saved',
        status: 'SUCCESS',
      },
    });
  });

  it('showLineUpTemplateSavedErrorToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showLineUpTemplateSavedErrorToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.saved_line_up_template,
        title: 'Save line-up template',
        description: 'Something went wrong while saving your line-up template',
        status: 'ERROR',
      },
    });
    jest.advanceTimersByTime(3000);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastIds.saved_line_up_template,
    });
  });

  it('showEmptyLineUpToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showEmptyLineUpToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.line_up_not_found,
        title: 'No line up to copy from the last period',
        status: 'INFO',
      },
    });
  });

  it('showCopyLastLineUpSuccessToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showCopyLastLineUpSuccessToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_line_up_applied,
        title: 'Last line up copied with success.',
        status: 'SUCCESS',
      },
    });
  });

  it('showGenericErrorToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showGenericErrorToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.generic_error,
        title: 'Something went wrong, try again!',
        status: 'ERROR',
      },
    });
    jest.advanceTimersByTime(3000);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastIds.generic_error,
    });
  });

  it('showLastFixtureNotFoundToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showLastFixtureNotFoundToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_fixture_not_found,
        title: 'Last fixture line up is empty.',
        status: 'INFO',
      },
    });
    jest.advanceTimersByTime(3000);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastIds.last_fixture_not_found,
    });
  });

  it('showCopyLastGameLineUpSuccessToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showCopyLastGameLineUpSuccessToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_line_up_applied,
        title: 'Last fixture line up copied with success.',
        status: 'SUCCESS',
      },
    });
  });

  it('showLastGameNotFoundToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showLastGameNotFoundToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_game_not_found,
        title: 'Last game not found.',
        status: 'INFO',
      },
    });
  });

  it('showUnsupportedConfigErrorToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showUnsupportedConfigErrorToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.game_format_or_formation_not_supported,
        title: 'Line up game format and/or formation is not supported',
        status: 'ERROR',
      },
    });
    jest.advanceTimersByTime(3000);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_TOAST_BY_ID',
      id: toastIds.game_format_or_formation_not_supported,
    });
  });

  it('showAppliedSavedLineUpSuccessToast', () => {
    const { result } = renderHook(() => useFixtureToast());
    result.current.showAppliedSavedLineUpSuccessToast();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'CREATE_TOAST',
      toast: {
        id: toastIds.last_line_up_applied,
        title: 'Line up applied with success.',
        status: 'SUCCESS',
      },
    });
  });
});
