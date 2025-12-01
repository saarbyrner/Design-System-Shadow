import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActivityTypeDeleteModal from '../../activityType/ActivityTypeDeleteModal';
import {
  mockDeletionAvailabilityOk,
  mockDeletionAvailabilityKo,
} from '../../utils/mocks';

describe('<ActivityTypeDeleteModal />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isOpen: true, // Render the modal open for testing
      deletionAvailability: mockDeletionAvailabilityOk,
      onClose: jest.fn(),
      onDelete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title and default content when deletion is available', () => {
    render(<ActivityTypeDeleteModal {...baseProps} />);

    expect(screen.getByText('Delete activity type?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument();
  });

  it('displays the cancel button and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityTypeDeleteModal {...baseProps} />);
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays the delete button and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityTypeDeleteModal {...baseProps} />);
    const deleteButton = screen.getByText('Delete');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);
    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
  });

  describe('when deletion is not available', () => {
    beforeEach(() => {
      // Update props for this specific context
      baseProps.deletionAvailability = mockDeletionAvailabilityKo;
    });

    it('displays the correct content for a single associated activity', () => {
      render(<ActivityTypeDeleteModal {...baseProps} />);

      expect(
        screen.getByText(/This activity type is associated with/i)
      ).toBeInTheDocument();

      expect(screen.getByText('1 activity')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To delete this activity type remove it from the associated activities.'
        )
      ).toBeInTheDocument();
    });

    it('displays the correct content for multiple associated activities', () => {
      const updatedDeletionAvailability = {
        ...mockDeletionAvailabilityKo,
        activities_count: 3,
      };
      render(
        <ActivityTypeDeleteModal
          {...baseProps}
          deletionAvailability={updatedDeletionAvailability}
        />
      );

      expect(
        screen.getByText(/This activity type is associated with/i)
      ).toBeInTheDocument();
      expect(screen.getByText('3 activities')).toBeInTheDocument();
    });

    it('disables the delete button', () => {
      render(<ActivityTypeDeleteModal {...baseProps} />);

      const deleteButton = screen.getByText('Delete').closest('button');

      expect(deleteButton).toBeDisabled();
    });
  });
});
