import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import DuplicatingStatus from '../Component';

describe('<DuplicatingStatus />', () => {
  const props = {
    reload: jest.fn(),
    cancel: jest.fn(),
    numRows: 5,
    isLoading: false,
    hasErrored: false,
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading column when isLoading is true', () => {
    renderWithStore(
      <table>
        <DuplicatingStatus {...props} isLoading />
      </table>
    );

    expect(screen.getByRole('rowgroup')).toHaveClass(
      'tableWidget__column',
      'tableWidget__loadingColumn'
    );
  });

  it('renders error column when hasErrored is true', () => {
    renderWithStore(
      <table>
        <DuplicatingStatus {...props} hasErrored />
      </table>
    );

    expect(screen.getByRole('rowgroup')).toHaveClass('tableWidget__column');
    expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
  });

  it('in error state it calls reload prop when clicking reload button', async () => {
    const user = userEvent.setup();
    const mockReload = jest.fn();

    renderWithStore(
      <table>
        <DuplicatingStatus {...props} hasErrored reload={mockReload} />
      </table>
    );

    const reloadButton = screen.getByText('Reload');
    await user.click(reloadButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('in error state it calls cancel prop when clicking cancel button', async () => {
    const user = userEvent.setup();
    const mockCancel = jest.fn();

    renderWithStore(
      <table>
        <DuplicatingStatus {...props} hasErrored cancel={mockCancel} />
      </table>
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
