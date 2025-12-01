import appStatusReducer from '../appStatus';
import {
  saveAssessmentSuccess,
  deleteAssessmentSuccess,
  deleteAssessmentItemSuccess,
  saveAssessmentItemSuccess,
  saveTemplateSuccess,
  saveAssessmentItemsOrderSuccess,
  requestPending,
  requestFailure,
  saveAssessmentAthletesSuccess,
  saveAssessmentItemCommentsSuccess,
  saveMetricScoresSuccess,
} from '../../actions';

describe('appStatus reducer', () => {
  const initialState = {
    status: null,
  };

  it('returns correct state on SAVE_ASSESSMENT_SUCCESS', () => {
    const action = saveAssessmentSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on DELETE_ASSESSMENT_SUCCESS', () => {
    const action = deleteAssessmentSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on DELETE_ASSESSMENT_ITEM_SUCCESS', () => {
    const action = deleteAssessmentItemSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEM_SUCCESS', () => {
    const action = saveAssessmentItemSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on SAVE_TEMPLATE_SUCCESS', () => {
    const action = saveTemplateSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS', () => {
    const action = saveAssessmentItemsOrderSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on REQUEST_PENDING', () => {
    const action = requestPending();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('returns correct state on REQUEST_FAILURE', () => {
    const action = requestFailure();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'error',
    });
  });

  it('returns correct state on SAVE_ASSESSMENT_ATHLETES_SUCCESS', () => {
    const action = saveAssessmentAthletesSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEM_COMMENTS_SUCCESS', () => {
    const action = saveAssessmentItemCommentsSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });

  it('returns correct state on SAVE_METRIC_SCORES_SUCCESS', () => {
    const action = saveMetricScoresSuccess();
    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
    });
  });
});
