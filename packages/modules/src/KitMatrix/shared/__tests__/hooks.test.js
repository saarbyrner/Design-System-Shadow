import { renderHook, act } from '@testing-library/react-hooks';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useGetKitMatrixColorsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi';
import { useSearchKitMatricesQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { defaultFilters } from '@kitman/modules/src/KitMatrix/shared/constants';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import {
  useGetActiveSquadQuery,
  useGetCurrentUserQuery,
  useGetOrganisationQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { Provider } from 'react-redux';
import { useKitMatrixDataGrid } from '../hooks';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi');
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi');
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi');
jest.mock('@kitman/common/src/hooks/useDebouncedCallback');
jest.mock('@kitman/modules/src/KitMatrix/shared/utils', () => ({
  ...jest.requireActual('@kitman/modules/src/KitMatrix/shared/utils'),
  transformKitMatrices: jest.fn(),
}));

const t = i18nextTranslateStub();
const MockClubData = {
  id: 8,
  name: 'International Squad',
  owner_id: 6,
  division: [
    {
      id: 1,
      name: 'KLS',
    },
  ],
};

describe('hooks', () => {
  describe('useKitMatrixDataGrid', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      getActiveSquad.mockReturnValue(() => MockClubData);
      useGetOrganisationQuery.mockReturnValue({
        data: [
          { id: 1, name: 'Club A' },
          { id: 2, name: 'Club B' },
        ],
      });
      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'Official',
          registration: { user_type: 'association_admin' },
        },
      });

      useGetActiveSquadQuery.mockReturnValue({
        data: {
          id: 1,
          name: 'Test',
          owner_id: 1234,
        },
      });

      useGetClubsQuery.mockReturnValue({
        data: [
          { id: 1, name: 'Club A' },
          { id: 2, name: 'Club B' },
        ],
      });

      useGetKitMatrixColorsQuery.mockReturnValue({
        data: [
          { id: 1, name: 'Red' },
          { id: 2, name: 'Blue' },
        ],
      });

      useSearchKitMatricesQuery.mockReturnValue({
        data: { kit_matrices: [] },
        isFetching: false,
      });

      useDebouncedCallback.mockImplementation((fn) => fn);
    });

    const renderHookWithWrapper = () => {
      const { result } = renderHook(() => useKitMatrixDataGrid({ t }), {
        wrapper,
      });

      return result;
    };

    it('initializes with default filters', () => {
      const result = renderHookWithWrapper();

      expect(result.current.filters).toEqual(defaultFilters);
      expect(result.current.search).toBe('');
    });

    it('updates search filter when onSearchChange is called', () => {
      const result = renderHookWithWrapper();

      act(() => {
        result.current.onSearchChange('new search');
      });

      expect(result.current.filters.search).toBe('new search');
    });

    it('renders filter for clubs with correct options', () => {
      const result = renderHookWithWrapper();

      const filterElement = result.current.renderFilter('clubs');

      expect(filterElement.props.options).toEqual([
        { label: 'Club A', value: 1 },
        { label: 'Club B', value: 2 },
      ]);
    });

    it('renders filter for colors with correct options', () => {
      const result = renderHookWithWrapper();

      const filterElement = result.current.renderFilter('colors');

      expect(filterElement.props.options).toEqual([
        { label: 'Red', value: 1 },
        { label: 'Blue', value: 2 },
      ]);
    });

    it('returns the rendered data grid with correct props', () => {
      const result = renderHookWithWrapper();

      const dataGrid = result.current.renderDataGrid();

      expect(dataGrid.props.rows).toEqual([]);
      expect(dataGrid.props.loading).toBe(false);
    });

    it('returns "No Kit matrix found." when there are no results', () => {
      useSearchKitMatricesQuery.mockReturnValue({
        data: { kit_matrices: [] },
        isFetching: false,
      });

      const result = renderHookWithWrapper();

      const dataGrid = result.current.renderDataGrid();
      const noRowsOverlay = dataGrid.props.slots.noRowsOverlay();

      expect(noRowsOverlay.props.children).toBe('No Kit matrix found.');
    });
  });
});
