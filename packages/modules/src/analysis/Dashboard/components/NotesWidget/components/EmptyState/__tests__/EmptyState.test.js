import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../index';

describe('<EmptyState />', () => {
  const defaultProps = {
    canCreateNotes: true,
    isArchiveView: false,
    onClickAddNote: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the add note button if there are no notes', () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByText('Add Note')).toBeInTheDocument();
  });

  it('calls the correct prop when clicking add note button', async () => {
    const user = userEvent.setup();
    const mockOnAddNote = jest.fn();

    render(<EmptyState {...defaultProps} onClickAddNote={mockOnAddNote} />);

    await user.click(screen.getByText('Add Note'));

    expect(mockOnAddNote).toHaveBeenCalledTimes(1);
  });

  it('displays a message but does not display the empty state if the user does not have canCreateNotes', () => {
    render(<EmptyState {...defaultProps} canCreateNotes={false} />);

    expect(screen.queryByText('Add Note')).not.toBeInTheDocument();
    expect(screen.getByText('There are no notes')).toBeInTheDocument();
  });

  describe('when in archive view', () => {
    it('does not show the add note button', () => {
      render(<EmptyState {...defaultProps} isArchiveView />);

      expect(screen.queryByText('Add Note')).not.toBeInTheDocument();
    });

    it('displays the correct message', () => {
      render(<EmptyState {...defaultProps} isArchiveView />);

      expect(
        screen.getByText('There are no archived notes')
      ).toBeInTheDocument();
    });
  });
});
