import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalCompletionTypeArchiveModal from '../../developmentGoalCompletionType/DevelopmentGoalCompletionTypeArchiveModal';
import { mockDevelopmentGoalCompletionTypes } from '../../utils/mocks';

describe('<DevelopmentGoalCompletionTypeArchiveModal />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isOpen: true,
      developmentGoalCompletionTypes: mockDevelopmentGoalCompletionTypes,
      onClose: jest.fn(),
      onUnarchive: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title', () => {
    render(<DevelopmentGoalCompletionTypeArchiveModal {...baseProps} />);

    expect(
      screen.getByText('Archived Development goal completion type')
    ).toBeInTheDocument();
  });

  it('displays the list of archived items with their names and an unarchive button', () => {
    render(<DevelopmentGoalCompletionTypeArchiveModal {...baseProps} />);

    // Check for the list heading
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('First goal completion type')).toBeInTheDocument();
    expect(screen.getByText('Second goal completion type')).toBeInTheDocument();
    expect(screen.getAllByText('Unarchive')).toHaveLength(2);
  });

  it('calls the correct callback when the unarchive button is clicked', async () => {
    const user = userEvent.setup();
    render(<DevelopmentGoalCompletionTypeArchiveModal {...baseProps} />);

    // Find the first list item and click its unarchive button
    expect(screen.getByText('First goal completion type')).toBeInTheDocument();
    const unarchiveButton = screen.getAllByText('Unarchive')[0]; // The first unarchive button

    await user.click(unarchiveButton);

    expect(baseProps.onUnarchive).toHaveBeenCalledTimes(1);
    expect(baseProps.onUnarchive).toHaveBeenCalledWith(
      mockDevelopmentGoalCompletionTypes[0].id
    );
  });

  it('displays the done button and calls the correct callback when clicking', async () => {
    const user = userEvent.setup();
    render(<DevelopmentGoalCompletionTypeArchiveModal {...baseProps} />);

    const doneButton = screen.getByText('Done').closest('button');

    expect(doneButton).toBeInTheDocument();

    await user.click(doneButton);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });
});
