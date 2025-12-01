import modal from '../../reducers/modal';

// Mock the i18n module to control translated strings and avoid external dependencies.
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => {
    // Return a predictable string based on the key for consistent testing
    const translations = {
      Success: 'Success',
      'At least one variable must be selected for each athlete':
        'At least one variable must be selected for each athlete',
      'Got it': 'Got it',
    };
    return translations[key] || key;
  },
}));

describe('Modal reducer', () => {
  const initialState = {
    status: null,
    message: null,
    hideButtonText: null,
  };

  it('returns correct state on SAVE_QUESTIONNAIRE_REQUEST', () => {
    const action = {
      type: 'SAVE_QUESTIONNAIRE_REQUEST',
    };

    const nextState = modal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('returns correct state on SAVE_QUESTIONNAIRE_SUCCESS', () => {
    const action = {
      type: 'SAVE_QUESTIONNAIRE_SUCCESS',
    };

    const nextState = modal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'success',
      message: 'Success',
    });
  });

  it('returns correct state on SAVE_QUESTIONNAIRE_FAILURE', () => {
    const action = {
      type: 'SAVE_QUESTIONNAIRE_FAILURE',
    };

    const nextState = modal(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'error',
    });
  });

  it('returns correct state on SAVE_QUESTIONNAIRE_UNCHECKED_ERROR', () => {
    const action = {
      type: 'SAVE_QUESTIONNAIRE_UNCHECKED_ERROR',
    };

    const nextState = modal(initialState, action);
    expect(nextState).toEqual({
      status: 'validationError',
      message: 'At least one variable must be selected for each athlete',
      hideButtonText: 'Got it',
    });
  });

  it('returns correct state on HIDE_CURRENT_MODAL', () => {
    // Start from a state where values are populated
    const stateBefore = {
      status: 'success',
      message: 'Some message',
      hideButtonText: 'Some text',
    };

    const action = {
      type: 'HIDE_CURRENT_MODAL',
    };

    const nextState = modal(stateBefore, action);
    expect(nextState).toEqual({
      status: null,
      message: null,
      hideButtonText: null,
    });
  });

  it('should return the default state if action type does not match', () => {
    const action = { type: 'UNRELATED_ACTION' };
    const nextState = modal(initialState, action);
    expect(nextState).toEqual(initialState);
  });
});
