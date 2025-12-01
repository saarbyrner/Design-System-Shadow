/* eslint-disable jest-dom/prefer-to-have-attribute */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import XYChart from '../index';

describe('TemplateDashboards|<XYChart />', () => {
  describe('Bar Chart', () => {
    it('renders the correct number of series and bars', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="bar"
          chartData={{
            chart: [
              {
                label: 'Series 1',
                value: 123,
              },
              { label: 'Series 2', value: 246 },
            ],
            overlays: null,
          }}
        />
      );

      expect(screen.queryByText('Series 1')).toBeInTheDocument();
      expect(screen.queryByText('Series 2')).toBeInTheDocument();
      expect(container.getElementsByClassName('visx-bar').length).toBe(2);
    });
  });

  describe('Colour Coded Bar Chart with FF ["rep-show-player-care-dev-journey"] on', () => {
    beforeEach(() => {
      window.featureFlags = { 'rep-show-player-care-dev-journey': true };
    });
    const widgetColors = {
      grouping: 'color_coded_group',
      colors: [
        { label: 'Series 1', value: '#E86427' },
        { label: 'Series 2', value: '#279C9C' },
      ],
    };

    const widgetConfig = { groupings: ['color_coded_group'] };
    const widgetConfigHorizontal = {
      groupings: ['color_coded_group'],
      orientation: 'horizontal',
    };

    it('renders the bars with colour coding and default orientation', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="bar"
          chartData={{
            chart: [
              {
                label: 'Series 1',
                value: 123,
              },
              { label: 'Series 2', value: 246 },
            ],
            overlays: null,
          }}
          isColorCoded="true"
          widgetColors={widgetColors}
          config={widgetConfig}
        />
      );

      const chartBars = container.getElementsByClassName('visx-bar');
      const chartBarsOne = chartBars[0];
      const chartBarsTwo = chartBars[1];
      expect(chartBars.length).toBe(2);
      expect(chartBarsOne.getAttribute('fill')).toBe('#279C9C');
      expect(chartBarsTwo.getAttribute('fill')).toBe('#E86427');
    });

    it('renders the bars with colour coding and horizontal orientation', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="bar"
          chartData={{
            chart: [
              {
                label: 'Series 1',
                value: 123,
              },
              { label: 'Series 2', value: 246 },
            ],
            overlays: null,
          }}
          isColorCoded="true"
          widgetColors={widgetColors}
          config={widgetConfigHorizontal}
        />
      );

      const chartBars = container.getElementsByClassName('visx-bar');
      const chartBarsOne = chartBars[0];
      const chartBarsTwo = chartBars[1];
      expect(chartBars.length).toBe(2);
      expect(chartBarsOne.getAttribute('fill')).toBe('#E86427');
      expect(chartBarsTwo.getAttribute('fill')).toBe('#279C9C');
    });
  });

  describe('Colour Coded Bar Chart with FF ["rep-show-player-care-dev-journey"] off', () => {
    beforeEach(() => {
      window.featureFlags = { 'rep-show-player-care-dev-journey': false };
    });

    it('renders the bars with the default colour', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="bar"
          chartData={{
            chart: [
              {
                label: 'Series 1',
                value: 123,
              },
              { label: 'Series 2', value: 246 },
            ],
            overlays: null,
          }}
          isColorCoded="false"
        />
      );

      const graphBars = container.getElementsByClassName('visx-bar');
      expect(graphBars.length).toBe(2);
      expect(graphBars[0].getAttribute('fill')).toBe('#2A6EBB');
      expect(graphBars[1].getAttribute('fill')).toBe('#2A6EBB');
    });
  });

  describe('Stacked Bar', () => {
    it('renders correct number of series and bars', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="summary_stack"
          chartData={{
            chart: [
              {
                label: 'Group Bar',
                values: [
                  {
                    label: 'Series 1',
                    value: 123,
                  },
                  { label: 'Series 2', value: 246 },
                ],
              },
              {
                label: 'Group Bar 2',
                values: [
                  {
                    label: 'Series 1',
                    value: 123,
                  },
                  { label: 'Series 2', value: 246 },
                ],
              },
            ],
            overlays: null,
          }}
        />
      );

      expect(screen.queryByText('Group Bar')).toBeInTheDocument();
      expect(screen.queryByText('Group Bar 2')).toBeInTheDocument();

      expect(container.getElementsByClassName('visx-bar').length).toBe(4);
    });
  });

  describe('Line Chart', () => {
    it('renders series with a line', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="line"
          chartData={{
            chart: [
              {
                label: '2022-01-01',
                value: 123,
              },
              { label: '2022-01-01', value: 246 },
            ],
            overlays: null,
          }}
        />
      );

      expect(container.getElementsByClassName('visx-path').length).toBe(1);
      expect(
        container.getElementsByClassName('visx-circle-glyph').length
      ).toEqual(2);
    });

    it('renders a grouped series with a line', () => {
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="line"
          chartData={{
            chart: [
              {
                label: 'Group Line',
                values: [
                  [
                    {
                      label: '2022-01-01',
                      value: 123,
                    },
                    { label: '2022-01-01', value: 246 },
                  ],
                ],
              },
              {
                label: 'Group Line 2',
                values: [
                  {
                    label: '2022-01-01',
                    value: 123,
                  },
                  { label: '2022-01-01', value: 246 },
                ],
              },
            ],
            overlays: null,
          }}
        />
      );

      expect(container.getElementsByClassName('visx-path').length).toBe(2);
    });
  });
  describe('handle legends', () => {
    const mockData = {
      chart: [
        {
          label: 'Group Line',
          values: [
            [
              {
                label: '2022-01-01',
                value: 123,
              },
              { label: '2022-01-02', value: 246 },
            ],
          ],
        },
        {
          label: 'Group Line 2',
          values: [
            {
              label: '2022-01-03',
              value: 123,
            },
            { label: '2022-01-04', value: 246 },
          ],
        },
      ],
      overlays: null,
    };

    it('handle legend click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="line"
          chartData={mockData}
        />
      );
      const legend1 = screen.getByTestId(`Chart|Legend-Group Line`);
      const legend2 = screen.getByTestId(`Chart|Legend-Group Line 2`);

      await user.click(legend1);

      const groupLineStyle = container.getElementsByClassName('visx-path');

      await waitFor(() => {
        expect(window.getComputedStyle(legend1)['font-weight']).toBe('bold');
      });

      expect(window.getComputedStyle(legend2).opacity).toBe('0.5');
      expect(groupLineStyle[1].outerHTML).toContain('opacity="0.2"');
      expect(groupLineStyle[0].outerHTML).toContain('opacity="1"');

      expect(screen.queryByText('2022-01-03')).not.toBeInTheDocument();
      expect(screen.queryByText('2022-01-04')).not.toBeInTheDocument();
    });

    it('render overlay', async () => {
      const updatedMockData = {
        ...mockData,
        overlays: [{ label: 'Overlay Testing', value: 110 }],
      };
      const { container } = render(
        <XYChart
          width={500}
          height={500}
          chartType="line"
          chartData={updatedMockData}
        />
      );
      const paths = container.getElementsByClassName('visx-path');

      await waitFor(() => {
        expect(paths[2].id).toContain('overlay-0');
      });
    });
  });
});
