import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { screen, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import { REDUCER_KEY as LOPS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/api/leagueOperations';

import { useFetchRegistrationsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_details_data';

import { REDUCER_KEY as registrationProfileSlice } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationProfileSlice';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import { MOCK_CURRENT_USER } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import TabRegistration from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
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
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useFetchRegistrationsQuery: jest.fn(),
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
  globalApi: {},
  [LOPS_REDUCER_KEY]: {},
  [registrationProfileSlice]: {
    profile: {
      id: 123,
      squads: [
        {
          id: 3494,
          name: 'U13',
        },
      ],
      organisations: [
        {
          avatar_src: 'kitman_logo_full_bleed.png',
          href: '/registration/organisations?id=116',
          id: 116,
          text: 'KL Galaxy',
        },
      ],
    },
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

const mockRTKQueries = ({ grid, registration }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useFetchRegistrationsQuery.mockReturnValue(registration);
};
const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
};

describe('<TabRegistration/>', () => {
  describe('loading state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.athlete_registration,
        registration: {
          data: {},
          isLoading: true,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the loading state', () => {
      renderWithProviders(defaultStore, <TabRegistration />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });

  describe('success athlete state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.athlete_registration,
        registration: {
          data: response,
          isLoading: false,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the success state', async () => {
      renderWithProviders(defaultStore, <TabRegistration />);
      expect(
        screen.getByRole('row', {
          name: 'League Club Squad Jersey No Position Type Status',
        })
      ).toBeInTheDocument();
    });
  });

  describe('success staff state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.staff_registration,
        registration: {
          data: response,
          isLoading: false,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the success state', async () => {
      renderWithProviders(defaultStore, <TabRegistration />);
      expect(
        screen.getByRole('row', {
          name: 'League Title Status',
        })
      ).toBeInTheDocument();
    });
  });
});
