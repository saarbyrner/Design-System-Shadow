import { renderHook } from '@testing-library/react-hooks';
import { paginatedAthletesResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchAthletes';
import { Provider } from 'react-redux';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import { useSearchAthletesQuery } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { ROW_KEY } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/components/AthletesGrid/cellBuilder';
import { segmentRequest } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import useAthletesGrid from '../useAthletesGrid';

jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  segmentSlice: getInitialState(),
});

describe('useAthletesGrid', () => {
  beforeEach(() => {
    useSearchAthletesQuery.mockReturnValue({
      data: paginatedAthletesResponse,
      isSuccess: true,
      isFetching: false,
      isError: false,
    });
  });

  const getWrapper = ({ children }) => {
    return <Provider store={defaultStore}>{children}</Provider>;
  };

  it('returns the initial data', async () => {
    const { result } = renderHook(() => useAthletesGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('isGridError');
    expect(result.current.isGridError).toEqual(false);
    expect(result.current).toHaveProperty('isGridFetching');
    expect(result.current.isGridFetching).toEqual(false);
    expect(result.current).toHaveProperty('isGridSuccess');
    expect(result.current.isGridSuccess).toEqual(true);

    expect(result.current).toHaveProperty('athletes');
    expect(result.current.athletes).toEqual(paginatedAthletesResponse.athletes);

    expect(result.current).toHaveProperty('nextAthleteIdToFetch');
    expect(result.current.nextAthleteIdToFetch).toEqual(
      paginatedAthletesResponse.next_id
    );

    expect(result.current).toHaveProperty('emptyTableText');
  });

  it('has the correct rows', () => {
    const { result } = renderHook(() => useAthletesGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('rows');
    result.current.rows.forEach((row, index) => {
      expect(row.id).toEqual(paginatedAthletesResponse.athletes[index].id);
    });
  });

  it('has the correct columns', () => {
    const { result } = renderHook(() => useAthletesGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('columns');
    result.current.columns.forEach((column) => {
      expect(column.id).toEqual(ROW_KEY[column.id]);
    });
  });

  it('gets the correct table text when there is an error', () => {
    useSearchAthletesQuery.mockReturnValue({
      data: {},
      isSuccess: false,
      isFetching: false,
      isError: true,
    });

    const { result } = renderHook(() => useAthletesGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('emptyTableText');
    expect(result.current.emptyTableText).toEqual('Error fetching athletes.');
  });

  it('gets the correct table text when there are no athletes', () => {
    const filledStore = storeFake({
      segmentSlice: {
        queryParams: { expression: segmentRequest.expression },
      },
    });
    useSearchAthletesQuery.mockReturnValue({
      data: { athletes: [] },
      isSuccess: true,
      isFetching: false,
      isError: false,
    });

    const { result } = renderHook(() => useAthletesGrid(), {
      wrapper: ({ children }) => (
        <Provider store={filledStore}>{children}</Provider>
      ),
    });

    expect(result.current).toHaveProperty('emptyTableText');
    expect(result.current.emptyTableText).toEqual('No athletes.');
  });

  it('gets the correct table text when there is no expression', () => {
    const { result } = renderHook(() => useAthletesGrid(), {
      wrapper: getWrapper,
    });

    expect(result.current).toHaveProperty('emptyTableText');
    expect(result.current.emptyTableText).toEqual('No conditions set.');
  });
});
