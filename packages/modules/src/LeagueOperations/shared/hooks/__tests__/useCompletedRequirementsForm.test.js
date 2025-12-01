import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useFetchCompletedRequirementsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi';

import {
  getRequirementById,
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import useCompletedRequirementsForm from '../useCompletedRequirementsForm';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi'
    ),
    useFetchCompletedRequirementsQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getUserId: jest.fn(),
    getRequirementById: jest.fn(),
    getRequirementId: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  'LeagueOperations.registration.api.requirement.section': {
    useFetchCompletedRequirementsQuery: jest.fn(),
  },
  'LeagueOperations.registration.slice.requirements': {
    requirementId: null,
    userId: null,
    profile: null,
    panel: {
      isOpen: false,
    },
  },
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

const mockSelectors = () => {
  getUserId.mockReturnValue(1);
  getRequirementById.mockReturnValue(() => 1);
  getRequirementId.mockReturnValue(1);
};

describe('useCompletedRequirementsForm', () => {
  describe('initial state', () => {
    beforeEach(() => {
      mockSelectors();
      useFetchCompletedRequirementsQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: {},
      });
    });
    it('has initial state', () => {
      const result = renderHook(() => useCompletedRequirementsForm(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });
});
