import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DevelopmentGoalCompletionTypeHeader from '../../developmentGoalCompletionType/DevelopmentGoalCompletionTypeHeader';

describe('<DevelopmentGoalCompletionTypeHeader />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isSavingAllowed: false,
      onEditMode: jest.fn(),
      onCancelEdit: jest.fn(),
      onSaveEdit: jest.fn(),
      onAddNew: jest.fn(),
      showArchiveModal: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title', () => {
    render(<DevelopmentGoalCompletionTypeHeader {...baseProps} />);

    expect(
      screen.getByText('Development goal completion type')
    ).toBeInTheDocument();
  });

  it('displays the "View archived" action and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();

    render(
      <DevelopmentGoalCompletionTypeHeader {...baseProps} view="PRESENTATION" />
    );
    // The "View archived" action is inside a TooltipMenu. We first click the "more" button.
    const moreButton = screen.getAllByRole('button')[2]; // The third button is the "more" button
    await user.click(moreButton);

    const viewArchivedMenuItem = await screen.findByText('View archived');
    await user.click(viewArchivedMenuItem);

    expect(baseProps.showArchiveModal).toHaveBeenCalledTimes(1);
  });

  describe('when view is PRESENTATION', () => {
    beforeEach(() => {
      render(
        <DevelopmentGoalCompletionTypeHeader
          {...baseProps}
          view="PRESENTATION"
        />
      );
    });

    it('displays the "Add type" and "Edit values" buttons', () => {
      expect(
        screen.getByRole('button', { name: 'Add type' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Edit values' })
      ).toBeInTheDocument();
    });

    it('calls onAddNew when the "Add type" button is clicked', async () => {
      const user = userEvent.setup();
      const addButton = screen.getByRole('button', { name: 'Add type' });

      await user.click(addButton);

      expect(baseProps.onAddNew).toHaveBeenCalledTimes(1);
    });

    it('calls onEditMode when the "Edit values" button is clicked', async () => {
      const user = userEvent.setup();
      const editButton = screen.getByRole('button', { name: 'Edit values' });

      await user.click(editButton);

      expect(baseProps.onEditMode).toHaveBeenCalledTimes(1);
    });
  });

  describe('when view is EDIT', () => {
    beforeEach(() => {
      render(
        <DevelopmentGoalCompletionTypeHeader {...baseProps} view="EDIT" />
      );
    });

    it('displays the "Save" and "Cancel" buttons', () => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
    });

    it('disables the "Save" button when isSavingAllowed is false', () => {
      const saveButton = screen.getByText('Save').closest('button');

      expect(saveButton).toBeDisabled();
    });

    it('enables the "Save" button when isSavingAllowed is true', () => {
      // Re-render with the prop changed
      render(
        <DevelopmentGoalCompletionTypeHeader
          {...baseProps}
          view="EDIT"
          isSavingAllowed
        />
      );

      const saveButton = screen.getAllByText('Save')[1].closest('button');

      expect(saveButton).toBeEnabled();
    });

    it('calls onSaveEdit when the "Save" button is clicked', async () => {
      const user = userEvent.setup();
      // Re-render with save enabled to allow click
      render(
        <DevelopmentGoalCompletionTypeHeader
          {...baseProps}
          view="EDIT"
          isSavingAllowed
        />
      );

      const saveButton = screen.getAllByText('Save')[1].closest('button');

      await user.click(saveButton);

      expect(baseProps.onSaveEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onCancelEdit when the "Cancel" button is clicked', async () => {
      const user = userEvent.setup();
      const cancelButton = screen.getByText('Cancel').closest('button');

      await user.click(cancelButton);

      expect(baseProps.onCancelEdit).toHaveBeenCalledTimes(1);
    });
  });
});
