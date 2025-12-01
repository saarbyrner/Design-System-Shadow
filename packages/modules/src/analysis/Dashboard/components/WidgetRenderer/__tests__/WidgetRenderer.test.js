import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { emptySquadAthletes } from '../../utils';
import WidgetRenderer from '../index';

jest.mock(
  '@kitman//modules/src/analysis/Dashboard/components/ChartWidget/index.js',
  () => ({
    ChartWidgetTranslated: () => (
      <div data-testid="chart-widget">Chart Widget</div>
    ),
  })
);

describe('Analytical Dashboard <WidgetRenderer /> component', () => {
  const baseProps = {
    widgetData: {
      id: 123,
    },
    dashboard: {
      id: 123456,
    },
    squadAthletes: emptySquadAthletes,
    squads: [],
    annotationTypes: [{ organisation_annotation_type_id: 1 }],
    t: i18nextTranslateStub(),
  };

  it('renders blank widget', () => {
    const { container } = renderWithStore(<WidgetRenderer {...baseProps} />);

    const blankWidget = container.querySelector(
      '.analyticalDashboard__blankWidgetDiv'
    );
    expect(blankWidget).toBeInTheDocument();
  });

  it('renders widget wrapper', () => {
    const chartProps = {
      ...baseProps,
      widgetData: {
        id: 234,
        widget_type: 'chart',
      },
    };

    const { container } = renderWithStore(<WidgetRenderer {...chartProps} />);

    const chartWidget = container.querySelector('.analyticalDashboard__widget');
    expect(chartWidget).toBeInTheDocument();
  });
});
