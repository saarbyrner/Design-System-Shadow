import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import Clubs from '..';

jest.mock('@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter');

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|Clubs', () => {
  const mockSetFilter = jest.fn();

  beforeEach(() => {
    useFilter.mockImplementation(() => {
      return {
        filter: [true],
        setFilter: mockSetFilter,
      };
    });
  });
  it('renders the Clubs component', () => {
    render(<Clubs {...props} />);

    const national = screen.getByText('National');
    const clubs = screen.getByText('My club');
    const checkboxes = screen.getAllByRole('checkbox');

    expect(national).toBeInTheDocument();
    expect(clubs).toBeInTheDocument();
    expect(checkboxes[0]).toBeInTheDocument();
    expect(checkboxes[1]).toBeInTheDocument();
  });

  it('renders the checkbox prefilled from the useFilter hook', () => {
    render(<Clubs {...props} />);

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
  });

  it('calls setFilter when option(s) are selected', async () => {
    const user = userEvent.setup();
    render(<Clubs {...props} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockSetFilter).toHaveBeenCalledWith(false);
  });

  it('should render validation text if prop passed', () => {
    const errorMessage = 'This is an error';
    render(<Clubs {...props} isValid={false} errorMessage={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
