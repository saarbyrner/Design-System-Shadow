import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteReviewDeleteModal from '../AthleteReviewDeleteModal';

describe('AthleteReviewDeleteModal', () => {
  const defaultProps = {
    isOpen: true,
    deleteTitle: 'Test Title',
    deleteDescription: 'Test Description',
    onDelete: jest.fn(),
    closeModal: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<AthleteReviewDeleteModal {...props} />);

  describe('initial render', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('renders the title', () => {
      expect(screen.getByText(defaultProps.deleteTitle)).toBeInTheDocument();
    });

    it('renders the description', () => {
      expect(
        screen.getByText(defaultProps.deleteDescription)
      ).toBeInTheDocument();
    });

    it('renders the buttons', () => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('render actions', () => {
    it('clicking cancel fires the close modal', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Cancel'));
      expect(defaultProps.closeModal).toHaveBeenCalled();
    });

    it('clicking Delete fires the delete call', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Delete'));
      expect(defaultProps.onDelete).toHaveBeenCalled();
      expect(defaultProps.closeModal).toHaveBeenCalled();
    });
  });
});
