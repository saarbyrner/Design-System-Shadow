import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { getDummyData } from '../../../../resources/graph/DummyData';
import ValueVisualisationGraph from '..';

describe('Graph Composer <ValueVisualisationGraph /> component', () => {
  const props = {
    graphData: getDummyData('value_visualisation'),
    graphType: 'column',
    showTitle: true,
    t: (text) => text,
  };

  const { ResizeObserver } = window;

  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  it('renders', () => {
    const { container } = render(<ValueVisualisationGraph {...props} />);
    const valueVisualisationGraph =
      container.getElementsByClassName('valueVisualisation');
    expect(valueVisualisationGraph).toHaveLength(1);

    const valueVisualisationGraphDescription =
      container.getElementsByClassName('graphDescription');
    expect(valueVisualisationGraphDescription).toHaveLength(1);
  });

  it('renders the value visualisation', () => {
    const component = render(<ValueVisualisationGraph {...props} />);
    expect(component.getByText('32')).toBeInTheDocument();
    expect(component.getByText('Total')).toBeInTheDocument();
  });

  it('renders the correct font-size', () => {
    const { container } = render(<ValueVisualisationGraph {...props} />);
    const valueElement = container.querySelector('.valueVisualisation__value');
    const unitElement = container.querySelector('.valueVisualisation__unit');

    expect(valueElement).toHaveStyle({ fontSize: 435 });
    expect(valueElement).toHaveStyle({ lineHeight: 1 });
    expect(unitElement).toHaveStyle({ fontSize: 435 / 5 });
  });

  describe('when metric type is metric and the calculation is count', () => {
    it("shows the unit 'Total'", () => {
      const customProps = {
        ...props,
        graphData: {
          metrics: [
            {
              type: 'metric',
              calculation: 'count',
              series: [{ value: 1 }],
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );
      const unitElement = container.querySelector('.valueVisualisation__unit');
      expect(unitElement).toHaveTextContent('Total');
    });
  });

  describe('when metric type is metric and the calculation is not count', () => {
    it('shows the status unit', () => {
      const customProps = {
        ...props,
        graphData: {
          metrics: [
            {
              status: {
                localised_unit: 'Kilo',
              },
              type: 'metric',
              calculation: 'mean',
              series: [{ value: 1 }],
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );
      const unitElement = container.querySelector('.valueVisualisation__unit');
      expect(unitElement).toHaveTextContent('Kilo');
    });
  });

  describe('when metric type is medical', () => {
    it("shows the unit 'Total'", () => {
      const customProps = {
        ...props,
        graphData: {
          metrics: [
            {
              type: 'medical',
              series: [{ value: 1 }],
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );
      const unitElement = container.querySelector('.valueVisualisation__unit');
      expect(unitElement).toHaveTextContent('Total');
    });
  });

  describe('when the value is null', () => {
    it("shows the text 'No data to display'", () => {
      const customProps = {
        ...props,
        graphData: {
          metrics: [
            {
              type: 'medical',
              series: [{ value: null }],
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );
      const noValueElement = container.querySelector(
        '.valueVisualisation__noValue'
      );
      expect(noValueElement).toHaveTextContent('No data to display');
    });
  });

  describe('when the value is 0', () => {
    it('shows the value 0', () => {
      const customProps = {
        ...props,
        graphData: {
          metrics: [
            {
              type: 'medical',
              series: [{ value: 0 }],
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );
      const valueElement = container.querySelector(
        '.valueVisualisation__value'
      );
      expect(valueElement).toHaveTextContent('0');
    });
  });

  it('renders the value visualisation with under text', () => {
    const underTextProps = {
      graphData: getDummyData('value_visualisation'),
      graphType: 'column',
      showTitle: true,
      underText: 'Some under text',
      t: (text) => text,
    };

    const { container } = render(
      <ValueVisualisationGraph {...underTextProps} />
    );
    const valueElement = container.querySelector('.valueVisualisation__value');
    expect(valueElement).toHaveTextContent('32');
    const underTextElement = container.querySelector(
      '.valueVisualisation__unit'
    );
    expect(underTextElement).toHaveTextContent('Some under text');
  });

  it('renders the value visualisation with colour', () => {
    const colourProps = {
      graphData: getDummyData('value_visualisation'),
      graphType: 'column',
      showTitle: true,
      valueColour: '#FFAA00',
      t: (text) => text,
    };

    props.valueColour = '#FFAA00';
    const { container } = render(<ValueVisualisationGraph {...colourProps} />);
    const valueElement = container.querySelector('.valueVisualisation__value');

    expect(valueElement).toHaveStyle({ color: props.valueColour });
  });

  describe('when the value visualisation is linked to a dashboard', () => {
    const { location } = window;
    const user = userEvent.setup();

    beforeEach(() => {
      delete window.location;
      window.location = { ...location, assign: jest.fn() };
    });

    afterEach(() => {
      window.location = location;
    });

    it('redirects to the correct dashboard when clicking the value', async () => {
      const customProps = {
        ...props,
        graphData: {
          time_period: 'this_season',
          metrics: [
            {
              type: 'medical',
              series: [
                { value: 1, population_type: 'athlete', population_id: '3' },
              ],
              linked_dashboard_id: '3',
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );

      const linkElement = container.querySelector('.valueVisualisation__link');

      await user.click(linkElement);
      expect(window.location.assign).toHaveBeenCalledTimes(1);
      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it("doesn't create the dashboard link when the time period is a drill", () => {
      const customProps = {
        ...props,
        graphData: {
          time_period: 'this_season',
          metrics: [
            {
              type: 'medical',
              series: [
                { value: 1, population_type: 'athlete', population_id: '3' },
              ],
              linked_dashboard_id: '3',
              status: { event_type_time_period: 'game' },
            },
          ],
          date_range: {
            start_date: '2017-10-27',
            end_date: '2017-12-04',
          },
        },
      };

      const { container } = render(
        <ValueVisualisationGraph {...customProps} />
      );

      const valueVisualisationGraph = container.getElementsByClassName(
        'valueVisualisation__link'
      );
      expect(valueVisualisationGraph).toHaveLength(0);
    });
  });
});
