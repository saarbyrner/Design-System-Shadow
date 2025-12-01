import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import useUnsavedChanges from '../useUnsavedChanges';

describe('useUnsavedChanges', () => {
  let renderHookResult;

  const renderUseUnsavedChangesHook = (store) =>
    act(() => {
      renderHookResult = renderHook(() => useUnsavedChanges(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });

  it('inital data', async () => {
    const store = storeFake({
      formStateSlice: {
        form: {},
        originalForm: {},
      },
      formValidationSlice: {},
    });

    await renderUseUnsavedChangesHook(store);

    expect(renderHookResult.current).toHaveProperty('hasUnsavedChanges');
    expect(renderHookResult.current.hasUnsavedChanges).toEqual(false);
    expect(renderHookResult.current).toHaveProperty('showModal');
    expect(renderHookResult.current.showModal).toEqual(false);
    expect(renderHookResult.current).toHaveProperty('setNavigateBack');
    expect(renderHookResult.current).toHaveProperty('handleCloseModal');
    expect(renderHookResult.current).toHaveProperty('handleDiscardChanges');
    expect(renderHookResult.current).toHaveProperty(
      'discardChangesAndHandleBack'
    );
  });

  describe('computed data', () => {
    it('correctly returns hasUnsavedChanges as true when there are unsaved changes', async () => {
      const localStore = storeFake({
        formStateSlice: {
          config: { mode: MODES.EDIT },
          form: {
            2692: 'Juan Nicolas',
            2693: 'Gumy',
            2694: '',
            2696: null,
          },
          originalForm: {
            2692: 'Juan Nicolas',
            2693: '',
            2694: '',
            2696: null,
          },
        },
      });

      await renderUseUnsavedChangesHook(localStore);

      expect(renderHookResult.current).toHaveProperty('hasUnsavedChanges');
      expect(renderHookResult.current.hasUnsavedChanges).toEqual(true);
    });

    it('correctly returns hasUnsavedChanges as false when there are not unsaved changes', async () => {
      const localStore = storeFake({
        formStateSlice: {
          config: { mode: MODES.EDIT },
          form: {
            2692: 'Juan Nicolas',
            2693: 'Gumy',
            2694: '',
            2696: null,
          },
          originalForm: {
            2692: 'Juan Nicolas',
            2693: 'Gumy',
            2694: '',
            2696: null,
          },
        },
      });

      await renderUseUnsavedChangesHook(localStore);

      expect(renderHookResult.current).toHaveProperty('hasUnsavedChanges');
      expect(renderHookResult.current.hasUnsavedChanges).toEqual(false);
    });
  });
});
