import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { useGetSeasonMarkerRangeQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI';
import { DISCIPLINE_AREA_FEATURE_FLAG } from '@kitman/modules/src/LeagueOperations/DisciplineApp/consts';

import useDiscipline from '../useDiscipline';

jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {},
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

const redirect = jest.fn();

describe('useDiscipline', () => {
  beforeEach(() => {
    useLocationAssign.mockReturnValue(redirect);
  });
  afterEach(() => {
    window.featureFlags = {};
  });
  describe('initial state', () => {
    beforeEach(() => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
      useGetSeasonMarkerRangeQuery.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
    });
    it('has initial state', () => {
      const { result } = renderHook(() => useDiscipline(), {
        wrapper,
      });
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });

  describe('incorrect or invalid permissions', () => {
    beforeEach(() => {
      window.featureFlags = {
        [DISCIPLINE_AREA_FEATURE_FLAG]: false,
      };
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
    });
    it('redirects with incorrect permissions', () => {
      renderHook(() => useDiscipline(), {
        wrapper,
      });
      expect(redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('[isLoading]', () => {
    beforeEach(() => {
      window.featureFlags = {
        [DISCIPLINE_AREA_FEATURE_FLAG]: true,
      };
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useGetSeasonMarkerRangeQuery.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
    });
    it('returns the correct isLoading state', () => {
      const { result } = renderHook(() => useDiscipline(), {
        wrapper,
      });
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });

  describe('[isError]', () => {
    beforeEach(() => {
      window.featureFlags = {
        [DISCIPLINE_AREA_FEATURE_FLAG]: true,
      };
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: true,
        isSuccess: false,
      });
      useGetSeasonMarkerRangeQuery.mockReturnValue({
        isLoading: false,
        hasFailed: true,
        isSuccess: false,
      });
    });
    it('returns the correct isError state', () => {
      const { result } = renderHook(() => useDiscipline(), {
        wrapper,
      });
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(true);
    });
  });

  describe('[isSuccess]', () => {
    beforeEach(() => {
      window.featureFlags = {
        [DISCIPLINE_AREA_FEATURE_FLAG]: true,
      };
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: true,
      });
      useGetSeasonMarkerRangeQuery.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: true,
      });
    });
    it('returns the correct isSuccess state', () => {
      const { result } = renderHook(() => useDiscipline(), {
        wrapper,
      });
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isError).toEqual(false);
    });
  });
});
