import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  data,
  meta,
} from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_athletes';
import {
  useLazySearchAthletesQuery,
  useGetPositionGroupsQuery,
  useSearchMovementOrganisationsListQuery,
  useGetDivisionsQuery,
} from '@kitman/modules/src/UserMovement/shared/redux/services';

import useManageAthletesGrid from '../useManageAthletesGrid';

jest.useFakeTimers();
jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

const defaultFilter = {
  search_expression: '',
  is_active: true,
  division_ids: null,
  career_status: null,
  organisation_ids: null,
  position_ids: null,
  squad_ids: null,
  label_ids: null,
  page: 1,
  per_page: 30,
  'include_athlete_game_status?': false,
};

const MOCK_ORGANISATION = {
  association_admin: true,
};

const positionData = [
  {
    id: 28,
    name: 'Goalkeeper',
    order: 1,
    positions: [
      {
        id: 84,
        name: 'Goalkeeper',
        order: 1,
        abbreviation: 'GK',
      },
    ],
  },
];

const divisionData = [
  {
    id: 1,
    name: 'KLS Next',
  },
];

const orgData = [
  {
    id: 1361,
    name: 'Vermont whales',
    logo_full_path:
      'https://kitman-staging.imgix.net/kitman-stock-assets/test.jpeg?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
  },
];

const createStore = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const createWrapper =
  (store) =>
  ({ children }) =>
    <Provider store={store}>{children}</Provider>;

const getStore = (mockData = MOCK_ORGANISATION) =>
  createStore({
    globalApi: {
      queries: {
        'getActiveSquad(undefined)': {},
        'getOrganisation(undefined)': {
          data: {
            ...mockData,
          },
        },
      },
    },
    'UserMovement.services': {
      useSearchAthletesQuery: jest.fn(),
      useLazySearchAthletesQuery: jest.fn(),
      useGetPositionGroupsQuery: jest.fn(),
      useSearchMovementOrganisationsListQuery: jest.fn(),
      useGetDivisionsQuery: jest.fn(),
    },
  });

const wrapper = createWrapper(getStore());

