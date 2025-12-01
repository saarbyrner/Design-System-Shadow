import { render, screen } from '@testing-library/react';
import RenameModal from '..';

// Mock the external components
jest.mock('@kitman/components', () => ({
  AppStatus: jest.fn(({ status, message }) =>
    status ? <div data-testid="app-status">{message}</div> : null
  ),
  ChooseNameModal: jest.fn(({ isOpen, title, label }) =>
    isOpen ? (
      <div data-testid="choose-name-modal">
        {title} - {label}
      </div>
    ) : null
  ),
}));

describe('<RenameModal />', () => {
  let props;

  beforeEach(() => {
    props = {
      value: 'Custom name',
      feedbackModalStatus: null,
      feedbackModalMessage: null,
      t: (key) => key,
    };
  });

  it('renders the component', () => {
    const { container } = render(<RenameModal {...props} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('when the rename modal is open', () => {
    beforeEach(() => {
      props.isRenameModalOpen = true;
    });

    it('renders a choose name modal', () => {
      render(<RenameModal {...props} />);
      expect(screen.getByTestId('choose-name-modal')).toBeInTheDocument();
    });
  });

  describe('when the feedback modal status is given', () => {
    beforeEach(() => {
      props.feedbackModalStatus = 'success';
    });

    it('renders a feedback modal', () => {
      render(<RenameModal {...props} />);
      expect(screen.getByTestId('app-status')).toBeInTheDocument();
    });
  });
});
