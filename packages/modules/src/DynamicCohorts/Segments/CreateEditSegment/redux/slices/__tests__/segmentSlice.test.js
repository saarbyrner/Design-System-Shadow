import { segmentRequest } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import segmentSlice, {
  getInitialState,
  onUpdateForm,
  onUpdateErrorState,
  onReset,
  onUpdateNextId,
  onUpdateQueryParams,
} from '../segmentSlice';

describe('segmentSlice', () => {
  const initialState = getInitialState();

  const formData = segmentRequest;

  const errorStateName = { name: true };
  const errorStateExpression = { expression: true };

  const queryParamState = {
    expression: segmentRequest.expression,
    nextId: 345,
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(segmentSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update the form', () => {
    const action = onUpdateForm(formData);
    const updatedState = segmentSlice.reducer(initialState, action);
    expect(updatedState.formState).toEqual(formData);
  });

  it('updates the error state for name or expression', () => {
    const nameAction = onUpdateErrorState({
      formInputKey: 'name',
      isInvalid: true,
    });
    const updatedState = segmentSlice.reducer(initialState, nameAction);
    expect(updatedState.errorState).toEqual({
      ...initialState.errorState,
      ...errorStateName,
    });

    const expressionAction = onUpdateErrorState({
      formInputKey: 'expression',
      isInvalid: true,
    });
    const updatedStateExpression = segmentSlice.reducer(
      initialState,
      expressionAction
    );
    expect(updatedStateExpression.errorState).toEqual({
      ...initialState.errorState,
      ...errorStateExpression,
    });
  });

  it('should handle onReset', () => {
    const state = {
      formState: {
        ...formData,
      },
      errorState: {
        ...errorStateName,
        ...errorStateExpression,
      },
    };
    const action = onReset();
    const updatedState = segmentSlice.reducer(state, action);

    expect(updatedState).toEqual(initialState);
  });

  it('should update the next id properly', () => {
    const nextId = 12345;
    const action = onUpdateNextId(nextId);
    const updatedState = segmentSlice.reducer(
      { ...initialState, queryParams: queryParamState },
      action
    );
    expect(updatedState.queryParams).toEqual({
      expression: queryParamState.expression,
      nextId,
    });
  });

  it('should update the both params properly', () => {
    const action = onUpdateQueryParams(queryParamState);
    const updatedState = segmentSlice.reducer(initialState, action);
    expect(updatedState.queryParams).toEqual(queryParamState);
  });
});
