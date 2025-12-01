import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalTypeDeleteModal from '../../developmentGoalType/DevelopmentGoalTypeDeleteModal';

describe('<DevelopmentGoalTypeDeleteModal />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isOpen: true, // Render the modal open for testing
      onClose: jest.fn(),
      onDelete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title and content', () => {
    render(<DevelopmentGoalTypeDeleteModal {...baseProps} />);

    expect(
      screen.getByText('Delete development goal type?')
    ).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument();
  });

  it('displays the cancel button and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();

    render(<DevelopmentGoalTypeDeleteModal {...baseProps} />);

    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays the delete button and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();

    render(<DevelopmentGoalTypeDeleteModal {...baseProps} />);

    const deleteButton = screen.getByText('Delete');

    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);

    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
  });
});
