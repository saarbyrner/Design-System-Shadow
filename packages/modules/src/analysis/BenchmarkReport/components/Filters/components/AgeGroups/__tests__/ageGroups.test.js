import { VirtuosoMockContext } from 'react-virtuoso';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import * as services from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';

import AgeGroups from '..';

const mockSetFilter = jest.fn();

jest.mock(
  '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter',
  () => {
    return jest.fn(() => ({
      filter: [1],
      setFilter: mockSetFilter,
    }));
  }
);

const MOCK_AGE_GROUPS = [
  {
    id: 1,
    name: 'U9',
  },
  {
    id: 2,
    name: 'U10',
  },
  {
    id: 3,
    name: 'U11',
  },
];

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|AgeGroups', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetAgeGroupsQuery').mockReturnValue({
      data: MOCK_AGE_GROUPS,
      isFetching: false,
    });
  });

  it('renders the AgeGroups component', () => {
    render(<AgeGroups {...props} />);

    const ageGroups = screen.getByLabelText('Age group(s)');

    expect(ageGroups).toBeInTheDocument();
  });

  it('renders the filter prefilled from the useFilter hook', () => {
    render(<AgeGroups {...props} />);

    const u9 = screen.getByText('U9');

    expect(u9).toBeInTheDocument();
  });

  it('renders the age group options', async () => {
    const user = userEvent.setup();
    const { container } = render(<AgeGroups {...props} />, {
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

    expect(screen.getByText('U10')).toBeInTheDocument();
    expect(screen.getByText('U11')).toBeInTheDocument();
  });

  it('calls setFilter when option(s) are selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<AgeGroups {...props} />, {
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
    await user.click(screen.getByText('U10'));

    expect(mockSetFilter).toHaveBeenCalledWith([1, 2]);
  });
});