describe('useManageAthletesGrid', () => {
  beforeEach(() => {
    useLazySearchAthletesQuery.mockReturnValue([
      jest.fn(),
      {
        data: {
          data,
          meta,
        },
        isFetching: false,
        isError: false,
        isLoading: true,
      },
    ]);
    useGetPositionGroupsQuery.mockReturnValue({
      data: positionData,
      isLoading: true,
    });
    useSearchMovementOrganisationsListQuery.mockReturnValue({
      data: orgData,
      isLoading: true,
    });
    useGetDivisionsQuery.mockReturnValue({
      data: divisionData,
      isLoading: true,
    });
  });

  describe('Association level - [initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current).toHaveProperty(
        'isManageAthletesGridError'
      );
      expect(renderHookResult.current).toHaveProperty(
        'isManageAthletesGridLoading'
      );
      expect(renderHookResult.current).toHaveProperty(
        'isManageAthletesGridFetching'
      );
      expect(renderHookResult.current).toHaveProperty('onHandleFilteredSearch');
      expect(renderHookResult.current).toHaveProperty('filteredSearchParams');
      expect(renderHookResult.current).toHaveProperty('onUpdateFilter');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'search_expression'
      );

      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No athletes have been registered yet'
      );
      expect(renderHookResult.current.grid.id).toEqual('AthleteManagementGrid');

      expect(renderHookResult.current).toHaveProperty('meta');
      expect(renderHookResult.current.meta).toHaveProperty('current_page');
      expect(renderHookResult.current.meta).toHaveProperty('next_page');
      expect(renderHookResult.current.meta).toHaveProperty('prev_page');
      expect(renderHookResult.current.meta).toHaveProperty('total_count');
      expect(renderHookResult.current.meta).toHaveProperty('total_pages');
    });
  });
  describe('Association level  - [computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the athletes', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});

      expect(renderHookResult.current.grid.rows.length).toEqual(data.length);
    });

    it('has the correct grid.rows', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});

      expect(renderHookResult.current.grid.rows.length).toEqual(data.length);
      const rows = renderHookResult.current.grid.rows;
      expect(rows[0].id).toEqual(data[0].user_id);
      expect(rows[1].id).toEqual(data[1].user_id);
    });

    it('has the correct columns', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.grid.columns).toHaveLength(8);
      const columns = renderHookResult.current.grid.columns;
      expect(columns[0].id).toEqual('name');
      expect(columns[1].id).toEqual('assigned_to');
      expect(columns[2].id).toEqual('email');
      expect(columns[3].id).toEqual('date_of_birth');
      expect(columns[4].id).toEqual('id');
      expect(columns[5].id).toEqual('username');
      expect(columns[6].id).toEqual('position');
      expect(columns[7].id).toEqual('career_status');
    });
  });

  describe('Association level  - [FILTERS]', () => {
    let renderHookResult;

    beforeEach(async () => {
      jest.useFakeTimers();

      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
            isAssociationAdmin: true,
            squadIds: null,
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('correctly updates the filter for search', async () => {
      await renderHookResult.current.onUpdateFilter({
        search_expression: 'Hi',
      });

      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        search_expression: 'Hi',
      });
    });
  });

  describe('Organisation level - [initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current).toHaveProperty(
        'isManageAthletesGridError'
      );
      expect(renderHookResult.current).toHaveProperty(
        'isManageAthletesGridLoading'
      );
      expect(renderHookResult.current).toHaveProperty(
        'isManageAthletesGridFetching'
      );
      expect(renderHookResult.current).toHaveProperty('onHandleFilteredSearch');
      expect(renderHookResult.current).toHaveProperty('filteredSearchParams');
      expect(renderHookResult.current).toHaveProperty('onUpdateFilter');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'search_expression'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'division_ids'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'is_active'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'organisation_ids'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'page'
      );
      expect(renderHookResult.current.filteredSearchParams).toHaveProperty(
        'per_page'
      );

      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No athletes have been registered yet'
      );
      expect(renderHookResult.current.grid.id).toEqual('AthleteManagementGrid');

      expect(renderHookResult.current).toHaveProperty('meta');
      expect(renderHookResult.current.meta).toHaveProperty('current_page');
      expect(renderHookResult.current.meta).toHaveProperty('next_page');
      expect(renderHookResult.current.meta).toHaveProperty('prev_page');
      expect(renderHookResult.current.meta).toHaveProperty('total_count');
      expect(renderHookResult.current.meta).toHaveProperty('total_pages');
    });
  });
  describe('Organisation level - [computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the athletes', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});

      expect(renderHookResult.current.grid.rows.length).toEqual(data.length);
    });

    it('fetches the INACTIVE athletes', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'INACTIVE',
            careerStatus: 'INACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});

      expect(renderHookResult.current.grid.rows.length).toEqual(data.length);
    });

    it('has the correct grid.rows', async () => {
      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});

      expect(renderHookResult.current.grid.rows.length).toEqual(data.length);
      const rows = renderHookResult.current.grid.rows;
      expect(rows[0].id).toEqual(data[0].user_id);
      expect(rows[1].id).toEqual(data[1].user_id);
    });

    it('has the correct columns', async () => {
      const renderWrapper = createWrapper(
        getStore({ association_admin: false })
      );

      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper: renderWrapper,
        }
      ).result;

      expect(renderHookResult.current.grid.columns).toHaveLength(5);
      const columns = renderHookResult.current.grid.columns;
      expect(columns[0].id).toEqual('name');
      expect(columns[1].id).toEqual('username');
      expect(columns[2].id).toEqual('position');
      expect(columns[3].id).toEqual('squads');
      expect(columns[4].id).toEqual('creation_date');
    });
  });
  describe('Organisation level - [FILTERS]', () => {
    let renderHookResult;

    beforeEach(async () => {
      jest.useFakeTimers();

      renderHookResult = renderHook(
        () =>
          useManageAthletesGrid({
            activeStatus: 'ACTIVE',
            careerStatus: 'ACTIVE',
          }),
        {
          wrapper,
        }
      ).result;

      await renderHookResult.current.onHandleFilteredSearch({});
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('correctly updates the filter for search', async () => {
      await renderHookResult.current.onUpdateFilter({
        search_expression: 'Hi',
      });

      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        search_expression: 'Hi',
      });
    });

    it('correctly updates the filter for search by organisation_ids', async () => {
      await renderHookResult.current.onUpdateFilter({
        organisation_ids: [1],
      });

      expect(renderHookResult.current.filteredSearchParams).toEqual({
        ...defaultFilter,
        organisation_ids: [1],
      });
    });

    it('correctly updates the filter for search by organisation_ids and updates position_ids and career_status', async () => {
      const updatedFilter = {
        ...defaultFilter,
        organisation_ids: [1],
        position_ids: [28],
        career_status: 'ACTIVE',
      };

      await renderHookResult.current.onUpdateFilter({
        organisation_ids: updatedFilter.organisation_ids,
        position_ids: updatedFilter.position_ids,
        career_status: updatedFilter.career_status,
      });

      expect(renderHookResult.current.filteredSearchParams).toEqual(
        updatedFilter
      );
    });
  });
});
