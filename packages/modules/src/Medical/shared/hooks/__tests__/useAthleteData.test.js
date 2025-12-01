import { renderHook } from '@testing-library/react-hooks';
import useAthleteData from '../useAthleteData';

describe('useAthleteData', () => {
  it('returns initial data', async () => {
    const {
      result: { current },
    } = renderHook(() => useAthleteData(), {
      wrapper: ({ children }) => <div>{children}</div>,
    });

    expect(current).toHaveProperty('athleteData');
    expect(current).toHaveProperty('fetchAthleteData');
    expect(current.athleteData).toEqual({});
  });
});
