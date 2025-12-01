import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { screen, render } from '@testing-library/react';

import { Provider } from 'react-redux';

import {
  REDUCER_KEY as SECTIONS_KEY,
  useFetchRequirementSectionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';

import {
  REDUCER_KEY as GRID_REDUCER_KEY,
  useFetchRegistrationGridsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import {
  MOCK_SECTION_LIST,
  MOCK_CURRENT_USER,
  MOCK_REGISTRATION_PROFILE,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { REDUCER_KEY as REQUIREMENTS_SLICE } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import {
  REDUCER_KEY as REQUIREMENT_SECTION,
  useFetchCompletedRequirementsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi';
import { getRequirementById } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import TabRequirements from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
    getRegistrationPermissions: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi'
    ),
    useFetchRequirementSectionsQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi'
    ),
    useFetchCompletedRequirementsQuery: jest.fn(),
  })
);

setI18n(i18n);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
  [GRID_REDUCER_KEY]: {
    useFetchRegistrationGridsQuery: jest.fn(),
  },
  [SECTIONS_KEY]: {
    useFetchRequirementSectionsQuery: jest.fn(),
  },
  [REQUIREMENTS_SLICE]: {
    requirementId: '1',
  },
  [REQUIREMENT_SECTION]: {
    useFetchCompletedRequirementsQuery: jest.fn(),
  },
  'LeagueOperations.registration.slice.grids': {
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
});

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

const mockRTKQueries = ({ grid, sections, reqs }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useFetchRequirementSectionsQuery.mockReturnValue(sections);
  useFetchCompletedRequirementsQuery.mockReturnValue(reqs);
};
const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
  getRequirementById.mockReturnValue(
    () => MOCK_REGISTRATION_PROFILE.registrations[0]
  );
};

describe('<TabRequirements/>', () => {
  describe('loading state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.athlete.registration,
        sections: {
          data: {},
          isLoading: true,
          isFetching: false,
          isError: false,
        },
        reqs: {
          data: {},
          isLoading: true,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the loading state', () => {
      renderWithProviders(defaultStore, <TabRequirements />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });
  describe('success state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.athlete.registration,

        sections: {
          data: MOCK_SECTION_LIST,
          isLoading: false,
          isFetching: false,
          isError: false,
        },
        reqs: {
          data: {},
          isLoading: false,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the success state', async () => {
      renderWithProviders(defaultStore, <TabRequirements />);
      expect(
        screen.getByRole('heading', { name: 'Requirements' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByRole('row')).toBeInTheDocument();
    });
  });
});
