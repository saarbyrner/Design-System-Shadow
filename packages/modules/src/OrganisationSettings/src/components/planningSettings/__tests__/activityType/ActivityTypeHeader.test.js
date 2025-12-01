import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActivityTypeHeader from '../../activityType/ActivityTypeHeader';

describe('<ActivityTypeHeader />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isSavingAllowed: false,
      onEditMode: jest.fn(),
      onCancelEdit: jest.fn(),
      onSaveEdit: jest.fn(),
      onAddNew: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title', () => {
    render(<ActivityTypeHeader {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Activity type' })
    ).toBeInTheDocument();
  });

  describe('when view is PRESENTATION', () => {
    beforeEach(() => {
      render(<ActivityTypeHeader {...baseProps} view="PRESENTATION" />);
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
      render(<ActivityTypeHeader {...baseProps} view="EDIT" />);
    });

    it('displays the "Save" and "Cancel" buttons', () => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
    });

    it('disables the "Save" button when isSavingAllowed is false', () => {
      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();
    });

    it('enables the "Save" button when isSavingAllowed is true', () => {
      // Re-render with the prop changed
      render(<ActivityTypeHeader {...baseProps} view="EDIT" isSavingAllowed />);

      const saveButton = screen.getAllByRole('button', { name: 'Save' })[1];
      expect(saveButton).toBeEnabled();
    });

    it('calls onSaveEdit when the "Save" button is clicked', async () => {
      const user = userEvent.setup();
      // Re-render with save enabled to allow click
      render(<ActivityTypeHeader {...baseProps} view="EDIT" isSavingAllowed />);
      const saveButton = screen.getAllByRole('button', { name: 'Save' })[1];
      await user.click(saveButton);
      expect(baseProps.onSaveEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onCancelEdit when the "Cancel" button is clicked', async () => {
      const user = userEvent.setup();
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);
      expect(baseProps.onCancelEdit).toHaveBeenCalledTimes(1);
    });
  });
});
