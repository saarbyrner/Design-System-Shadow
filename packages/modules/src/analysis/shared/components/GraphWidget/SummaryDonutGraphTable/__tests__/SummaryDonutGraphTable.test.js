import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _cloneDeep from 'lodash/cloneDeep';
import sinon from 'sinon';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import SummaryDonutGraphTable from '..';

describe('Graph Composer <SummaryDonutGraphTable /> component', () => {
  const props = {
    graphData: getDummyData('summaryDonut'),
    showTitle: true,
    t: i18nextTranslateStub(),
  };

  describe('when props.condensed is true', () => {
    it('renders a condensed graph', () => {
      const { container } = render(
        <SummaryDonutGraphTable {...props} condensed />
      );

      const graphTable = container.querySelector('.summaryDonutGraphTable');
      expect(graphTable).toHaveClass('summaryDonutGraphTable--condensed');
      expect(screen.getByText('Entire Squad')).toBeInTheDocument();
    });
  });

  it('renders the graph description', () => {
    render(<SummaryDonutGraphTable {...props} showTitle />);

    expect(
      screen.getByText('Illness - No. of Illness Occurrences')
    ).toBeInTheDocument();
  });

  it("doesn't render the title when showTitle is false", () => {
    render(<SummaryDonutGraphTable {...props} showTitle={false} />);

    expect(
      screen.queryByText('Illness - No. of Illness Occurrences')
    ).not.toBeInTheDocument();
  });

  it('renders the table', () => {
    render(<SummaryDonutGraphTable {...props} />);

    expect(screen.getAllByRole('table')).toHaveLength(2);
    expect(screen.getByText('Entire Squad')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  describe("When the data doesn't contain any series", () => {
    it('renders an empty table', () => {
      const graphData = _cloneDeep(getDummyData('summaryDonut'));

      graphData.metrics = graphData.metrics.map((metric) => ({
        ...metric,
        squad_selection: {
          athletes: [],
          positions: [],
          position_groups: [],
          applies_to_squad: false,
        },
        series: [],
      }));

      const { container } = render(
        <SummaryDonutGraphTable {...props} graphData={graphData} />
      );

      expect(screen.queryByText('Name')).toBeInTheDocument();

      expect(
        container.querySelectorAll('.summaryDonutGraphTable__fixed tbody td')
      ).toHaveLength(0);

      expect(
        container.querySelectorAll(
          '.summaryDonutGraphTable__scrollable tbody td'
        )
      ).toHaveLength(0);
    });
  });

  describe('when a metric is linked to a dashboard', () => {
    const { location } = window;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: sinon.spy() };
    });

    afterEach(() => {
      window.location = location;
    });

    it('redirects to the correct dashboard when clicking a link', async () => {
      const user = userEvent.setup();
      const customGraphData = _cloneDeep(props.graphData);
      customGraphData.metrics[0].linked_dashboard_id = '3';
      customGraphData.metrics[0].series[0].population_type = 'athlete';
      customGraphData.metrics[0].series[0].population_id = '3';
      customGraphData.time_period = 'this_season';

      render(<SummaryDonutGraphTable {...props} graphData={customGraphData} />);

      const linkElement = screen.getByText('10');
      await user.click(linkElement);

      expect(
        window.location.assign.calledWithExactly(
          '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
        )
      ).toBe(true);
    });
  });
});
