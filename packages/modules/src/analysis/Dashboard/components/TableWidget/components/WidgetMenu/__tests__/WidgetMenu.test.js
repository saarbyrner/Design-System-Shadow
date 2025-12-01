import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WidgetMenu from '../index';

describe('WidgetMenu Component', () => {
  const props = {
    containerType: 'AnalyticalDashboard',
    showSummary: true,
  };

  it('renders a meatball menu with the correct items', async () => {
    const user = userEvent.setup();

    render(<WidgetMenu {...props} />);

    const button = screen.getByRole('button', { name: '' });
    await user.click(button);

    await waitFor(() => {
      const menuItems = screen.getAllByTestId('TooltipMenu|PrimaryListItem');
      expect(menuItems.length).toBe(4);
    });

    expect(await screen.findByText('Edit Table')).toBeInTheDocument();
    expect(await screen.findByText('Hide Summary')).toBeInTheDocument();
    expect(await screen.findByText('Duplicate Widget')).toBeInTheDocument();
    expect(await screen.findByText('Delete')).toBeInTheDocument();
  });

  it('does not contain duplicate widget when the container is HomeDashboard', async () => {
    const user = userEvent.setup();

    render(<WidgetMenu {...props} containerType="HomeDashboard" />);

    const button = screen.getByRole('button', { name: '' });

    await user.click(button);

    await waitFor(() => {
      const menuItems = screen.getAllByTestId('TooltipMenu|PrimaryListItem');
      expect(menuItems.length).toBe(3);
    });
    expect(await screen.findByText('Edit Table')).toBeInTheDocument();
    expect(await screen.findByText('Delete')).toBeInTheDocument();
  });

  it('calls onClickEditTableWidget when clicking Edit Table', async () => {
    const user = userEvent.setup();

    const mockEdit = jest.fn();
    render(<WidgetMenu {...props} onClickEditTableWidget={mockEdit} />);

    const button = screen.getByRole('button', { name: '' });
    await user.click(button);

    await waitFor(async () => {
      const editTableMenuItem = screen.getByRole('button', {
        name: 'Edit Table',
      });
      await user.click(editTableMenuItem);
    });

    expect(mockEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDuplicateTableWidget when clicking Duplicate Widget', async () => {
    const user = userEvent.setup();
    const mockDuplicate = jest.fn();

    render(
      <WidgetMenu {...props} onClickDuplicateTableWidget={mockDuplicate} />
    );

    const button = screen.getByRole('button', { name: '' });
    await user.click(button);

    await waitFor(async () => {
      const duplicateWidgetMenuItem = screen.getByRole('button', {
        name: 'Duplicate Widget',
      });
      await user.click(duplicateWidgetMenuItem);
    });

    expect(mockDuplicate).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDeleteTableWidget when clicking Delete', async () => {
    const user = userEvent.setup();
    const mockDelete = jest.fn();
    render(<WidgetMenu {...props} onClickDeleteTableWidget={mockDelete} />);

    const button = screen.getByRole('button', { name: '' });
    await user.click(button);

    await waitFor(async () => {
      const mockDeleteMenuItem = screen.getByRole('button', {
        name: 'Delete',
      });
      await user.click(mockDeleteMenuItem);
    });

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  describe('refresh cache', () => {
    beforeEach(() => {
      window.setFlag('rep-table-widget-caching', true);
    });

    afterEach(() => {
      window.setFlag('rep-table-widget-caching', false);
    });

    it('renders a meatball menu with the correct items', async () => {
      const user = userEvent.setup();
      render(<WidgetMenu {...props} />);
      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      await waitFor(() => {
        const menuItems = screen.getAllByTestId('TooltipMenu|PrimaryListItem');
        expect(menuItems.length).toBe(5);
      });

      expect(await screen.findByText('Edit Table')).toBeInTheDocument();
      expect(await screen.findByText('Hide Summary')).toBeInTheDocument();
      expect(await screen.findByText('Refresh Data')).toBeInTheDocument();
      expect(await screen.findByText('Duplicate Widget')).toBeInTheDocument();
      expect(await screen.findByText('Delete')).toBeInTheDocument();
    });

    it('shows the correct info for the Refresh Data when "rep-table-widget-caching" is true', async () => {
      const user = userEvent.setup();

      render(<WidgetMenu {...props} />);

      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      let refreshDataItem;
      await waitFor(() => {
        refreshDataItem = screen.getByRole('button', { name: 'Refresh Data' });
      });
      expect(refreshDataItem).toBeInTheDocument();
      const iconElement = refreshDataItem.querySelector('.icon-refresh');
      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass('icon-refresh');
    });

    it('calls onClickRefreshCache when clicking Refresh Data', async () => {
      const user = userEvent.setup();
      const mockClickRefreshCache = jest.fn();
      render(
        <WidgetMenu {...props} onClickRefreshCache={mockClickRefreshCache} />
      );

      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      await waitFor(async () => {
        const refreshDataItem = screen.getByRole('button', {
          name: 'Refresh Data',
        });
        await user.click(refreshDataItem);
      });

      expect(mockClickRefreshCache).toHaveBeenCalledTimes(1);
    });

    it('does not list Refresh Data in the menu when "rep-table-widget-caching" is false', async () => {
      const user = userEvent.setup();
      window.setFlag('rep-table-widget-caching', false);

      render(<WidgetMenu {...props} />);
      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      expect(screen.queryByText('Refresh Data')).not.toBeInTheDocument();
    });
  });

  describe('for the summary row', () => {
    it('calls shows the correct info for the Hide Summary Row Link when showSummary is true', async () => {
      const user = userEvent.setup();

      render(<WidgetMenu {...props} />);

      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      let hideSummaryItem;
      await waitFor(() => {
        hideSummaryItem = screen.getByRole('button', { name: 'Hide Summary' });
      });
      expect(hideSummaryItem).toBeInTheDocument();
      const iconElement = hideSummaryItem.querySelector('.icon-hide');
      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass('icon-hide');
    });

    it('calls shows the correct info for the Show Summary Row Link when showSummary is false', async () => {
      const user = userEvent.setup();

      render(<WidgetMenu {...props} showSummary={false} />);

      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      let showSummaryItem;
      await waitFor(() => {
        showSummaryItem = screen.getByRole('button', { name: 'Show Summary' });
      });
      expect(showSummaryItem).toBeInTheDocument();
      const iconElement = showSummaryItem.querySelector('.icon-show');
      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass('icon-show');
    });

    it('calls onClickShowHideSummary when clicking Show or Hide Summary', async () => {
      const user = userEvent.setup();
      const mockShowHideSummary = jest.fn();

      render(
        <WidgetMenu {...props} onClickShowHideSummary={mockShowHideSummary} />
      );

      const button = screen.getByRole('button', { name: '' });
      await user.click(button);

      await waitFor(async () => {
        const hideShowSummaryItem = screen.getByRole('button', {
          name: 'Hide Summary',
        });
        await user.click(hideShowSummaryItem);
      });

      expect(mockShowHideSummary).toHaveBeenCalledTimes(1);
    });
  });
});
