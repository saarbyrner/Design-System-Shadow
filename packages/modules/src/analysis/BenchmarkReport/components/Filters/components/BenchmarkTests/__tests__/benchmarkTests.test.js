import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import BenchmarkTests from '..';
import { render } from '../../../../../testUtils';
import * as services from '../../../../../redux/service';

const mockSetFilter = jest.fn();

jest.mock('../../../../../hooks/useFilter', () => {
  return jest.fn(() => ({
    filter: [1],
    setFilter: mockSetFilter,
  }));
});

const MOCK_BENCHMARK_TESTS = [
  {
    id: 1,
    name: 'metric_1',
  },
  {
    id: 2,
    name: 'metric_2',
  },
  {
    id: 3,
    name: 'metric_3',
  },
];

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|BenchmarkTests', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetBenchmarkTestsQuery').mockReturnValue({
      data: MOCK_BENCHMARK_TESTS,
      isFetching: false,
    });
  });

  it('renders the BenchmarkTests component', () => {
    render(<BenchmarkTests {...props} />);

    const benchmarkTests = screen.getByLabelText('Benchmark test(s)');

    expect(benchmarkTests).toBeInTheDocument();
  });

  it('renders the filter prefilled from the useFilter hook', () => {
    render(<BenchmarkTests {...props} />);

    const metric1 = screen.getByText('metric_1');

    expect(metric1).toBeInTheDocument();
  });

  it('renders the benchmark test options', async () => {
    const user = userEvent.setup();
    const { container } = render(<BenchmarkTests {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    // click on select dropdown
    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);

    expect(screen.getByText('metric_2')).toBeInTheDocument();
    expect(screen.getByText('metric_3')).toBeInTheDocument();
  });

  it('calls setFilter when option(s) are selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<BenchmarkTests {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });
    // click on select dropdown
    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);
    // click on an option
    await user.click(screen.getByText('metric_2'));

    expect(mockSetFilter).toHaveBeenCalledWith([1, 2]);
  });
});
