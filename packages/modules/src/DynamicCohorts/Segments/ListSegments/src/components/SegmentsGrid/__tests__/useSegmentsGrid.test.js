import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';
import { storeFake } from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { paginatedSegmentsResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchSegments';
import { useSearchSegmentsQuery } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { ROW_KEY } from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/src/components/SegmentsGrid/cellBuilder';
import { act } from 'react-dom/test-utils';
import useSegmentsGrid from '../useSegmentsGrid';

jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);

const defaultStore = storeFake({
  manageSegmentsSlice: getInitialState(),
});

describe('useSegmentsGrid', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    useSearchSegmentsQuery.mockReturnValue({
      data: paginatedSegmentsResponse,
      isSuccess: true,
      isFetching: false,
      isError: false,
      refetch: mockRefetch,
    });
  });

  const getWrapper = ({ children }) => {
    return <Provider store={defaultStore}>{children}</Provider>;
  };

  it('returns the initial data', async () => {
    const { result } = renderHook(() => useSegmentsGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('isGridError');
    expect(result.current.isGridError).toEqual(false);
    expect(result.current).toHaveProperty('isGridFetching');
    expect(result.current.isGridFetching).toEqual(false);
    expect(result.current).toHaveProperty('isGridSuccess');
    expect(result.current.isGridSuccess).toEqual(true);

    expect(result.current).toHaveProperty('segments');
    expect(result.current.segments).toEqual(paginatedSegmentsResponse.segments);

    expect(result.current).toHaveProperty('nextIdToFetch');
    expect(result.current.nextIdToFetch).toEqual(
      paginatedSegmentsResponse.next_id
    );
  });

  it('has the correct rows', () => {
    const { result } = renderHook(() => useSegmentsGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('rows');
    result.current.rows.forEach((row, index) => {
      expect(row.id).toEqual(paginatedSegmentsResponse.segments[index].id);
    });
  });

  it('has the correct columns', () => {
    const { result } = renderHook(() => useSegmentsGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('columns');
    result.current.columns.forEach((column) => {
      expect(column.id).toEqual(ROW_KEY[column.id]);
    });
  });

  it('calls refetch if nextId is null', () => {
    const { result } = renderHook(() => useSegmentsGrid(), {
      wrapper: getWrapper,
    });
    expect(result.current).toHaveProperty('resetSegmentsGrid');
    act(() => {
      result.current.resetSegmentsGrid();
    });
    expect(mockRefetch).toHaveBeenCalled();
  });
});
