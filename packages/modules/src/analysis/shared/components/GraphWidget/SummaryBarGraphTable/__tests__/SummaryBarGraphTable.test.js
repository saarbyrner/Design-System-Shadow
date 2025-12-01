import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import _cloneDeep from 'lodash/cloneDeep';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '../../../../resources/graph/DummyData';
import SummaryBarGraphTable from '..';

describe('Graph Composer <SummaryBarGraphTable /> component', () => {
  const props = {
    graphData: getDummyData('summaryBar'),
    showTitle: true,
    t: i18nextTranslateStub(),
  };

  describe('when props.condensed is true', () => {
    it('renders a condensed graph', () => {
      const { container } = render(
        <SummaryBarGraphTable {...props} condensed />
      );

      const graphTable = container.querySelector('.summaryBarGraphTable');
      expect(graphTable).toHaveClass('summaryBarGraphTable--condensed');
    });
  });

  it('renders the graph description', () => {
    render(<SummaryBarGraphTable {...props} showTitle />);

    expect(document.querySelector('.graphDescription')).toBeInTheDocument();
  });

  it("doesn't render the title when showTitle is false", () => {
    render(<SummaryBarGraphTable {...props} showTitle={false} />);

    expect(document.querySelector('.graphDescription')).toBeInTheDocument();
  });

  it('renders the table', () => {
    const { container } = render(<SummaryBarGraphTable {...props} />);

    expect(
      container.querySelector('.summaryBarGraphTable__fixed thead th')
    ).toHaveTextContent('Name');

    const fixedCells = container.querySelectorAll(
      '.summaryBarGraphTable__fixed tbody td'
    );
    expect(fixedCells[0]).toHaveTextContent('Athlete 1');
    expect(fixedCells[1]).toHaveTextContent('Athlete 2');
    expect(fixedCells[2]).toHaveTextContent('Athlete 3');

    const scrollableHeaders = container.querySelectorAll(
      '.summaryBarGraphTable__scrollable thead th'
    );
    expect(scrollableHeaders[0]).toHaveTextContent('Good Mood');
    expect(scrollableHeaders[1]).toHaveTextContent('Sleep Duration');

    const scrollableRows = container.querySelectorAll(
      '.summaryBarGraphTable__scrollable tbody tr'
    );
    const firstRowCells = scrollableRows[0].querySelectorAll('td');
    const secondRowCells = scrollableRows[1].querySelectorAll('td');
    const thirdRowCells = scrollableRows[2].querySelectorAll('td');

    expect(firstRowCells[0]).toHaveTextContent('6');
    expect(firstRowCells[1]).toHaveTextContent('-');
    expect(secondRowCells[0]).toHaveTextContent('20');
    expect(secondRowCells[1]).toHaveTextContent('2');
    expect(thirdRowCells[0]).toHaveTextContent('2');
    expect(thirdRowCells[1]).toHaveTextContent('4');
  });

  describe('when a metric is linked to a dashboard', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn() };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('redirects to the correct dashboard when clicking a link', async () => {
      const user = userEvent.setup();
      const customGraphData = _cloneDeep(props.graphData);
      customGraphData.metrics[0].linked_dashboard_id = '3';
      customGraphData.metrics[0].series[0].datapoints[0].population_type =
        'athlete';
      customGraphData.metrics[0].series[0].datapoints[0].population_id = '3';
      customGraphData.time_period = 'this_season';

      const { container } = render(
        <SummaryBarGraphTable {...props} graphData={customGraphData} />
      );

      const link = container.querySelector('.summaryDonutGraphTable__link');
      await user.click(link);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });
  });
});
