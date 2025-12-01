import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardSelectorModal from '..';

jest.mock('@kitman/components', () => ({
  Dropdown: jest.fn((props) => (
    <div
      data-testid="dropdown"
      data-items={JSON.stringify(props.items)}
      data-label={props.label}
      data-value={props.value}
      onClick={() => props.onChange && props.onChange('5')}
    >
      Dropdown
    </div>
  )),
  LegacyModal: jest.fn((props) => (
    <div
      data-testid="modal"
      data-is-open={props.isOpen}
      data-title={props.title}
      onClick={() => props.close && props.close()}
    >
      {props.children}
    </div>
  )),
  TextButton: jest.fn((props) => (
    <button
      type="button"
      data-testid={`text-button-${props.type}`}
      data-text={props.text}
      data-type={props.type}
      onClick={() => props.onClick && props.onClick()}
    >
      {props.text}
    </button>
  )),
}));

describe('Graph Composer <DashboardSelectorModal /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      isOpen: true,
      dashboardList: [
        {
          id: '4',
          title: 'Dashboard Name',
        },
        {
          id: '5',
          title: 'Other Dashboard Name',
        },
      ],
      selectedDashboard: '4',
      closeModal: jest.fn(),
      onConfirm: jest.fn(),
      onChange: jest.fn(),
      t: (text) => text,
    };
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<DashboardSelectorModal {...props} />);

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('data-is-open', 'true');
    expect(modal).toHaveAttribute('data-title', 'Save Graph');

    const dropdown = screen.getByTestId('dropdown');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveAttribute(
      'data-items',
      JSON.stringify(props.dashboardList)
    );
    expect(dropdown).toHaveAttribute('data-label', 'Choose Dashboard');
    expect(dropdown).toHaveAttribute('data-value', '4');

    const cancelBtn = screen.getByTestId('text-button-secondary');
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveAttribute('data-text', 'Cancel');
    expect(cancelBtn).toHaveAttribute('data-type', 'secondary');

    const confirmBtn = screen.getByTestId('text-button-primary');
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn).toHaveAttribute('data-text', 'Save');
    expect(confirmBtn).toHaveAttribute('data-type', 'primary');
  });

  describe('when selecting a dashboard', () => {
    it('calls onChange with the correct parameter', async () => {
      const user = userEvent.setup();
      render(<DashboardSelectorModal {...props} />);

      const dropdown = screen.getByTestId('dropdown');
      await user.click(dropdown);

      expect(props.onChange).toHaveBeenCalledWith('5');
    });
  });

  describe('when clicking the confirm button', () => {
    it('calls onConfirm', async () => {
      const user = userEvent.setup();
      render(<DashboardSelectorModal {...props} />);

      const confirmBtn = screen.getByTestId('text-button-primary');
      await user.click(confirmBtn);

      expect(props.onConfirm).toHaveBeenCalled();
    });
  });

  describe('when clicking the cancel button', () => {
    it('calls closeModal', async () => {
      const user = userEvent.setup();
      render(<DashboardSelectorModal {...props} />);

      const cancelBtn = screen.getByTestId('text-button-secondary');
      await user.click(cancelBtn);

      expect(props.closeModal).toHaveBeenCalled();
    });
  });

  describe('when clicking the cross icon of the modal', () => {
    it('calls closeModal', async () => {
      const user = userEvent.setup();
      render(<DashboardSelectorModal {...props} />);

      const modal = screen.getByTestId('modal');
      await user.click(modal);

      expect(props.closeModal).toHaveBeenCalled();
    });
  });
});
