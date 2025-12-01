import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import useManageAthletesGrid from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/hooks/useManageAthletesGrid';
import ManageAthletesTab from '../ManageAthletesTab';
import { getMuiCols } from '../ManageAthletesTab/utils/helpers';

jest.mock('@kitman/common/src/hooks/useLocationAssign', () => jest.fn());
jest.mock(
  '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/hooks/useManageAthletesGrid'
);

const mockUseManageAthletesGrid = jest.mocked(useManageAthletesGrid);
const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const defaultProps = {
  careerStatus: 'active',
  activeStatus: 'active',
  isAssociationAdmin: false,
  t: i18nextTranslateStub(),
};

const defaultState = {
  globalApi: {
    queries: {
      'getPermissions(undefined)': {
        data: {
          userMovement: {
            player: {
              medicalTrial: false,
              trade: true,
            },
          },
        },
      },
    },
  },
  humanInputSlice: {
    exportSidePanel: {
      isOpen: false,
      form: {
        ids: [2, 3],
        filename: 'export',
        fields: [{ object: 'athlete', field: 'first_name' }],
      },
    },
  },
  [REDUCER_KEY]: { ...initialState },
};

const defaultStore = storeFake(defaultState);

const renderWithProviders = ({
  store = defaultStore,
  props = defaultProps,
}) => {
  render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 10000, itemHeight: 100 }}
    >
      <Provider store={store}>
        <ManageAthletesTab {...props} />
      </Provider>
    </VirtuosoMockContext.Provider>
  );
};

const adminProps = {
  careerStatus: 'active',
  activeStatus: 'active',
  isAssociationAdmin: true,
  t: i18nextTranslateStub(),
};
const filters = ['Club', 'Position'];

