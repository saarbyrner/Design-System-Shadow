import { initialState, REDUCER_KEY } from '../../slices/formAnswerSetsSlice';
import { getFilters } from '../formAnswerSetsSelectors';

const MOCK_STATE = {
  [REDUCER_KEY]: initialState,
};

describe('formAnswerSetsSelectors', () => {
  it('should get the filters', () => {
    expect(getFilters(MOCK_STATE)).toBe(initialState);
  });
});
