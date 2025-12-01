import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComparisonPanelTranslated as ComparisonPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel/components/ComparisonPanel';
import { useGetMetricVariablesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { unsupportedMetrics } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer',
  () => ({
    __esModule: true,
    DataSourceModuleRendererTranslated: jest.fn(() => (
      <div data-testid="DatSourceModuleRenderer" />
    )),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ActivityModule',
  () => ({
    __esModule: true,
    ActivityModuleTranslated: () => (
      <div data-testid="ComparisonPanel|ActivityModule" />
    ),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MetricModule',
  () => ({
    __esModule: true,
    MetricModuleTranslated: () => (
      <div data-testid="ComparisonPanel|MetricModule" />
    ),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ParticipationModule',
  () => ({
    __esModule: true,
    ParticipationModuleTranslated: () => (
      <div data-testid="ComparisonPanel|ParticipationModule" />
    ),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/containers/TableWidget/PanelModules/MedicalModule/Column',
  () => ({
    __esModule: true,
    default: () => <div data-testid="ComparisonPanel|MedicalModule" />,
    MedicalData: () => <div data-testid="ComparisonPanel|MedicalData" />,
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/PanelFilters',
  () => ({
    __esModule: true,
    PanelFiltersTranslated: () => <div data-testid="ComparisonPanel|Filters" />,
  })
);

const MockGameModule = () => <div data-testid="GameActivityModule" />;
const MockAvailabilityModule = () => <div data-testid="AvailabilityModule" />;

const defaultProps = {
  calculation: '',
  columnTitle: '',
  dataSource: {},
  dateRange: {},
  isLoading: false,
  gameActivityModule: <MockGameModule />,
  availabilityModule: <MockAvailabilityModule />,
  t: i18nextTranslateStub(),
};

describe('ComparisonPanel', () => {
  describe('when FF rep-data-source-renderer is "true"', () => {
    beforeEach(() => {
      window.setFlag('rep-data-source-renderer', true);
    });

    afterEach(() => {
      window.setFlag('rep-data-source-renderer', false);
    });

    it('renders DatSourceModuleRenderer', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} />);
      expect(screen.getByTestId('DatSourceModuleRenderer')).toBeInTheDocument();
    });

    it('does not render Metric Module', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} source="metric" />);
      expect(
        screen.queryByTestId('ComparisonPanel|MetricModule')
      ).not.toBeInTheDocument();
    });

    it('does not render GameActivityModule', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} source="activity" />);
      expect(
        screen.queryByTestId('ComparisonPanel|ActivityModule')
      ).not.toBeInTheDocument();
    });
  });

  describe('when FF rep-data-source-renderer is "false"', () => {
    beforeEach(() => {
      useGetMetricVariablesQuery.mockReturnValue({
        data: [
          {
            source_key: 'kitman:athlete|age_in_years',
            name: 'Age',
            source_name: 'Athlete details',
            type: 'number',
            localised_unit: 'years',
          },
        ],
        isLoading: false,
      });
    });

    it('does not renders DatSourceModuleRenderer', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} />);
      expect(
        screen.queryByTestId('DatSourceModuleRenderer')
      ).not.toBeInTheDocument();
    });

    it('does render Metric Module', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} source="metric" />);
      expect(
        screen.getByTestId('ComparisonPanel|MetricModule')
      ).toBeInTheDocument();
    });
  });

  it('renders correctly', () => {
    renderWithRedux(<ComparisonPanel {...defaultProps} />);
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  it('renders the MetricModule component when source is metric', () => {
    renderWithRedux(<ComparisonPanel {...defaultProps} source="metric" />);
    expect(
      screen.getByTestId('ComparisonPanel|MetricModule')
    ).toBeInTheDocument();
  });

  it('renders the ActivityModule component when the source is activity', () => {
    renderWithRedux(<ComparisonPanel {...defaultProps} source="activity" />);
    expect(
      screen.getByTestId('ComparisonPanel|ActivityModule')
    ).toBeInTheDocument();
  });

  it('renders the Availability component when the source is availability', () => {
    renderWithRedux(
      <ComparisonPanel {...defaultProps} source="availability" />
    );
    expect(screen.getByTestId('AvailabilityModule')).toBeInTheDocument();
  });

  it('renders the ParticipationModule component', () => {
    renderWithRedux(
      <ComparisonPanel {...defaultProps} source="participation" />
    );
    expect(
      screen.getByTestId('ComparisonPanel|ParticipationModule')
    ).toBeInTheDocument();
  });

  it('renders the GameActivityModule component', () => {
    renderWithRedux(<ComparisonPanel {...defaultProps} source="games" />);
    expect(screen.getByTestId('GameActivityModule')).toBeInTheDocument();
  });

  describe('<DataRangeModule />', () => {
    it('renders the DateRangeModule component', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} />);

      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });

    it('shows Last X Games and Sessions for supported metric data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithRedux(
        <ComparisonPanel
          {...defaultProps}
          source="metric"
          dataSource={{ source: 'supported_source', variable: 'variable' }}
        />
      );

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.getByText('Last (x) Games/Sessions');

      expect(lastXGamesAndSessions).toBeInTheDocument();
    });

    it('hides Last X Games/Sessions for unsupported metric data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithRedux(
        <ComparisonPanel
          {...defaultProps}
          source="metric"
          dataSource={{ source: unsupportedMetrics[0], variable: 'variable' }}
        />
      );

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.queryByText(
        'Last (x) Games/Sessions'
      );

      expect(lastXGamesAndSessions).not.toBeInTheDocument();
    });

    it('hides Last X Games/Sessions for non-metric data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithRedux(<ComparisonPanel {...defaultProps} source="activity" />);

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.queryByText(
        'Last (x) Games/Sessions'
      );

      expect(lastXGamesAndSessions).not.toBeInTheDocument();
    });
  });

  describe('for medical source', () => {
    it('renders the MedicalModule', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} source="medical" />);
      expect(
        screen.getByTestId('ComparisonPanel|MedicalModule')
      ).toBeInTheDocument();
    });

    it('does not render the PanelFilters', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} source="medical" />);
      expect(
        screen.queryByTestId('ComparisonPanel|Filters')
      ).not.toBeInTheDocument();
    });

    it('renders the MedicalData', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} source="medical" />);
      expect(
        screen.getByTestId('ComparisonPanel|MedicalData')
      ).toBeInTheDocument();
    });
  });

  describe('for the actions footer', () => {
    it('renders the add another checkbox', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} />);
      expect(
        screen.getByRole('checkbox', { name: 'Add another' })
      ).toBeInTheDocument();
    });

    it('renders the Apply button', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });

    it('disables the Apply button if dateRange and calculation are empty', () => {
      renderWithRedux(<ComparisonPanel {...defaultProps} />);
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      expect(applyButton).toBeDisabled();
    });

    it('enables the Apply button when valid data is provided', () => {
      const props = {
        ...defaultProps,
        dataSource: { source: 'source', variable: 'variable' },
        calculation: 'sum',
        timePeriod: 'today',
      };
      renderWithRedux(<ComparisonPanel {...props} />);
      const applyButton = screen.getByRole('button', { name: 'Apply' });
      expect(applyButton).toBeEnabled();
    });

    it('passes the value of add another checkbox to the onApply', async () => {
      const user = userEvent.setup();
      const mockOnApply = jest.fn();
      const props = {
        ...defaultProps,
        dataSource: { source: 'source', variable: 'variable' },
        calculation: 'sum',
        timePeriod: 'today',
        onApply: mockOnApply,
      };

      renderWithRedux(<ComparisonPanel {...props} />);

      const applyButton = screen.getByRole('button', { name: 'Apply' });
      const addAnotherCheckbox = screen.getByRole('checkbox', {
        name: 'Add another',
      });

      await user.click(applyButton);
      expect(mockOnApply).toHaveBeenCalledWith(false);

      await user.click(addAnotherCheckbox);
      await user.click(applyButton);
      expect(mockOnApply).toHaveBeenCalledWith(true);
    });
  });

  describe('Filters for TableMetric', () => {
    it('renders the filter panel for TableMetric', () => {
      renderWithRedux(
        <ComparisonPanel
          {...defaultProps}
          dataSource={{ type: 'TableMetric' }}
        />
      );
      expect(screen.getByTestId('ComparisonPanel|Filters')).toBeInTheDocument();
    });

    it('renders the session filter', () => {
      renderWithRedux(
        <ComparisonPanel
          {...defaultProps}
          dataSource={{ type: 'TableMetric' }}
        />
      );
      expect(screen.getByTestId('ComparisonPanel|Filters')).toBeInTheDocument();
    });

    it('opens the filters when isEditMode and filter values are present', () => {
      renderWithRedux(
        <ComparisonPanel
          {...defaultProps}
          dataSource={{ type: 'TableMetric' }}
          isOpen
          isEditMode
          filters={{
            time_loss: [],
            competitions: [],
            event_types: ['game'],
            session_type: [],
            training_session_types: [],
          }}
        />
      );

      expect(screen.getByTestId('ComparisonPanel|Filters')).toBeInTheDocument();
    });
  });
});
