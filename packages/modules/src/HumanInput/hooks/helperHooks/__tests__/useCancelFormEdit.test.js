import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY as FORM_STATE_SLICE_REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { useCancelFormEdit } from '../useCancelFormEdit';

jest.mock('@kitman/modules/src/HumanInput/hooks/useUnsavedChanges');

describe('useCancelFormEdit', () => {
  const store = storeFake({});
  let renderHookResult;

  const actAndRenderHook = async (mode) => {
    await act(async () => {
      renderHookResult = renderHook(() => useCancelFormEdit(mode), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });
  };

  it('should dispatch the right actions with unsaved changes', async () => {
    useUnsavedChanges.mockReturnValue({ hasUnsavedChanges: true });
    actAndRenderHook(MODES.EDIT);
    renderHookResult.current.onCancelFormEdit();

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { showUnsavedChangesModal: true },
      type: `${FORM_STATE_SLICE_REDUCER_KEY}/onUpdateShowUnsavedChangesModal`,
    });
  });

  it('should dispatch the right actions without unsaved changes - non create mode', async () => {
    useUnsavedChanges.mockReturnValue({ hasUnsavedChanges: false });
    actAndRenderHook(MODES.EDIT);
    renderHookResult.current.onCancelFormEdit();

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { mode: MODES.VIEW },
      type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetMode`,
    });
  });

  it('should dispatch the right actions without unsaved changes - create mode', async () => {
    useUnsavedChanges.mockReturnValue({ hasUnsavedChanges: false });
    actAndRenderHook(MODES.CREATE);
    renderHookResult.current.onCancelFormEdit();

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { mode: MODES.CREATE },
      type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetMode`,
    });
  });
});
