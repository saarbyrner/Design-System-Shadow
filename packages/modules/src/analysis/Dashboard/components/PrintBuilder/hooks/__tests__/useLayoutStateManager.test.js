import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { MOCK_LAYOUTS } from '../../__tests__/mockData';
import useLayoutStateManager from '../useLayoutStateManager';

describe('PrintBuilder|useLayoutStateManager', () => {
  it('calls the updatePreview function', async () => {
    const onUpdateLayout = jest.fn();
    const updatePreview = jest.fn();

    renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    act(() => {
      updatePreview([...MOCK_LAYOUTS[0], { i: '10', x: 4, y: 9, w: 2, h: 1 }]);
    });

    await waitFor(() => {
      expect(updatePreview).toHaveBeenCalled();
    });
  });

  it('calls onUpdateLayout when calling saveChanges', async () => {
    const onUpdateLayout = jest.fn();

    const { result } = renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    act(() => {
      result.current.saveChanges();
    });

    expect(onUpdateLayout).toHaveBeenCalledTimes(1);
    expect(result.current.hasChanges).toBe(false);
  });

  it('resets the layout to the original layout and trim the localPrintLayouts array when calling resetLayout', async () => {
    const onUpdateLayout = jest.fn();
    const updatePreview = jest.fn();
    const { result } = renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    act(() => {
      updatePreview([...MOCK_LAYOUTS[0], { i: '10', x: 4, y: 9, w: 2, h: 1 }]);
    });

    await waitFor(() => {
      expect(updatePreview).toHaveBeenCalled();
    });

    act(() => {
      result.current.resetLayout();
    });

    expect(onUpdateLayout).toHaveBeenCalled();
    expect(
      result.current.localPrintLayouts[result.current.localPrintLayoutIndex]
    ).toStrictEqual(MOCK_LAYOUTS[0]);
    expect(result.current.localPrintLayouts.length).toEqual(1);
    expect(result.current.localPrintLayoutIndex).toEqual(0);
    expect(result.current.hasChanges).toBe(false);
  });

  it('calls onUpdateLayout when calling undoChanges', async () => {
    const onUpdateLayout = jest.fn();
    const { result } = renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    act(() => {
      result.current.undoChanges();
    });

    expect(onUpdateLayout).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdateLayout when calling redoChanges', async () => {
    const onUpdateLayout = jest.fn();

    const { result } = renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    act(() => {
      result.current.redoChanges();
    });

    expect(onUpdateLayout).toHaveBeenCalledTimes(1);
  });

  it('shows changes when they are there', () => {
    const onUpdateLayout = jest.fn();
    const { result } = renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    act(() => {
      result.current.redoChanges();
    });

    expect(result.current.hasUndoChanges).toBe(true);
    expect(result.current.hasChanges).toBe(true);
  });

  it('does not show changes when changes are not there', () => {
    const onUpdateLayout = jest.fn();
    const { result } = renderHook(() =>
      useLayoutStateManager({
        dashboardPrintLayout: MOCK_LAYOUTS[0],
        onUpdateLayout,
      })
    );

    expect(result.current.hasUndoChanges).toBe(false);
    expect(result.current.hasChanges).toBe(false);

    act(() => {
      result.current.redoChanges();
    });

    expect(result.current.hasUndoChanges).toBe(true);
    expect(result.current.hasChanges).toBe(true);

    act(() => {
      result.current.resetLayout();
    });

    expect(result.current.hasUndoChanges).toBe(false);
  });
});
