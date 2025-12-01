import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import {
  toastAddType,
  toastRemoveType,
} from '@kitman/modules/src/Toasts/toastsSlice';
import { useShowToasts } from '../useShowToasts';

describe('useShowToasts', () => {
  const store = storeFake({});

  const errorToastId = 'Oops';
  const successToastId = 'Yay';
  let renderHookResult;

  const actAndRenderHook = async () => {
    await act(async () => {
      renderHookResult = renderHook(
        () => useShowToasts({ errorToastId, successToastId }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      ).result;
    });
  };

  const expectToastsToHaveBeenCleared = () => {
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { id: errorToastId },
      type: toastRemoveType,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { id: successToastId },
      type: toastRemoveType,
    });
  };

  it('should dispatch the right actions for showErrorToast', async () => {
    actAndRenderHook();
    const errorTitle = 'Gracefully failed';
    const description = 'Description';
    renderHookResult.current.showErrorToast({
      translatedTitle: errorTitle,
      translatedDescription: description,
    });

    expectToastsToHaveBeenCleared();

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        id: errorToastId,
        status: toastStatusEnumLike.Error,
        title: errorTitle,
        description,
      },
      type: toastAddType,
    });
  });

  it('should dispatch the right actions for showSuccessToast', async () => {
    actAndRenderHook();
    const successTitle = 'Made it through!';
    const description = 'Description';
    renderHookResult.current.showSuccessToast({
      translatedTitle: successTitle,
      translatedDescription: description,
    });

    expectToastsToHaveBeenCleared();

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        id: successToastId,
        status: toastStatusEnumLike.Success,
        title: successTitle,
        description,
      },
      type: toastAddType,
    });
  });
});
