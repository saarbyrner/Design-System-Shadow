import { renderHook } from '@testing-library/react-hooks';
import { paginatedLabelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/searchLabels';
import { Provider } from 'react-redux';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import { ROW_KEY } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid/cellBuilder';
import { useSearchLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import useLabelsGrid from '../useLabelsGrid';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  labelSlice: getInitialState(),
  manageLabelsSlice: {
    isLabelModalOpen: false,
    nextId: null,
    filters: {
      searchValue: '',
      createdBy: [],
    },
  },
});

describe('useLabelsGrid', () => {
  beforeEach(() => {
    useSearchLabelsQuery.mockReturnValue({
      data: paginatedLabelResponse,
      isSuccess: true,
      isLoading: false,
      isError: false,
    });
  });

  const getWrapper = ({ children }) => {
    return <Provider store={defaultStore}>{children}</Provider>;
  };

  it('returns the initial data', async () => {
    const { result } = renderHook(() => useLabelsGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('isGridError');
    expect(result.current.isGridError).toEqual(false);
    expect(result.current).toHaveProperty('isGridLoading');
    expect(result.current.isGridLoading).toEqual(false);
    expect(result.current).toHaveProperty('isGridSuccess');
    expect(result.current.isGridSuccess).toEqual(true);

    expect(result.current).toHaveProperty('labels');
    expect(result.current.labels).toEqual(paginatedLabelResponse.labels);

    expect(result.current).toHaveProperty('nextIdToFetch');
    expect(result.current.nextIdToFetch).toEqual(
      paginatedLabelResponse.next_id
    );

    expect(result.current).toHaveProperty('resetLabelsGrid');
  });

  it('has the correct rows', () => {
    const { result } = renderHook(() => useLabelsGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('rows');
    result.current.rows.forEach((row, index) => {
      expect(row.id).toEqual(paginatedLabelResponse.labels[index].id);
    });
  });

  it('has the correct columns', () => {
    const { result } = renderHook(() => useLabelsGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('columns');
    result.current.columns.forEach((column) => {
      expect(column.id).toEqual(ROW_KEY[column.id]);
    });
  });
});
