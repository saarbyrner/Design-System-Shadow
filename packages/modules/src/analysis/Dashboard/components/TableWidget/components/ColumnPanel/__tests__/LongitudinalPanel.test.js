import { render, screen } from '@testing-library/react';
import { LongitudinalPanelTranslated as LongitudinalPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel/components/LongitudinalPanel';
import { useGetMetricVariablesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer',
  () => ({
    DataSourceModuleRendererTranslated: jest.fn(() => (
      <div data-testid="DatSourceModuleRenderer" />
    )),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AthleteModule',
  () => ({
    AthleteModuleTranslated: jest.fn(() => <div />),
  })
);

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils',
  () => ({
    isDataSourceValid: jest.fn().mockReturnValue(true),
  })
);

const props = {
  availableVariables: [],
  calculation: '',
  rowTitle: '',
  dataSource: {},
  source: 'metric',
  onApply: jest.fn(),
  onSetCalculation: jest.fn(),
  onSetColumnTitle: jest.fn(),
  onSetMetrics: jest.fn(),
  isLoading: false,
  isEditMode: false,
};

describe('<LongitudinalPanel>', () => {
  describe('when FF rep-data-source-renderer is "true"', () => {
    beforeEach(() => {
      window.setFlag('rep-data-source-renderer', true);
    });

    afterEach(() => {
      window.setFlag('rep-data-source-renderer', false);
    });

    it('renders DatSourceModuleRenderer', () => {
      render(<LongitudinalPanel {...props} />);
      expect(screen.getByTestId('DatSourceModuleRenderer')).toBeInTheDocument();
    });

    it('does not render Metric Module', () => {
      render(<LongitudinalPanel {...props} source="metric" />);
      expect(
        screen.queryByTestId(' LongitudinalPanel|MetricModule')
      ).not.toBeInTheDocument();
    });

    it('does not render GameActivityModule', () => {
      render(<LongitudinalPanel {...props} source="activity" />);
      expect(
        screen.queryByTestId('LongitudinalPanel|ActivityModule')
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
      render(<LongitudinalPanel {...props} />);
      expect(
        screen.queryByTestId('DatSourceModuleRenderer')
      ).not.toBeInTheDocument();
    });

    it('does render Metric Module', () => {
      render(<LongitudinalPanel {...props} source="metric" />);
      expect(screen.getByText('Metric Source')).toBeInTheDocument();
    });
  });
});
