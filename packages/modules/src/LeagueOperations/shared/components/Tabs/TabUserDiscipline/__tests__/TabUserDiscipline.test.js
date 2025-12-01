import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { screen, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import { useSearchDisciplineUserListQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';

import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import {
  MOCK_ATHLETE_DISCIPLINE_GRID_QUERY,
  MOCK_CURRENT_USER,
  DEFAULT_STORE,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import TabUserDiscipline from '..';

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
  '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi'
    ),
    useSearchDisciplineUserListQuery: jest.fn(),
  })
);

setI18n(i18n);

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

const mockRTKQueries = ({ grid, queryResponse }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useSearchDisciplineUserListQuery.mockReturnValue(queryResponse);
};
const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
};

describe('<TabUserDiscipline/>', () => {
  describe('loading state', () => {
    beforeEach(() => {
      mockRTKQueries({
        // TODO: When the correct columns are defined, this will
        // need to be updated.
        grid: MLS_NEXT_GRIDS.association_admin.athlete_discipline,
        queryResponse: {
          data: [],
          isLoading: true,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the loading state', () => {
      renderWithProviders(DEFAULT_STORE, <TabUserDiscipline />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });
  describe('success state', () => {
    beforeEach(() => {
      mockRTKQueries({
        // TODO: When the correct columns are defined, this will
        // need to be updated.
        grid: MLS_NEXT_GRIDS.association_admin.athlete_discipline,
        queryResponse: {
          data: MOCK_ATHLETE_DISCIPLINE_GRID_QUERY,
          isLoading: false,
          isFetching: false,
          isError: false,
        },
      });
      mockSelectors();
    });
    it('renders the success state', async () => {
      renderWithProviders(DEFAULT_STORE, <TabUserDiscipline />);
      expect(
        screen.getByRole('textbox', { name: 'Search' })
      ).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(6);
      // TODO: second suspended will be removed when league-ops-discipline-area-v2 FF is removed
      expect(
        screen.getByRole('row', {
          name: 'Player Club Team Jersey No Red cards Yellow cards Total suspensions Suspended Suspended Discipline status',
        })
      ).toBeInTheDocument();
    });
  });
});
