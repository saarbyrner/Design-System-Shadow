import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import * as services from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import MaturationStatuses from '..';

const mockSetFilter = jest.fn();
const user = userEvent.setup();

jest.mock(
  '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter',
  () => {
    return jest.fn(() => ({
      filter: [1],
      setFilter: mockSetFilter,
    }));
  }
);

const MOCK_MATURATION_STATUSES = [
  {
    id: 1,
    name: 'Very Early',
  },
  {
    id: 2,
    name: 'Early',
  },
  {
    id: 3,
    name: 'On Time',
  },
  {
    id: 4,
    name: 'Late',
  },
  {
    id: 5,
    name: 'Very Late',
  },
];

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|MaturationStatuses', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetMaturationStatusesQuery').mockReturnValue({
      data: MOCK_MATURATION_STATUSES,
      isFetching: false,
    });
  });

  it('renders the MaturationStatuses component', () => {
    render(<MaturationStatuses {...props} />);

    const maturationStatuses = screen.getByLabelText('Maturation status');

    expect(maturationStatuses).toBeInTheDocument();
  });

  it('renders the filter prefilled from the useFilter hook', () => {
    render(<MaturationStatuses {...props} />);

    const veryEarly = screen.getByText('Very Early');

    expect(veryEarly).toBeInTheDocument();
  });

  it('renders the maturation status options', async () => {
    const { container } = render(<MaturationStatuses {...props} />, {
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

    expect(screen.getByText('On Time')).toBeInTheDocument();
    expect(screen.getByText('Late')).toBeInTheDocument();
  });

  it('calls setFilter when option(s) are selected', async () => {
    const { container } = render(<MaturationStatuses {...props} />, {
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
    await user.click(screen.getByText('Late'));

    expect(mockSetFilter).toHaveBeenCalledWith([1, 4]);
  });
});
