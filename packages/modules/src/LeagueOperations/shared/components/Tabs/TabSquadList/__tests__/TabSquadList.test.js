import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { screen, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import { useSearchSquadListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import {
  MOCK_SQUAD_LIST,
  MOCK_CURRENT_USER,
  DEFAULT_STORE,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import TabSquadList from '..';

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
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useSearchSquadListQuery: jest.fn(),
  })
);

setI18n(i18n);

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

const mockRTKQueries = ({ grid, squads }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useSearchSquadListQuery.mockReturnValue(squads);
};
const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
};

describe('<TabSquadList/>', () => {
  describe('loading state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.organisation,
        squads: {
          data: {},
          isLoading: true,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the loading state', () => {
      renderWithProviders(DEFAULT_STORE, <TabSquadList />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });
  describe('success state', () => {
    beforeEach(() => {
      mockRTKQueries({
        grid: MLS_NEXT_GRIDS.association_admin.squad,
        squads: {
          data: MOCK_SQUAD_LIST,
          isLoading: false,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the success state', async () => {
      renderWithProviders(DEFAULT_STORE, <TabSquadList />);
      expect(
        screen.getByRole('heading', { name: 'Teams' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(4);
      expect(
        screen.getByRole('row', {
          name: 'Team Total Staff Total Players',
        })
      ).toBeInTheDocument();
    });
  });
});