describe('ManageAthletesTab', () => {
  const getMockManageAthletesGrid = () => ({
    isManageAthletesGridFetching: false,
    isManageAthletesGridError: false,
    onHandleFilteredSearch: jest.fn(),
    grid: {
      columns: [],
      rows: [],
      id: 'test-grid',
      emptyTableText: 'No athletes found',
    },
    filteredSearchParams: { search_expression: '', page: 1 },
    onUpdateFilter: jest.fn(),
    meta: { current_page: 1, next_page: null },
    data: [],
    positionsOptions: [],
    organisationOptions: [],
    divisionsOptions: [],
  });

  const mockData = [
    {
      id: 98057,
      name: 'Test Athlete',
      organisations: [],
      user_id: 4589,
      squads: '',
    },
  ];

  it('renders the component', () => {
    mockUseManageAthletesGrid.mockReturnValue(getMockManageAthletesGrid());
    renderWithProviders({});

    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/no athletes found/i)).toBeInTheDocument();
  });

  it('renders content when data is available', () => {
    mockUseManageAthletesGrid.mockReturnValue({
      ...getMockManageAthletesGrid(),
      grid: {
        columns: [
          {
            id: 'name',
            row_key: 'name',
            content: <div>Athlete</div>,
          },
        ],
        rows: [
          {
            id: 98057,
            cells: [
              {
                id: 'name',
                content: <div>Test Athlete</div>,
              },
            ],
          },
        ],
        emptyTableText: 'No athletes found',
      },
      data: mockData,
    });

    renderWithProviders({});
    expect(screen.getByText(/Test Athlete/i)).toBeInTheDocument();
  });

  describe('is AssociationAdmin', () => {
    beforeEach(() => window.setFlag('league-ops-player-movement-trade', true));

    it.each(filters)('render the %p filter', (filter) => {
      const mockUpdateFilter = jest.fn();
      mockUseManageAthletesGrid.mockReturnValue({
        ...getMockManageAthletesGrid(),
        onUpdateFilter: mockUpdateFilter,
      });

      renderWithProviders({ props: adminProps });

      expect(screen.getByText(filter)).toBeInTheDocument();
    });
  });

  describe('is not AssociationAdmin', () => {
    it.each(filters)('does not render the %p filter', (filter) => {
      const mockUpdateFilter = jest.fn();
      mockUseManageAthletesGrid.mockReturnValue({
        ...getMockManageAthletesGrid(),
        onUpdateFilter: mockUpdateFilter,
      });

      renderWithProviders({});

      expect(screen.queryByText(filter)).not.toBeInTheDocument();
    });
  });

  it('calls onUpdateFilter with correct values', async () => {
    window.setFlag('league-ops-player-movement-trade', true)

    const mockUpdateFilter = jest.fn();
    mockUseManageAthletesGrid.mockReturnValue({
      ...getMockManageAthletesGrid(),
      onUpdateFilter: mockUpdateFilter,
      organisationOptions: [
        {
          value: 1361,
          label: 'Vermont whales',
        },
      ],
    });

    renderWithProviders({ props: adminProps });

    await userEvent.click(screen.getByText('Club'));
    await userEvent.click(screen.getByText('Vermont whales'));

    expect(mockUpdateFilter).toHaveBeenCalledWith({
      organisation_ids: [1361],
      page: 1,
    });
  });

  it('renders error message when isManageAthletesGridError is true', () => {
    mockUseManageAthletesGrid.mockReturnValue({
      ...getMockManageAthletesGrid(),
      isManageAthletesGridError: true,
    });

    renderWithProviders({});

    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
  });

  it('renders loading message when isManageAthletesGridFetching is true', () => {
    mockUseManageAthletesGrid.mockReturnValue({
      ...getMockManageAthletesGrid(),
      isManageAthletesGridFetching: true,
    });

    renderWithProviders({});
    expect(screen.getByTestId(/Loading/i)).toBeInTheDocument();
  });

  describe('MUI Grid', () => {
    beforeEach(() => {
      window.featureFlags['manage-athletes-grid-mui'] = true;
      mockUseManageAthletesGrid.mockReturnValue({
        ...getMockManageAthletesGrid(),
        data: mockData,
      });
    });
    afterEach(() => {
      window.featureFlags['manage-athletes-grid-mui'] = false;
    });

    it('renders the component', () => {
      mockUseManageAthletesGrid.mockReturnValue(getMockManageAthletesGrid());
      renderWithProviders({});

      expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
      expect(screen.getByText(/no athletes found/i)).toBeInTheDocument();
    });

    it('should render the columns for non-association admin', () => {
      renderWithProviders({});
      const columns = getMuiCols(defaultProps.isAssociationAdmin);

      columns.forEach((column) => {
        expect(
          screen.getByRole('columnheader', { name: column.headerName })
        ).toBeInTheDocument();
      });

      expect(screen.getAllByRole('checkbox').length).toBe(mockData.length + 1); // +1 for the header row
    });

    describe('association admin', () => {
      it('should render the columns for association admin', () => {
        renderWithProviders({ props: adminProps });
        const columns = getMuiCols(adminProps.isAssociationAdmin);

        columns.forEach((column) => {
          expect(
            screen.getByRole('columnheader', { name: column.headerName })
          ).toBeInTheDocument();
        });
      });

      it('should render the actions column', () => {
        window.featureFlags['league-ops-player-movement-trade'] = true;

        renderWithProviders({ props: adminProps });
        expect(screen.getAllByTestId('MoreVertIcon').length).toBe(
          mockData.length
        );
        window.featureFlags['league-ops-player-movement-trade'] = false;
      });
    });

    describe('bulkActions', () => {
      beforeEach(() => {
        const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
        useDispatchSpy.mockReturnValue(mockDispatch);
      });

      it('should dispatch the right reducer actions for non-primary squad', async () => {
        const user = userEvent.setup();
        renderWithProviders({});

        await user.click(screen.getAllByRole('checkbox')[1]); // The first line

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: false,
          type: `${REDUCER_KEY}/onUpdateShouldRemovePrimarySquad`,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [{ id: mockData[0].id, userId: mockData[0].user_id }],
          type: `${REDUCER_KEY}/onUpdateSelectedAthleteIds`,
        });
      });

      it('should dispatch the right reducer actions for primary squad', async () => {
        const user = userEvent.setup();
        mockUseManageAthletesGrid.mockReturnValue({
          ...getMockManageAthletesGrid(),
          data: [{ ...mockData[0], squads: 'Squirtle Squad (Primary)' }],
        });
        renderWithProviders({});

        await user.click(screen.getAllByRole('checkbox')[1]); // The first line

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: true,
          type: `${REDUCER_KEY}/onUpdateShouldRemovePrimarySquad`,
        });
      });
    });

    describe('labels filter', () => {
      const localState = {
        ...defaultState,
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                settings: {
                  canViewLabels: true,
                },
              },
            },
          },
        },
      };

      beforeEach(() => {
        const mockUpdateFilter = jest.fn();
        mockUseManageAthletesGrid.mockReturnValue({
          ...getMockManageAthletesGrid(),
          onUpdateFilter: mockUpdateFilter,
        });

        window.setFlag('labels-and-groups', true);
      });
      afterEach(() => {
        window.setFlag('labels-and-groups', false);
      });
      it('renders labels filter when FF and permission is on', () => {
        renderWithProviders({
          store: storeFake(localState),
        });

        // Labels filter + Labels Column
        expect(screen.getAllByText('Labels')).toHaveLength(2);
      });

      it('does not render labels filter when FF is off', () => {
        window.setFlag('labels-and-groups', false);

        renderWithProviders({
          store: storeFake(localState),
        });

        expect(screen.queryByText('Labels')).not.toBeInTheDocument();
      });

      it('does not render labels filter when FF is on but permission is false', () => {
        renderWithProviders({});

        expect(screen.queryByText('Labels')).not.toBeInTheDocument();
      });
    });
  });
});
