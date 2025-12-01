import { getAreCoachingPrinciplesEnabled } from '@kitman/services';
import setCoachingPrinciplesEnabled from '@kitman/common/src/actions/coachingPrinciplesActions';

import areCoachingPrinciplesEnabled from '../coachingPrinciples';

jest.mock('@kitman/services', () => ({
  getAreCoachingPrinciplesEnabled: jest.fn(),
}));

jest.mock('@kitman/common/src/actions/coachingPrinciplesActions', () =>
  jest.fn()
);

describe('areCoachingPrinciplesEnabled thunk', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    setCoachingPrinciplesEnabled.mockClear();
    getAreCoachingPrinciplesEnabled.mockReset();
  });

  it('dispatches true when response.value is true', async () => {
    getAreCoachingPrinciplesEnabled.mockResolvedValue({ value: true });
    setCoachingPrinciplesEnabled.mockReturnValue({
      type: 'SET_CP',
      payload: true,
    });

    await areCoachingPrinciplesEnabled()(dispatch);

    expect(getAreCoachingPrinciplesEnabled).toHaveBeenCalled();
    expect(setCoachingPrinciplesEnabled).toHaveBeenCalledWith(true);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CP', payload: true });
  });

  it('dispatches false when response.value is false', async () => {
    getAreCoachingPrinciplesEnabled.mockResolvedValue({ value: false });
    setCoachingPrinciplesEnabled.mockReturnValue({
      type: 'SET_CP',
      payload: false,
    });

    await areCoachingPrinciplesEnabled()(dispatch);

    expect(setCoachingPrinciplesEnabled).toHaveBeenCalledWith(false);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CP', payload: false });
  });

  it('dispatches false when response is undefined', async () => {
    getAreCoachingPrinciplesEnabled.mockResolvedValue(undefined);
    setCoachingPrinciplesEnabled.mockReturnValue({
      type: 'SET_CP',
      payload: false,
    });

    await areCoachingPrinciplesEnabled()(dispatch);

    expect(setCoachingPrinciplesEnabled).toHaveBeenCalledWith(false);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_CP', payload: false });
  });
});
