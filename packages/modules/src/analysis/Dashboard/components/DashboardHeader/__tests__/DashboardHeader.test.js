import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ReactRedux from 'react-redux';
import $ from 'jquery';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import * as dashboardUtils from '@kitman/modules/src/analysis/Dashboard/utils';
import DashboardHeader from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('@kitman/common/src/hooks', () => ({
  useBrowserTabTitle: jest.fn(),
}));

describe('Analytical Dashboard <DashboardHeader /> component', () => {
  window.featureFlags = {};

  const props = {
    containerType: 'AnalyticalDashboard',
    dashboard: {
      id: '4',
      name: 'Dashboard Name',
    },
    dashboardList: [
      {
        id: '4',
        name: 'Dashboard Name',
      },
      {
        id: '5',
        name: 'Other Dashboard Name',
      },
    ],
    isDashboardManager: true,
    updateDashboard: jest.fn(),
    openDuplicateModal: jest.fn(),
    openReorderModal: jest.fn(),
    openPrintBuilder: jest.fn(),
    refreshDashboard: jest.fn(),
    pivotedAthletes: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    pivotedDateRange: {
      start_date: '2019-01-30T00:00:00Z',
      end_date: '2019-01-30T00:00:00Z',
    },
    pivotedTimePeriod: '',
    squadAthletes: {
      position_groups: [],
    },
    squads: [],
    toggleSlidingPanel: jest.fn(),
    orgLogoPath: '/org_logopath.png',
    orgName: 'Org name',
    squadName: 'Squad Name',
    t: (key) => key,
  };

  let trackEventMock;
  let ajaxSpy;

  beforeEach(() => {
    trackEventMock = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: trackEventMock,
    });
    ajaxSpy = jest.spyOn($, 'ajax');
    const deferred = $.Deferred();
    ajaxSpy.mockImplementation(() => deferred.resolve({ id: 32 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithStore(<DashboardHeader {...props} />);

    const header = screen.getByText('Dashboard Name');
    expect(header).toBeInTheDocument();
  });

  it('opens the confirm delete modal when clicking the delete button and closes it when clicking the close button', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<DashboardHeader {...props} />);

    const settingsButton = container.querySelector(
      '.textButton--kitmanDesignSystem--iconOnly'
    );

    await user.click(settingsButton);
    await user.click(screen.getByText('Delete Dashboard'));

    expect(screen.getByText('Delete')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  it('opens the rename dashboard modal when clicking the rename button and closes it when clicking the close button', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<DashboardHeader {...props} />);

    const settingsButton = container.querySelector(
      '.textButton--kitmanDesignSystem--iconOnly'
    );

    await user.click(settingsButton);
    await user.click(screen.getByText('Rename Dashboard'));

    expect(screen.getByText('Rename')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByText('Rename')).not.toBeInTheDocument();
    });
  });

  it('renders an add dashboard modal', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<DashboardHeader {...props} />);

    const settingsButton = container.querySelector(
      '.textButton--kitmanDesignSystem--iconOnly'
    );

    await user.click(settingsButton);
    await user.click(screen.getByText('Add New Dashboard'));

    expect(screen.queryByText('New Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('updates the add dashboard modal states correctly when adding a new dashboard', async () => {
    const user = userEvent.setup();

    const { container } = renderWithStore(<DashboardHeader {...props} />);

    const settingsButton = container.querySelector(
      '.textButton--kitmanDesignSystem--iconOnly'
    );

    await user.click(settingsButton);
    await user.click(screen.getByText('Add New Dashboard'));

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, {
      target: { value: 'Test Dashboard' },
    });
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(screen.getByText('Add New Dashboard')).not.toBeVisible();
    });
  });

  it('renders the AddWidgetDropdown component', () => {
    renderWithStore(<DashboardHeader {...props} />);

    const addWidgetDropdown = screen.getByText('Add widget');
    expect(addWidgetDropdown).toBeInTheDocument();
  });

  it('does not show the add widget dropdown when the user is not a dashboard manager', () => {
    renderWithStore(<DashboardHeader {...props} isDashboardManager={false} />);

    expect(screen.queryByText('Add Widget')).not.toBeInTheDocument();
  });

  it('calls trackEvent with "Print Dashboard" when print is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<DashboardHeader {...props} />);

    const printButton = screen.getByText('Print');
    await user.click(printButton);

    expect(trackEventMock).toHaveBeenCalledWith('Print Dashboard');
  });

  describe('when the hide-pivot-graphing-dashboard is true', () => {
    beforeEach(() => {
      window.setFlag('hide-pivot-graphing-dashboard', true);
    });

    afterEach(() => {
      window.setFlag('hide-pivot-graphing-dashboard', false);
    });

    it('does not render the pivot dashboard button if the hide feature flag is true', () => {
      renderWithStore(<DashboardHeader {...props} />);

      expect(screen.queryByText('Add Widget')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Pivot' })
      ).not.toBeInTheDocument();

      // Only the Print button should be visible
      expect(
        screen.queryByRole('button', { name: 'Print' })
      ).toBeInTheDocument();
    });
  });

  it("opens the duplicate dashboard modal when clicking the 'duplicate dashboard' button", async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<DashboardHeader {...props} />);

    const settingsButton = container.querySelector(
      '.textButton--kitmanDesignSystem--iconOnly'
    );

    await user.click(settingsButton);
    await user.click(screen.getByText('Duplicate Dashboard'));

    expect(screen.getByText('Dashboard Name')).toBeVisible();
  });

  it("opens the delete dashboard modal when clicking the 'Delete Dashboard' button", async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<DashboardHeader {...props} />);

    const settingsButton = container.querySelector(
      '.textButton--kitmanDesignSystem--iconOnly'
    );

    await user.click(settingsButton);
    await user.click(screen.getByText('Delete Dashboard'));

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  describe('when the dashboard is empty', () => {
    it('disables the customize layout item', async () => {
      const user = userEvent.setup();
      const { container } = renderWithStore(<DashboardHeader {...props} />);

      const settingsButton = container.querySelector(
        '.textButton--kitmanDesignSystem--iconOnly'
      );

      await user.click(settingsButton);
      expect(screen.queryByText('Customize Layout')).not.toBeInTheDocument();
    });
  });

  it('calls the correct callback when the print button is clicked', async () => {
    const user = userEvent.setup();
    const mockOpenPrintBuilder = jest.fn();
    renderWithStore(
      <DashboardHeader {...props} openPrintBuilder={mockOpenPrintBuilder} />
    );

    const printButton = screen.getByText('Print');
    await user.click(printButton);

    await waitFor(() => {
      expect(mockOpenPrintBuilder).toHaveBeenCalledTimes(1);
    });
  });

  describe('when user is on the homepage', () => {
    it('shows the organisation and squad informations', () => {
      renderWithStore(
        <DashboardHeader {...props} containerType="HomeDashboard" />
      );

      expect(screen.getByText('Org name - Squad Name')).toBeVisible();
    });

    it('shows the correct settings menu items', async () => {
      const user = userEvent.setup();
      const { container } = renderWithStore(
        <DashboardHeader {...props} containerType="HomeDashboard" />
      );

      const settingsButton = container.querySelector(
        '.textButton--kitmanDesignSystem--iconOnly'
      );

      await user.click(settingsButton);

      expect(
        screen.getByRole('button', { name: 'Customise Layout' })
      ).toBeInTheDocument();
      expect(screen.queryByText('Add New Dashbaord')).not.toBeInTheDocument();
    });

    it('does not show the pivot button', () => {
      renderWithStore(
        <DashboardHeader {...props} containerType="HomeDashboard" />
      );

      expect(
        screen.queryByRole('button', { name: 'Pivot' })
      ).not.toBeInTheDocument();
    });
  });

  describe('refresh dashboard', () => {
    const baseSelectorValue = {
      effectiveLoadingStatus: ['SUCCESS'],
      cachedAtTimestamp: '2025-01-01T00:00:00.000Z',
    };

    beforeEach(() => {
      window.setFlag('rep-table-widget-caching', true);
      window.setFlag('rep-charts-v2-caching', true);
    });

    afterEach(() => {
      jest.restoreAllMocks();
      window.setFlag('rep-table-widget-caching', false);
      window.setFlag('rep-charts-v2-caching', false);
    });

    const mockSelectorReturn = (override) => {
      jest
        .spyOn(ReactRedux, 'useSelector')
        .mockImplementation(() => ({ ...baseSelectorValue, ...override }));
    };

    it('hides container when dashboard is pivoted (isDashboardPivoted true)', () => {
      mockSelectorReturn();
      jest.spyOn(dashboardUtils, 'isDashboardPivoted').mockReturnValue(true);
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      expect(
        screen.queryByTestId('refresh-dashboard-container')
      ).not.toBeInTheDocument();
    });

    it('renders container when cachedAt present, not empty, and no pending', () => {
      mockSelectorReturn();
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      expect(
        screen.getByTestId('refresh-dashboard-container')
      ).toBeInTheDocument();
    });

    it('renders container when only one caching flag is enabled', () => {
      mockSelectorReturn();
      window.setFlag('rep-charts-v2-caching', false);
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      expect(
        screen.getByTestId('refresh-dashboard-container')
      ).toBeInTheDocument();
    });

    it('hides container when dashboard is empty', () => {
      mockSelectorReturn();
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty />);
      expect(
        screen.queryByTestId('refresh-dashboard-container')
      ).not.toBeInTheDocument();
    });

    it('hides container when cachedAt is falsy', () => {
      mockSelectorReturn({ cachedAtTimestamp: null });
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      expect(
        screen.queryByTestId('refresh-dashboard-container')
      ).not.toBeInTheDocument();
    });

    it('hides container when status includes pending', () => {
      mockSelectorReturn({ effectiveLoadingStatus: ['SUCCESS', 'PENDING'] });
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      expect(
        screen.queryByTestId('refresh-dashboard-container')
      ).not.toBeInTheDocument();
    });

    it('shows container but hides refresh icon when status includes caching', () => {
      mockSelectorReturn({ effectiveLoadingStatus: ['SUCCESS', 'CACHING'] });
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      const container = screen.getByTestId('refresh-dashboard-container');
      expect(container).toBeInTheDocument();
      expect(
        within(container).queryByRole('button', { name: /refresh/i })
      ).not.toBeInTheDocument();
    });

    it('clicking the refresh icon invokes callback when icon is visible', async () => {
      const user = userEvent.setup();
      const refreshSpy = jest.fn();
      mockSelectorReturn({ effectiveLoadingStatus: ['SUCCESS'] });
      renderWithStore(
        <DashboardHeader
          {...props}
          isDashboardEmpty={false}
          refreshDashboard={refreshSpy}
        />
      );
      const container = screen.getByTestId('refresh-dashboard-container');
      const btn = within(container).getByRole('button');
      await user.click(btn);
      expect(refreshSpy).toHaveBeenCalledWith(props.dashboard.id);
    });

    it('does not show the container if both flags are false', () => {
      mockSelectorReturn();
      window.setFlag('rep-table-widget-caching', false);
      window.setFlag('rep-charts-v2-caching', false);
      renderWithStore(<DashboardHeader {...props} isDashboardEmpty={false} />);
      expect(
        screen.queryByTestId('refresh-dashboard-container')
      ).not.toBeInTheDocument();
    });
  });
});
