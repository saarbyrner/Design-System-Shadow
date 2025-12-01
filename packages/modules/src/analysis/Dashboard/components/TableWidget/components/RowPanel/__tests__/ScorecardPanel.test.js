import { render, screen } from '@testing-library/react';
import { useGetMetricVariablesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { ScorecardPanelTranslated as ScorecardPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel/components/ScorecardPanel';

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

const props = {
  availableVariables: [],
  calculation: '',
  rowTitle: '',
  dataSource: {},
  onApply: jest.fn(),
  onSetCalculation: jest.fn(),
  onSetColumnTitle: jest.fn(),
  onSetMetrics: jest.fn(),
  isLoading: false,
  isEditMode: false,
};

describe('<ScorecardPanel>', () => {
  describe('when FF rep-data-source-renderer is "true"', () => {
    beforeEach(() => {
      window.setFlag('rep-data-source-renderer', true);
    });

    afterEach(() => {
      window.setFlag('rep-data-source-renderer', false);
    });

    it('renders DatSourceModuleRenderer', async () => {
      render(<ScorecardPanel {...props} source="metric" />);
      expect(screen.getByTestId('DatSourceModuleRenderer')).toBeInTheDocument();
    });

    it('does not render Metric Module', async () => {
      render(<ScorecardPanel {...props} source="metric" />);
      expect(
        screen.queryByTestId(' ScorecardPanel|MetricModule')
      ).not.toBeInTheDocument();
    });

    it('does not render GameActivityModule', async () => {
      render(<ScorecardPanel {...props} source="activity" />);
      expect(
        screen.queryByTestId('ScorecardPanel|ActivityModule')
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

    it('does not renders DatSourceModuleRenderer', async () => {
      render(<ScorecardPanel {...props} />);
      expect(
        screen.queryByTestId('DatSourceModuleRenderer')
      ).not.toBeInTheDocument();
    });

    it('does render Metric Module', async () => {
      render(<ScorecardPanel {...props} source="metric" />);
      expect(screen.getByText('Metric Source')).toBeInTheDocument();
    });
  });
});
