import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import WidgetMenu from '../index';

jest.mock('@kitman/common/src/utils', () => ({
  TrackEvent: jest.fn(),
  searchParams: jest.fn(() => null),
  getIsLocalStorageAvailable: jest.fn(() => true),
  isDevEnvironment: jest.fn(() => false),
}));

describe('<WidgetMenu />', () => {
  const defaultProps = {
    containerType: 'AnalyticalDashboard',
    isArchiveView: false,
    onClickDuplicate: jest.fn(),
    onClickNotesWidgetSettings: jest.fn(),
    onClickRemoveNotesWidget: jest.fn(),
    onClickViewArchivedNotes: jest.fn(),
    onClickAddNotes: jest.fn(),
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

    await waitFor(() => {
      expect(screen.getByText('Notes Widget Settings')).toBeInTheDocument();
    });

    expect(screen.getByText('Notes Widget Settings')).toBeInTheDocument();
    expect(screen.getByText('View Archived Notes')).toBeInTheDocument();
    expect(screen.getByText('Duplicate Widget')).toBeInTheDocument();
    expect(screen.getByText('Remove Notes Widget')).toBeInTheDocument();
  });

  it('does not contain duplicate widget when the container is HomeDashboard', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <WidgetMenu {...defaultProps} containerType="HomeDashboard" />
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Notes Widget Settings')).toBeInTheDocument();
    });

    expect(screen.queryByText('Duplicate Widget')).not.toBeInTheDocument();
  });

  it('calls onClickNotesWidgetSettings when clicking Notes Widget Settings', async () => {
    const user = userEvent.setup();
    const mockEdit = jest.fn();
    renderWithStore(
      <WidgetMenu {...defaultProps} onClickNotesWidgetSettings={mockEdit} />
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Notes Widget Settings')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Notes Widget Settings'));
    expect(mockEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onClickViewArchivedNotes when clicking View Archived Notes', async () => {
    const user = userEvent.setup();
    const mockViewArchived = jest.fn();
    renderWithStore(
      <WidgetMenu
        {...defaultProps}
        onClickViewArchivedNotes={mockViewArchived}
      />
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('View Archived Notes')).toBeInTheDocument();
    });

    await user.click(screen.getByText('View Archived Notes'));
    expect(mockViewArchived).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDuplicate when clicking Duplicate Widget', async () => {
    const user = userEvent.setup();
    const mockDuplicate = jest.fn();
    renderWithStore(
      <WidgetMenu {...defaultProps} onClickDuplicate={mockDuplicate} />
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Duplicate Widget')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Duplicate Widget'));
    expect(mockDuplicate).toHaveBeenCalledTimes(1);
  });

  it('calls onClickRemoveNotesWidget when clicking Remove Notes Widget', async () => {
    const user = userEvent.setup();
    const mockRemove = jest.fn();
    renderWithStore(
      <WidgetMenu {...defaultProps} onClickRemoveNotesWidget={mockRemove} />
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Remove Notes Widget')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Remove Notes Widget'));
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  describe('archived notes view', () => {
    it('renders a meatball menu with the correct items', async () => {
      const user = userEvent.setup();
      renderWithStore(<WidgetMenu {...defaultProps} isArchiveView />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Notes Widget Settings')).toBeInTheDocument();
      });

      expect(screen.queryByText('View Archived Notes')).not.toBeInTheDocument();
    });
  });
});
