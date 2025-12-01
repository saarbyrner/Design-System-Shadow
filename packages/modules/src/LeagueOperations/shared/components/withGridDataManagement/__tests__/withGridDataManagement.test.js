import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { transformToAthleteRows } from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteList/utils';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import { DEFAULT_META_PARAMS } from '@kitman/modules/src/LeagueOperations/shared/consts';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';

import {
  MOCK_CURRENT_USER,
  MOCK_ATHLETE_LIST,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import withGridDataManagement from '..';

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

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = {
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.grids': {
    useFetchRegistrationGridsQuery: jest.fn(),
  },
  'LeagueOperations.registration.slice.grids': {
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
};

const mockedSearchQuery = jest.fn();

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeFake(storeArg)}>{children}</Provider>);
};

const mockHOCComponent = (
  mockSearchQueryReturn,
  filterElements = null,
  expandableRow = null,
  expandRowKey = null,
  additionalRequestsState = null
) => {
  return withGridDataManagement({
    useSearchQuery: mockedSearchQuery.mockReturnValue(mockSearchQueryReturn),
    initialFilters: {},
    onTransformData: (rows) =>
      transformToAthleteRows({
        rawRowData: rows,
        currentUserType: 'organisation_admin',
      }),
    title: 'Athletes',
    slots: {
      filters: () => filterElements,
      expandableRow: () => expandableRow,
    },
    expandRowKey,
    additionalRequestsState,
  });
};

const mockGridQuery = (
  returnValue = {
    data: [],
    isLoading: true,
    isFetching: false,
    isError: false,
  }
) => {
  useFetchRegistrationGridsQuery.mockReturnValue(returnValue);
};

const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
};

describe('withGridDataManagement', () => {
  describe('default state', () => {
    let MockedComponent;
    beforeEach(() => {
      mockGridQuery();
      mockSelectors();
      MockedComponent = mockHOCComponent({
        data: {
          data: [],
          meta: DEFAULT_META_PARAMS,
        },
        isLoading: false,
        isFetching: false,
        isError: false,
      });
    });
    it('renders the loading state', () => {
      renderWithProviders(defaultStore, <MockedComponent />);
      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
      expect(
        screen.getByTestId('ListLayout.LoadingFilters')
      ).toBeInTheDocument();
    });
  });
  describe('success state - no data', () => {
    let MockedComponent;
    beforeEach(() => {
      mockGridQuery({
        data: MLS_NEXT_GRIDS.association_admin.athlete,
        isLoading: false,
        isFetching: false,
        isError: false,
      });
      mockSelectors();

      MockedComponent = mockHOCComponent({
        data: {
          data: [],
          meta: DEFAULT_META_PARAMS,
        },
        isLoading: false,
        isFetching: false,
        isError: false,
      });
    });
    it('renders the empty result message', () => {
      renderWithProviders(defaultStore, <MockedComponent />);
      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        'Athletes'
      );
      expect(
        screen.getByText('No results match the search criteria.')
      ).toBeInTheDocument();
    });
  });

  describe('success state - data', () => {
    let MockedComponent;
    beforeEach(() => {
      mockGridQuery({
        data: MLS_NEXT_GRIDS.association_admin.athlete,
        isLoading: false,
        isFetching: false,
        isError: false,
      });
      mockSelectors();
      MockedComponent = mockHOCComponent({
        data: {
          data: [MOCK_ATHLETE_LIST.data[0]],
          meta: MOCK_ATHLETE_LIST.meta,
        },
        isLoading: false,
        isFetching: false,
        isError: false,
      });
    });

    it('renders the grid data', () => {
      renderWithProviders(defaultStore, <MockedComponent />);
      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
        'Athletes'
      );

      expect(
        screen.getByRole('row', {
          name: /Player Club\(s\) ID Number League\(s\) DOB Position Status/,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('row', {
          name: 'Latasha Christian Latasha Christian LA Galaxy LA Galaxy 645235245664daf0f8fccc44 Multiple Jan 11, 2004 Other -',
        })
      ).toBeInTheDocument();
    });
  });

  describe('slots - filters', () => {
    let MockedComponent;
    beforeEach(() => {
      mockGridQuery({
        data: MLS_NEXT_GRIDS.association_admin.athlete,
        isLoading: false,
        isFetching: false,
        isError: false,
      });
      mockSelectors();
      MockedComponent = mockHOCComponent(
        {
          data: {
            data: [MOCK_ATHLETE_LIST.data[0]],
            meta: MOCK_ATHLETE_LIST.meta,
          },
          isLoading: false,
          isFetching: false,
          isError: false,
        },

        <>
          <div>Filter_1</div>
          <div>Filter_2</div>
        </>
      );
    });

    it('renders the filters', () => {
      renderWithProviders(defaultStore, <MockedComponent />);
      expect(screen.getByText('Filter_1')).toBeInTheDocument();
      expect(screen.getByText('Filter_2')).toBeInTheDocument();
    });
  });

  describe('slots - expandableContent', () => {
    let MockedComponent;

    beforeEach(() => {
      mockGridQuery({
        data: MLS_NEXT_GRIDS.association_admin.athlete,
        isLoading: false,
        isFetching: false,
        isError: false,
      });
      mockSelectors();
      MockedComponent = mockHOCComponent(
        {
          data: {
            data: [MOCK_ATHLETE_LIST.data[0]],
            meta: MOCK_ATHLETE_LIST.meta,
          },
          isLoading: false,
          isFetching: false,
          isError: false,
        },
        null,
        <>
          <div>expandableContent</div>
        </>,
        'registrations'
      );
    });

    it('renders the expandableContent', async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultStore, <MockedComponent />);

      const expandButton = screen.getAllByRole('button', {
        name: 'expand row',
      })[0];
      await user.click(expandButton);
      expect(screen.getByText('expandableContent')).toBeInTheDocument();
    });
  });

  describe('additionalRequestsState', () => {
    let MockedComponent;

    beforeEach(() => {
      mockGridQuery({
        data: MLS_NEXT_GRIDS.association_admin.athlete,
        isLoading: false,
        isFetching: false,
        isError: false,
      });
      mockSelectors();
      MockedComponent = mockHOCComponent(
        {
          data: {
            data: [MOCK_ATHLETE_LIST.data[0]],
            meta: MOCK_ATHLETE_LIST.meta,
          },
          isLoading: false,
          isFetching: false,
          isError: false,
        },
        null,
        <>
          <div>expandableContent</div>
        </>,
        null,
        {
          isLoading: true,
        }
      );
    });

    it('renders the loading state when isLoading', async () => {
      renderWithProviders(defaultStore, <MockedComponent />);

      expect(screen.getByTestId('ListLayout.LoadingTitle')).toBeInTheDocument();
    });
  });
});
