import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DrillLabelsDeleteModal from '../../drillLabels/DrillLabelsDeleteModal';
import {
  mockDeletionFromDrillsAvailabilityOk,
  mockDeletionFromDrillsAvailabilityKo,
} from '../../utils/mocks';

describe('<DrillLabelsDeleteModal />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isOpen: true, // Render the modal open for testing
      deletionAvailability: mockDeletionFromDrillsAvailabilityOk,
      onClose: jest.fn(),
      onDelete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title and default content', () => {
    render(<DrillLabelsDeleteModal {...baseProps} />);

    expect(screen.getByText('Delete drill label?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument();
  });

  it('displays the cancel button and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();
    render(<DrillLabelsDeleteModal {...baseProps} />);
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays the delete button and calls the correct callback when clicked', async () => {
    const user = userEvent.setup();
    render(<DrillLabelsDeleteModal {...baseProps} />);
    const deleteButton = screen.getByText('Delete');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);
    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
  });

  describe('when deletion is not available', () => {
    beforeEach(() => {
      // Update props for this specific context
      baseProps.deletionAvailability = mockDeletionFromDrillsAvailabilityKo;
    });

    it('displays the correct content for a single associated drill', () => {
      render(<DrillLabelsDeleteModal {...baseProps} />);

      expect(
        screen.getByText(/This drill label is associated with/i)
      ).toBeInTheDocument();
      expect(screen.getByText('1 drill')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To delete this drill label remove it from the associated drills.'
        )
      ).toBeInTheDocument();
    });

    it('displays the correct content for multiple associated drills', () => {
      const updatedDeletionAvailability = {
        ...mockDeletionFromDrillsAvailabilityKo,
        activities_count: 3,
      };
      render(
        <DrillLabelsDeleteModal
          {...baseProps}
          deletionAvailability={updatedDeletionAvailability}
        />
      );

      expect(
        screen.getByText(/This drill label is associated with/i)
      ).toBeInTheDocument();
      expect(screen.getByText('3 drills')).toBeInTheDocument();
    });

    it('disables the delete button', () => {
      render(<DrillLabelsDeleteModal {...baseProps} />);
      const deleteButton = screen.getByText('Delete').closest('button');
      expect(deleteButton).toBeDisabled();
    });
  });
});
