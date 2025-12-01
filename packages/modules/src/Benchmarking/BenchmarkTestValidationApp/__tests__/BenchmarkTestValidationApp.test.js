import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetBenchmarkingClubsQuery,
  useGetBenchmarkingWindowsQuery,
  useGetBenchmarkingSeasonsQuery,
  useLazyGetBenchmarkingResultsQuery,
  useLazySubmitBenchmarkTestValidationsQuery,
} from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationApi';
import {
  getBenchmarkingClubsData,
  getBenchmarkingSeasonsData,
  getBenchmarkingWindowsData,
  getBenchmarkingResultsData,
} from '@kitman/services/src/mocks/handlers/benchmarking';

import BenchmarkingTestValidationApp from '..';

jest.mock(
  '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationApi'
);

describe('BenchmarkingTestValidationApp', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const defaultStore = storeFake({
    benchmarkTestValidationApi: {
      useGetBenchmarkingClubsQuery: jest.fn(),
      useGetBenchmarkingWindowsQuery: jest.fn(),
      useGetBenchmarkingSeasonsQuery: jest.fn(),
      useLazyGetBenchmarkingResultsQuery: jest.fn(),
      useLazySubmitBenchmarkTestValidationsQuery: jest.fn(),
    },
    benchmarkTestValidation: {
      selections: {
        club: { label: '', value: '' },
        season: { label: '', value: '' },
        window: { label: '', value: '' },
      },
      title: null,
    },
  });

  const defaultStoreWithSelections = storeFake({
    benchmarkTestValidationApi: {
      useGetBenchmarkingClubsQuery: jest.fn(),
      useGetBenchmarkingWindowsQuery: jest.fn(),
      useGetBenchmarkingSeasonsQuery: jest.fn(),
      useLazyGetBenchmarkingResultsQuery: jest.fn(),
      useLazySubmitBenchmarkTestValidationsQuery: jest.fn(),
    },
    benchmarkTestValidation: {
      selections: {
        club: { label: 'Kitman Rugby Club', value: 6 },
        season: { label: '2011/2012', value: 2011 },
        window: { label: 'Test Window 1', value: 5 },
      },
      title: 'Kitman Rugby Club, Test Window 1 2010/2011',
    },
  });

  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetBenchmarkingClubsQuery.mockReturnValue({
      data: getBenchmarkingClubsData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useGetBenchmarkingWindowsQuery.mockReturnValue({
      data: getBenchmarkingWindowsData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useGetBenchmarkingSeasonsQuery.mockReturnValue({
      data: getBenchmarkingSeasonsData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useLazyGetBenchmarkingResultsQuery.mockReturnValue([
      jest.fn(),
      {
        data: getBenchmarkingResultsData,
        isError: false,
        isLoading: false,
        isSuccess: true,
      },
    ]);
    useLazySubmitBenchmarkTestValidationsQuery.mockReturnValue([
      jest.fn(),
      {
        isError: false,
        isLoading: false,
        isSuccess: true,
      },
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render as expected', () => {
    render(
      <Provider store={defaultStore}>
        <BenchmarkingTestValidationApp {...defaultProps} />
      </Provider>
    );

    expect(screen.getByText('Benchmark test validation')).toBeInTheDocument();

    // 3 select labels
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Window')).toBeInTheDocument();

    // Element from validator
    expect(
      screen.queryByText('Kitman Rugby Club, Test Window 1 2022/2023')
    ).not.toBeInTheDocument();
  });

  it('should render validator once resultsData exists and selections, with constructed title', () => {
    render(
      <Provider store={defaultStoreWithSelections}>
        <BenchmarkingTestValidationApp {...defaultProps} />
      </Provider>
    );

    expect(screen.getByText('Benchmark test validation')).toBeInTheDocument();

    // 3 select labels
    expect(screen.getByText('Kitman Rugby Club')).toBeInTheDocument();
    expect(screen.getByText('2011/2012')).toBeInTheDocument();
    expect(screen.getByText('Test Window 2')).toBeInTheDocument();

    // Element from validator
    expect(
      screen.queryByText('Kitman Rugby Club, Test Window 1 2011/2012')
    ).toBeInTheDocument();
  });
});
