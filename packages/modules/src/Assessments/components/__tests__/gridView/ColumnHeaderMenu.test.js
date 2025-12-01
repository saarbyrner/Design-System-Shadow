import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { ColumnHeaderMenuTranslated as ColumnHeaderMenu } from '../../gridView/ColumnHeaderMenu';

describe('ColumnHeaderMenu component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      name: 'Strength',
      onDelete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders correctly and displays the received name', () => {
    render(<ColumnHeaderMenu {...baseProps} />);

    const allStrengthButtons = screen.getAllByRole('button', {
      name: 'Strength',
    });
    const displayerButton = allStrengthButtons.find(
      (el) => el.tagName.toLowerCase() === 'button'
    );

    expect(displayerButton).toBeInTheDocument();
  });

  describe('when hovering', () => {
    it('shows and hides the tooltip trigger on mouse enter and leave', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColumnHeaderMenu {...baseProps} />);

      const allStrengthButtons = screen.getAllByRole('button', {
        name: 'Strength',
      });
      const nameDisplayer = allStrengthButtons.find(
        (el) => el.tagName.toLowerCase() === 'button'
      );

      const triggerButton = container.querySelector(
        '.groupedAssessment__columnHeaderMenuTrigger'
      );
      expect(triggerButton).not.toHaveClass(
        'groupedAssessment__columnHeaderMenuTrigger--showed'
      );

      // Hover over the component to show the trigger
      await user.hover(nameDisplayer);
      expect(triggerButton).toHaveClass(
        'groupedAssessment__columnHeaderMenuTrigger--showed'
      );

      // Move the mouse away to hide it again
      await user.unhover(nameDisplayer);
      expect(triggerButton).not.toHaveClass(
        'groupedAssessment__columnHeaderMenuTrigger--showed'
      );
    });
  });

  describe('when deleting an item', () => {
    it('calls props.onDelete when the delete option is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColumnHeaderMenu {...baseProps} />);

      const allStrengthButtons = screen.getAllByRole('button', {
        name: 'Strength',
      });
      const nameDisplayer = allStrengthButtons.find(
        (el) => el.tagName.toLowerCase() === 'button'
      );

      // 1. Hover over the component to make the trigger button visible
      await user.hover(nameDisplayer);

      // 2. Click the trigger button to open the menu
      const triggerButton = container.querySelector(
        '.groupedAssessment__columnHeaderMenuTrigger'
      );
      await user.click(triggerButton);

      // 3. Find and click the "Delete" button in the menu that appears
      const deleteButton = await screen.findByRole('button', {
        name: 'Delete',
      });
      await user.click(deleteButton);

      // 4. Assert that the onDelete callback was fired
      expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
    });
  });
});
