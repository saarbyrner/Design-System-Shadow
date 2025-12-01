import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _cloneDeep from 'lodash/cloneDeep';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import { summaryTableFormatting } from '@kitman/modules/src/analysis/shared/utils/index';
import SummaryGraphTable from '..';

describe('<SummaryGraphTable />', () => {
  const props = {
    graphData: _cloneDeep(getDummyData('summary')),
    showTitle: true,
    t: i18nextTranslateStub(),
  };

  describe('when props.condensed is true', () => {
    it('renders a condensed graph', () => {
      render(<SummaryGraphTable {...props} condensed />);

      const tables = screen.getAllByRole('table');
      expect(tables).toHaveLength(2);

      tables.forEach((table) => {
        expect(table).toHaveClass('table km-table');
      });
    });
  });

  it('renders the title', () => {
    render(<SummaryGraphTable {...props} showTitle />);

    expect(screen.getByText('3 Metrics')).toBeInTheDocument();
  });

  it("doesn't render the title when showTitle is false", () => {
    render(<SummaryGraphTable {...props} showTitle={false} />);

    expect(screen.queryByText('3 Metrics')).not.toBeInTheDocument();
  });

  it('shows the metrics', () => {
    render(<SummaryGraphTable {...props} />);

    props.graphData.metrics.forEach((metric) => {
      expect(screen.getByText(metric.name)).toBeInTheDocument();
    });
  });

  it('shows the series names and data', () => {
    render(<SummaryGraphTable {...props} />);
    const graphData = summaryTableFormatting(props.graphData);

    graphData.series.forEach((seriesName) => {
      expect(screen.getByText(seriesName)).toBeInTheDocument();
    });
  });

  describe('when a metric is linked to a dashboard', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn() };
    });

    afterEach(() => {
      window.location = originalLocation;
      jest.restoreAllMocks();
    });

    it('redirects to the correct dashboard when clicking a link', async () => {
      const user = userEvent.setup();
      const customGraphData = _cloneDeep(props.graphData);
      customGraphData.metrics[0].linked_dashboard_id = '3';
      customGraphData.series[0].population_type = 'athlete';
      customGraphData.series[0].population_id = '3';
      customGraphData.series[0].timePeriod = 'this_season';

      const { container } = render(
        <SummaryGraphTable {...props} graphData={customGraphData} />
      );

      const linkElement = container.querySelector('.summaryGraphTable__link');
      expect(linkElement).toBeInTheDocument();

      await user.click(linkElement);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });
  });
});
