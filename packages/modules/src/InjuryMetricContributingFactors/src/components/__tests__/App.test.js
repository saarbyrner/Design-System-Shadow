import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import App from '../App';
import graphDummyData from '../../../resources/graphDummyData';

describe('Injury Risk Contributing Factors <App /> component', () => {
  let props;
  const { location } = window;

  beforeEach(() => {
    props = {
      graphData: {
        ...graphDummyData,
        available_athletes: [
          { value: '46687', label: 'Jon Doe' },
          { value: '46688', label: 'Jane Doe' },
        ],
      },
      canManageIssues: true,
      canViewIssues: true,
      positionGroupsById: {
        25: 'Forward',
        26: 'Back',
        27: 'Other',
      },
      bodyAreasById: {
        1: 'Ankle',
        2: 'Buttock/pelvis',
        3: 'Chest',
      },
      fetchGraphData: jest.fn(),
      t: (key) => key,
    };
    window.featureFlags = {};

    delete window.location;
    window.location = { assign: jest.fn(), search: '' };
  });

  afterEach(() => {
    window.location = location;
  });

  const renderComponent = (extraProps) => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <App {...props} {...extraProps} />
      </I18nextProvider>
    );
    return { user };
  };

  it('renders the correct title in the header', () => {
    renderComponent();
    const expectedTitle =
      graphDummyData.dashboard_header.injury_risk_variable_name;
    expect(
      screen.getByRole('heading', { name: expectedTitle })
    ).toBeInTheDocument();
  });

  describe('Analytics Tooltip', () => {
    it('renders position groups filter data', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          position_group_ids: [25, 26],
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));

      const tooltip = await screen.findByRole('tooltip');
      expect(within(tooltip).getByText('Forward')).toBeInTheDocument();
      expect(within(tooltip).getByText('Back')).toBeInTheDocument();
    });

    it('renders exposures filter data', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          exposures: ['game'],
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));
      expect(await screen.findByText('Games')).toBeInTheDocument();
    });

    it('renders mechanisms filter data', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          mechanisms: ['contact'],
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));
      expect(await screen.findByText('Contact')).toBeInTheDocument();
    });

    it('renders body areas filter data', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          body_area_ids: [1, 2],
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));
      const tooltip = await screen.findByRole('tooltip');
      expect(within(tooltip).getByText('Ankle')).toBeInTheDocument();
      expect(within(tooltip).getByText('Buttock/pelvis')).toBeInTheDocument();
    });

    it('shows the correct number of injuries', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          injuries: 23,
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));
      expect(await screen.findByText('23')).toBeInTheDocument();
    });

    it('shows the correct number of athletes', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          athletes: 45,
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));
      expect(await screen.findByText('45')).toBeInTheDocument();
    });
  });

  describe('when the unavailability feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags[
        'risk-advisor-metric-creation-filter-on-injuries-causing-unavailability'
      ] = true;
    });

    it('renders severities filter data', async () => {
      const newGraphData = {
        ...graphDummyData,
        analytics_metadata: {
          ...graphDummyData.analytics_metadata,
          severity: ['mild', 'severe'],
        },
      };
      const { user } = renderComponent({ graphData: newGraphData });
      await user.hover(screen.getByTestId('analytics-tooltip-trigger'));
      const tooltip = await screen.findByRole('tooltip');
      expect(within(tooltip).getByText('Mild (4-7 days)')).toBeInTheDocument();
      expect(
        within(tooltip).getByText('Severe (29+ days)')
      ).toBeInTheDocument();
    });
  });

  describe('Graph Controls', () => {
    const newGraphData = {
      ...graphDummyData,
      available_athletes: [
        { value: '46687', label: 'Jon Doe' },
        { value: '46688', label: 'Jane Doe' },
      ],
      previous_day_timestamp: 1627912800,
      next_day_timestamp: 1627740000,
      dashboard_header: {
        injury_risk: 0.1743746546,
      },
    };

    it('renders the risk rate in the graph title', () => {
      renderComponent({ graphData: newGraphData });
      expect(screen.getByText('0.17% Injury Risk')).toBeInTheDocument();
    });

    it('redirects to a new URL when clicking the previous button', async () => {
      const { user } = renderComponent({ graphData: newGraphData });
      await user.click(screen.getByTestId('prev-day-btn'));
      expect(window.location.assign).toHaveBeenCalledWith(
        expect.stringContaining('timestamp=1627912800')
      );
    });

    it('disables the previous button when there is no timestamp', () => {
      const noPrevDayData = { ...newGraphData, previous_day_timestamp: null };
      renderComponent({ graphData: noPrevDayData });
      expect(screen.getByTestId('prev-day-btn')).toBeDisabled();
    });

    it('redirects to a new URL when clicking the next button', async () => {
      const { user } = renderComponent({ graphData: newGraphData });
      await user.click(screen.getByTestId('next-day-btn'));
      expect(window.location.assign).toHaveBeenCalledWith(
        expect.stringContaining('timestamp=1627740000')
      );
    });

    it('disables the next button when there is no timestamp', () => {
      const noNextDayData = { ...newGraphData, next_day_timestamp: null };
      renderComponent({ graphData: noNextDayData });
      expect(screen.getByTestId('next-day-btn')).toBeDisabled();
    });

    it('redirects to a new URL when clicking the today button', async () => {
      const { user } = renderComponent({ graphData: newGraphData });
      await user.click(screen.getByRole('button', { name: 'Today' }));
      expect(window.location.assign).toHaveBeenCalledWith(
        expect.stringContaining('timestamp')
      );
    });

    it('displays an error message when the data contains an error', () => {
      const errorData = {
        ...newGraphData,
        error: 'No available injury risk data for the provided date',
      };
      renderComponent({ graphData: errorData });
      expect(
        screen.getByText('No available injury risk data for the provided date')
      ).toBeInTheDocument();
    });

    it('redirects to a new URL when selecting an athlete', async () => {
      renderComponent({ graphData: newGraphData });
      await selectEvent.select(screen.getByLabelText('Athlete'), 'Jane Doe');
      expect(window.location.assign).toHaveBeenCalledWith(
        expect.stringContaining('athlete_id=46688')
      );
    });
  });
});
