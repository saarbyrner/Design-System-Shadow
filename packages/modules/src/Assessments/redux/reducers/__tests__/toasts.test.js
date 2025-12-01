import toastsReducer from '../toasts';
import {
  updateTemplatePending,
  updateTemplateSuccess,
  updateTemplateFailure,
  removeToast,
} from '../../actions';

describe('toasts reducer', () => {
  const initialState = [
    {
      text: `Update "Template 1"`,
      status: 'PROGRESS',
      id: 1,
    },
  ];

  it('returns correct state on UPDATE_TEMPLATE_PENDING', () => {
    const action = updateTemplatePending({
      id: 2,
      name: 'Template 2',
    });

    const nextState = toastsReducer(initialState, action);

    expect(nextState).toEqual([
      ...initialState,
      {
        text: `Update "Template 2"`,
        status: 'PROGRESS',
        id: 2,
      },
    ]);
  });

  it('returns correct state on UPDATE_TEMPLATE_SUCCESS', () => {
    const action = updateTemplateSuccess(1);

    const nextState = toastsReducer(initialState, action);

    expect(nextState).toEqual([
      {
        text: `Update "Template 1"`,
        status: 'SUCCESS',
        id: 1,
      },
    ]);
  });

  it('returns correct state on UPDATE_TEMPLATE_FAILURE', () => {
    const action = updateTemplateFailure(1);

    const nextState = toastsReducer(initialState, action);

    expect(nextState).toEqual([
      {
        text: `Update "Template 1"`,
        status: 'ERROR',
        id: 1,
      },
    ]);
  });

  it('returns correct state on REMOVE_TOAST', () => {
    const action = removeToast(1);

    const nextState = toastsReducer(initialState, action);

    expect(nextState).toEqual([]);
  });
});
