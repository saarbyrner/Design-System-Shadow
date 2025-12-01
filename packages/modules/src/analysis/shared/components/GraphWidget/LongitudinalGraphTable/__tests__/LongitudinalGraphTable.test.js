import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';
import _cloneDeep from 'lodash/cloneDeep';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '../../../../resources/graph/DummyData';
import LongitudinalGraphTable from '..';
import formatGraphData from '../utils';

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/GraphDescription',
  () => {
    return {
      GraphDescriptionTranslated: function MockGraphDescription(props) {
        return (
          <div
            data-testid="graph-description"
            data-condensed={props.condensed}
            data-show-title={props.showTitle}
          >
            Graph Description
          </div>
        );
      },
    };
  }
);

describe('Graph Composer <LongitudinalGraphTable /> component', () => {
  const defaultProps = {
    graphData: getDummyData('longitudinal'),
    showTitle: true,
    t: i18nextTranslateStub(),
  };

  it('renders', () => {
    render(<LongitudinalGraphTable {...defaultProps} />);
    expect(screen.getByTestId('graph-description')).toBeInTheDocument();
  });

  describe('when props.condensed is true', () => {
    it('renders a condensed graph', () => {
      render(<LongitudinalGraphTable {...defaultProps} condensed />);

      const graphTable = document.querySelector('.longitudinalGraphTable');
      expect(graphTable).toHaveClass('longitudinalGraphTable--condensed');

      const graphDescription = screen.getByTestId('graph-description');
      expect(graphDescription).toHaveAttribute('data-condensed', 'true');
    });
  });

  it('renders the graph description', () => {
    render(<LongitudinalGraphTable {...defaultProps} showTitle />);
    const graphDescription = screen.getByTestId('graph-description');

    expect(graphDescription).toBeInTheDocument();
    expect(graphDescription).toHaveAttribute('data-show-title', 'true');
  });

  it("doesn't render the title when showTitle is false", () => {
    render(<LongitudinalGraphTable {...defaultProps} showTitle={false} />);
    const graphDescription = screen.getByTestId('graph-description');

    expect(graphDescription).toHaveAttribute('data-show-title', 'false');
  });

  it('renders the correct number of rows', () => {
    // there should be a row for every series
    let rowCount = 0;
    defaultProps.graphData.metrics.forEach((metric) => {
      rowCount += metric.series.length;
    });

    render(<LongitudinalGraphTable {...defaultProps} />);

    const fixedTableRows = document.querySelectorAll(
      '.longitudinalGraphTable__fixed tbody tr'
    );
    const scrollableTableRows = document.querySelectorAll(
      '.longitudinalGraphTable__scrollable tbody tr'
    );

    expect(fixedTableRows).toHaveLength(rowCount);
    expect(scrollableTableRows).toHaveLength(rowCount);
  });

  it('renders the correct number of columns', () => {
    const tableData = formatGraphData(defaultProps.graphData);
    render(<LongitudinalGraphTable {...defaultProps} />);

    const scrollableHeaders = document.querySelectorAll(
      '.longitudinalGraphTable__scrollable thead th'
    );
    expect(scrollableHeaders).toHaveLength(tableData.dates.length);
  });

  it('if there is no value for a date, it replaces it with "-"', () => {
    const tableData = formatGraphData(defaultProps.graphData);
    render(<LongitudinalGraphTable {...defaultProps} />);

    const scrollableTableRows = document.querySelectorAll(
      '.longitudinalGraphTable__scrollable tbody tr'
    );

    tableData.datapoints.forEach((datapoint, dataPointIndex) => {
      const row = scrollableTableRows[dataPointIndex];
      const cells = row.querySelectorAll('td');

      tableData.dates.forEach((date, dateIndex) => {
        expect(cells[dateIndex]).toHaveTextContent(
          (datapoint[date] || '-').toString()
        );
      });
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('formats the dates into "l" format', () => {
      const tableData = formatGraphData(defaultProps.graphData);
      const orgTimezone = 'Canada/Atlantic';
      render(<LongitudinalGraphTable {...defaultProps} />);

      const scrollableHeaders = document.querySelectorAll(
        '.longitudinalGraphTable__scrollable thead th'
      );

      tableData.dates.forEach((date, index) => {
        expect(scrollableHeaders[index]).toHaveTextContent(
          moment.tz(date, orgTimezone).format('l')
        );
      });
    });
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('formats the dates into DD/MM', () => {
      const tableData = formatGraphData(defaultProps.graphData);
      const orgTimezone = 'Canada/Atlantic';
      render(<LongitudinalGraphTable {...defaultProps} />);

      const scrollableHeaders = document.querySelectorAll(
        '.longitudinalGraphTable__scrollable thead th'
      );

      tableData.dates.forEach((date, index) => {
        expect(scrollableHeaders[index]).toHaveTextContent(
          moment.tz(date, orgTimezone).format('DD/MM')
        );
      });
    });
  });

  describe('when a metric is linked to a dashboard', () => {
    const { location } = window;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn() };
    });

    afterEach(() => {
      window.location = location;
    });

    it('redirects to the correct dashboard when clicking a link', async () => {
      const user = userEvent.setup();
      const customGraphData = _cloneDeep(defaultProps.graphData);
      customGraphData.metrics[0].linked_dashboard_id = '3';
      customGraphData.metrics[0].series[0].population_type = 'athlete';
      customGraphData.metrics[0].series[0].population_id = '3';
      customGraphData.time_period = 'this_season';

      render(
        <LongitudinalGraphTable {...defaultProps} graphData={customGraphData} />
      );

      const link = document.querySelector('.longitudinalGraphTable__link');
      await user.click(link);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });
  });

  describe('when the metric is medical', () => {
    const medicalGraphData = {
      metrics: [
        {
          type: 'medical',
          category: 'all_illnesses',
          series: [
            {
              fullname: 'Entire Squad',
              datapoints: [
                [1552607999000, 20],
                [1552780799000, 13],
                [1553299199000, 2],
              ],
            },
            {
              fullname: 'Forward',
              datapoints: [
                [1552607999000, 3],
                [1552780799000, 33],
                [1553299199000, 5],
              ],
            },
          ],
          overlays: [],
          filters: {
            time_loss: ['non_time_loss'],
            session_type: [],
            competitions: [],
            event_types: [],
            training_session_types: [],
          },
          filter_names: {
            time_loss: ['Non Time-loss'],
            session_type: [],
            competitions: [],
            event_types: [],
            training_session_types: [],
          },
        },
      ],
      date_range: {
        start_date: '2017-10-27',
        end_date: '2017-12-04',
      },
      time_period: 'last_x_days',
      decorators: {
        data_labels: false,
      },
      injuries: [],
      illnesses: [],
    };

    describe('when the standard-date-formatting flag is off', () => {
      beforeEach(() => {
        window.setFlag('standard-date-formatting', false);
      });

      it('renders the table correctly', () => {
        render(
          <LongitudinalGraphTable
            {...defaultProps}
            graphData={medicalGraphData}
          />
        );

        // Side bar
        const fixedTableRows = document.querySelectorAll(
          '.longitudinalGraphTable__fixed tbody tr'
        );
        const firstRow = fixedTableRows[0];
        const firstRowCells = firstRow.querySelectorAll('td');

        expect(firstRowCells[0]).toHaveTextContent('Entire Squad');
        expect(firstRowCells[1]).toHaveTextContent(
          'Illness - No. of Illness Occurrences'
        );

        const secondRow = fixedTableRows[1];
        const secondRowCells = secondRow.querySelectorAll('td');

        expect(secondRowCells[0]).toHaveTextContent('Forward');
        expect(secondRowCells[1]).toHaveTextContent(
          'Illness - No. of Illness Occurrences'
        );

        // Main table
        const scrollableHeaders = document.querySelectorAll(
          '.longitudinalGraphTable__scrollable thead th'
        );
        expect(scrollableHeaders[0]).toHaveTextContent('14/03');
        expect(scrollableHeaders[1]).toHaveTextContent('16/03');
        expect(scrollableHeaders[2]).toHaveTextContent('22/03');

        const scrollableTableRows = document.querySelectorAll(
          '.longitudinalGraphTable__scrollable tbody tr'
        );
        const firstDataRow = scrollableTableRows[0];
        const firstDataRowCells = firstDataRow.querySelectorAll('td');

        expect(firstDataRowCells[0]).toHaveTextContent('20');
        expect(firstDataRowCells[1]).toHaveTextContent('13');
        expect(firstDataRowCells[2]).toHaveTextContent('2');
      });
    });

    describe('when the standard-date-formatting flag is on', () => {
      beforeEach(() => {
        window.setFlag('standard-date-formatting', true);
      });

      afterEach(() => {
        window.setFlag('standard-date-formatting', false);
      });

      it('renders the table correctly', () => {
        render(
          <LongitudinalGraphTable
            {...defaultProps}
            graphData={medicalGraphData}
          />
        );

        // Side bar
        const fixedTableRows = document.querySelectorAll(
          '.longitudinalGraphTable__fixed tbody tr'
        );
        const firstRow = fixedTableRows[0];
        const firstRowCells = firstRow.querySelectorAll('td');

        expect(firstRowCells[0]).toHaveTextContent('Entire Squad');
        expect(firstRowCells[1]).toHaveTextContent(
          'Illness - No. of Illness Occurrences'
        );

        const secondRow = fixedTableRows[1];
        const secondRowCells = secondRow.querySelectorAll('td');

        expect(secondRowCells[0]).toHaveTextContent('Forward');
        expect(secondRowCells[1]).toHaveTextContent(
          'Illness - No. of Illness Occurrences'
        );

        // Main table
        const scrollableHeaders = document.querySelectorAll(
          '.longitudinalGraphTable__scrollable thead th'
        );
        expect(scrollableHeaders[0]).toHaveTextContent('3/14/2019');
        expect(scrollableHeaders[1]).toHaveTextContent('3/16/2019');
        expect(scrollableHeaders[2]).toHaveTextContent('3/22/2019');

        const scrollableTableRows = document.querySelectorAll(
          '.longitudinalGraphTable__scrollable tbody tr'
        );
        const firstDataRow = scrollableTableRows[0];
        const firstDataRowCells = firstDataRow.querySelectorAll('td');

        expect(firstDataRowCells[0]).toHaveTextContent('20');
        expect(firstDataRowCells[1]).toHaveTextContent('13');
        expect(firstDataRowCells[2]).toHaveTextContent('2');
      });
    });
  });
});
