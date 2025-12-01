import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PrinciplesDeleteModal from '../../principles/PrinciplesDeleteModal';
import {
  mockDeletionAvailabilityOk,
  mockDeletionAvailabilityKo,
} from '../../utils/mocks';

describe('<PrinciplesDeleteModal />', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      isOpen: true,
      deletionAvailability: mockDeletionAvailabilityOk,
      onDelete: jest.fn(),
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title and default content', () => {
    render(<PrinciplesDeleteModal {...baseProps} />);

    expect(screen.getByText('Delete principle?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument();
  });

  it('displays the cancel button and calls the onClose callback when clicked', async () => {
    render(<PrinciplesDeleteModal {...baseProps} />);
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays the delete button and calls the onDelete callback when clicked', async () => {
    render(<PrinciplesDeleteModal {...baseProps} />);
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
      render(<PrinciplesDeleteModal {...baseProps} />);

      expect(
        screen.getByText('This principle is associated with')
      ).toBeInTheDocument();
      expect(screen.getByText('1 activity')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To delete this principle remove it from the associated activities.'
        )
      ).toBeInTheDocument();
    });

    it('displays the correct content for multiple associated activities', () => {
      const updatedDeletionAvailability = {
        ...mockDeletionAvailabilityKo,
        activities_count: 3,
      };
      render(
        <PrinciplesDeleteModal
          {...baseProps}
          deletionAvailability={updatedDeletionAvailability}
        />
      );

      expect(
        screen.getByText('This principle is associated with')
      ).toBeInTheDocument();
      expect(screen.getByText('3 activities')).toBeInTheDocument();
    });

    it('disables the delete button', () => {
      render(
        <PrinciplesDeleteModal
          {...baseProps}
          deletionAvailability={{ ok: false }}
        />
      );

      const deleteButton = screen.getByText('Delete').closest('button');
      expect(deleteButton).toBeDisabled();
    });
  });
});
