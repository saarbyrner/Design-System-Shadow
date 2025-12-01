import { screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import * as services from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import { data } from '@kitman/services/src/mocks/handlers/getPositionGroups';
import Positions from '..';

const mockSetFilter = jest.fn();

jest.mock(
  '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter',
  () => {
    return jest.fn(() => ({
      filter: [],
      setFilter: mockSetFilter,
    }));
  }
);

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|Positions', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetPositionGroupsQuery').mockReturnValue({
      data,
      isFetching: false,
    });
  });

  it('renders the Positions component', () => {
    render(<Positions {...props} />);

    const positions = screen.getByLabelText('Position(s)');

    expect(positions).toBeInTheDocument();
  });

  it('renders the position options', async () => {
    render(<Positions {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    selectEvent.openMenu(screen.getByLabelText('Position(s)'));
    expect(screen.getByText('Position group 1')).toBeInTheDocument();
    expect(screen.getByText('Position group 2')).toBeInTheDocument();
  });

  it('calls setFilter when option(s) are selected', async () => {
    render(<Positions {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    const positionFilter = screen.getByLabelText('Position(s)');
    // click on select dropdown
    selectEvent.openMenu(positionFilter);
    // click on an option
    await selectEvent.select(positionFilter, 'Position group 1');

    expect(mockSetFilter).toHaveBeenCalledWith([1]);
  });
});
