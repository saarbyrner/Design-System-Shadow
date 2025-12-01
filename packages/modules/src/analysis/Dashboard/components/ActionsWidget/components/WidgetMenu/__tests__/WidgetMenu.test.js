import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import WidgetMenu from '../index';

describe('<WidgetMenu />', () => {
  const mockOnClickDuplicateWidget = jest.fn();
  const mockOnClickWidgetSettings = jest.fn();
  const mockOnClickRemoveWidget = jest.fn();

  const defaultProps = {
    containerType: 'AnalyticalDashboard',
    onClickDuplicateWidget: mockOnClickDuplicateWidget,
    onClickWidgetSettings: mockOnClickWidgetSettings,
    onClickRemoveWidget: mockOnClickRemoveWidget,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a meatball menu with the correct items', async () => {
    const user = userEvent.setup();
    renderWithStore(<WidgetMenu {...defaultProps} />);

    const menuButton = screen.getByRole('button');
    expect(menuButton).toHaveClass('widgetMenu');
    await user.click(menuButton);

    expect(screen.getByText('Actions Widget Settings')).toBeInTheDocument();
    expect(screen.getByText('Duplicate Widget')).toBeInTheDocument();
    expect(screen.getByText('Remove Actions Widget')).toBeInTheDocument();
  });

  it('does not contain duplicate widget when the container is HomeDashboard', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <WidgetMenu {...defaultProps} containerType="HomeDashboard" />
    );

    const menuButton = screen.getByRole('button');
    await user.click(menuButton);

    expect(screen.getByText('Actions Widget Settings')).toBeInTheDocument();
    expect(screen.getByText('Remove Actions Widget')).toBeInTheDocument();
    expect(screen.queryByText('Duplicate Widget')).not.toBeInTheDocument();
  });

  it('calls onClickWidgetSettings when clicking Widget Settings', async () => {
    const user = userEvent.setup();
    renderWithStore(<WidgetMenu {...defaultProps} />);

    const menuButton = screen.getByRole('button');
    await user.click(menuButton);

    const settingsItem = screen.getByText('Actions Widget Settings');
    await user.click(settingsItem);

    expect(mockOnClickWidgetSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDuplicateWidget when clicking Duplicate Widget', async () => {
    const user = userEvent.setup();
    renderWithStore(<WidgetMenu {...defaultProps} />);

    const menuButton = screen.getByRole('button');
    await user.click(menuButton);

    const duplicateItem = screen.getByText('Duplicate Widget');
    await user.click(duplicateItem);

    expect(mockOnClickDuplicateWidget).toHaveBeenCalledTimes(1);
  });

  it('calls onClickRemoveWidget when clicking Remove Widget', async () => {
    const user = userEvent.setup();
    renderWithStore(<WidgetMenu {...defaultProps} />);

    const menuButton = screen.getByRole('button');
    await user.click(menuButton);

    const removeItem = screen.getByText('Remove Actions Widget');
    await user.click(removeItem);

    expect(mockOnClickRemoveWidget).toHaveBeenCalledTimes(1);
  });
});
