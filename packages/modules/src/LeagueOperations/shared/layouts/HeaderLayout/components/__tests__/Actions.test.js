import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Actions } from '../Actions';

const mockActions = [
  {
    id: 'action-1',
    label: 'Edit',
    isDisabled: false,
    onClick: jest.fn(),
    isCollapsible: false,
  },
  {
    id: 'action-2',
    label: 'Delete',
    isDisabled: true,
    onClick: jest.fn(),
    isCollapsible: false,
  },
  {
    id: 'action-3',
    label: 'Share',
    isDisabled: false,
    onClick: jest.fn(),
    isCollapsible: true,
  },
];

describe('<Actions />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop view', () => {
    test('renders all actions with correct labels', () => {
      render(<Actions actions={mockActions} />);

      const container = screen.getByTestId('reg-req-header-desktop-actions');

      expect(within(container).getByText('Edit')).toBeInTheDocument();
      expect(within(container).getByText('Delete')).toBeInTheDocument();
      expect(within(container).getByText('Share')).toBeInTheDocument();
    });

    test('enables and disables buttons based on isDisabled prop', () => {
      render(<Actions actions={mockActions} />);

      const container = screen.getByTestId('reg-req-header-desktop-actions');

      expect(within(container).getByText('Edit')).toBeEnabled();
      expect(within(container).getByText('Delete')).toBeDisabled();
      expect(within(container).getByText('Share')).toBeEnabled();
    });
  });

  describe('Mobile view', () => {
    beforeEach(() => {
      window.innerWidth = 400;
    });

    afterEach(() => {
      window.innerWidth = 1400;
    });

    test('wraps excess actions into dropdown when more than 2 actions', async () => {
      const user = userEvent.setup();

      render(<Actions actions={mockActions} />);

      const container = screen.getByTestId('reg-req-header-mobile-actions');

      expect(within(container).getByText('Edit')).toBeInTheDocument();
      expect(within(container).getByText('Delete')).toBeInTheDocument();

      // only one hidden action for desktop view should be rendered
      expect(screen.getByText('Share')).toBeInTheDocument();

      const dropdownTrigger = screen.getByTestId('header-mobile-actions');
      await user.click(dropdownTrigger);

      // once trigger pressed, we render dropdown option
      expect(screen.getAllByText('Share')).toHaveLength(2);
    });

    test('does not render dropdown when there are only 2 actions', () => {
      render(<Actions actions={mockActions.slice(0, 2)} />);

      const container = screen.getByTestId('reg-req-header-mobile-actions');

      expect(within(container).getByText('Edit')).toBeEnabled();
      expect(within(container).getByText('Delete')).toBeDisabled();

      expect(
        screen.queryByTestId('header-mobile-actions')
      ).not.toBeInTheDocument();
    });
  });
});
