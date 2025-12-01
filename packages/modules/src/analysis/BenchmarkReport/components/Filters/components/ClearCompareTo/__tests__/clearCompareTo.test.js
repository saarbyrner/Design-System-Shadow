import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import ClearCompareTo from '..';

jest.mock('@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter');

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|Clubs', () => {
  const mockClearFilters = jest.fn();

  beforeEach(() => {
    useFilter.mockImplementation(() => {
      return {
        clearCompareToFilters: mockClearFilters,
      };
    });
  });
  it('renders the ClearCompareTo component', () => {
    render(<ClearCompareTo {...props} />);

    const clearCompareToButton = screen.getByRole('button', { name: 'Clear' });

    expect(clearCompareToButton).toBeInTheDocument();
  });

  it('calls setFilter when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ClearCompareTo {...props} />);

    const clearCompareToButton = screen.getByRole('button', { name: 'Clear' });
    await user.click(clearCompareToButton);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });
});
