import { render } from '@testing-library/react';
import uuid from 'uuid';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import $ from 'jquery';
import { colors } from '@kitman/common/src/variables';
import Sparkline from '../../components/Sparkline';

jest.mock('highcharts/highstock', () => ({
  Chart: jest.fn(() => ({ destroy: jest.fn() })),
}));
jest.mock('highcharts/modules/no-data-to-display', () => () => {});

jest.mock('jquery', () => {
  const ajax = jest.fn();
  return { __esModule: true, ajax, default: { ajax } };
});

const status = { status_id: uuid.v4(), variables: [{ source: 'kitman:tv' }] };
const baseProps = {
  status,
  athleteId: '1',
  isVisible: true,
  t: i18nextTranslateStub(),
};

describe('Sparkline Component', () => {
  beforeEach(() => {
    $.ajax.mockReset();
  });

  it('renders', () => {
    const { container } = render(<Sparkline {...baseProps} />);
    expect(container.querySelector('.dashboardSparkline')).toBeInTheDocument();
  });

  it('shows the loading spinner on mount', () => {
    const { container } = render(
      <Sparkline {...baseProps} isVisible={false} />
    );
    const root = container.querySelector('.dashboardSparkline');
    expect(root).toHaveClass('dashboardSparkline--loading');
    expect(container.querySelector('.dashboardSparkline__graph')).toHaveStyle(
      'display: none'
    );
  });

  it("doesn't request data if hidden", () => {
    $.ajax.mockImplementation(() => ({}));
    const { rerender } = render(<Sparkline {...baseProps} isVisible={false} />);
    rerender(<Sparkline {...baseProps} isVisible={false} />);
    expect($.ajax).not.toHaveBeenCalled();
  });

  it('requests data with correct params then shows graph', () => {
    const successPayload = { min: 1, max: 2, series_data: [[1, 2]] };
    $.ajax.mockImplementation((cfg) => {
      cfg.success(successPayload);
      return { abort: jest.fn() };
    });
    const { container, rerender } = render(
      <Sparkline {...baseProps} isVisible={false} />
    );
    rerender(<Sparkline {...baseProps} isVisible />);
    expect($.ajax).toHaveBeenCalledTimes(1);
    const callArgs = $.ajax.mock.calls[0][0];
    expect(callArgs.url).toBe('/dashboards/sparkline_data');
    expect(callArgs.data).toEqual({
      status_id: baseProps.status.status_id,
      athlete_id: baseProps.athleteId,
    });
    const root = container.querySelector('.dashboardSparkline');
    expect(root).not.toHaveClass('dashboardSparkline--loading');
    expect(container.querySelector('.dashboardSparkline__graph')).toHaveStyle(
      'display: block'
    );
  });

  it('does not refetch after first successful load', () => {
    const successPayload = { min: 1, max: 2, series_data: [[1, 2]] };
    $.ajax.mockImplementation((cfg) => {
      cfg.success(successPayload);
      return { abort: jest.fn() };
    });
    const { rerender } = render(<Sparkline {...baseProps} isVisible={false} />);
    rerender(<Sparkline {...baseProps} isVisible />);
    expect($.ajax).toHaveBeenCalledTimes(1);
    rerender(<Sparkline {...baseProps} isVisible={false} />);
    rerender(<Sparkline {...baseProps} isVisible />);
    expect($.ajax).toHaveBeenCalledTimes(1);
  });

  it('shows error status when request fails', () => {
    $.ajax.mockImplementation((cfg) => {
      cfg.error({});
      return { abort: jest.fn() };
    });
    const { container, rerender } = render(
      <Sparkline {...baseProps} isVisible={false} />
    );
    rerender(<Sparkline {...baseProps} isVisible />);
    const root = container.querySelector('.dashboardSparkline');
    expect(root).toHaveClass('dashboardSparkline--error');
    expect(container.querySelector('.dashboardSparkline__graph')).toHaveStyle(
      'display: none'
    );
  });

  describe('buildChartData', () => {
    it('returns empty array for empty data', () => {
      const instance = new Sparkline(baseProps);
      expect(instance.buildChartData([])).toEqual([]);
    });

    it('applies alarm colour to last point', () => {
      const props = { ...baseProps, alarmColour: colors.p6 };
      const instance = new Sparkline(props);
      const input = [
        [1, 2],
        [4, 1],
        [0, 6],
      ];
      expect(instance.buildChartData(input)).toEqual([
        [1, 2],
        [4, 1],
        { x: 0, y: 6, color: colors.p6 },
      ]);
    });
  });

  describe('getNoDataMessage', () => {
    it('returns No Available Data for 0 datapoints', () => {
      const props = { ...baseProps, numberOfDatapoints: 0 };
      const instance = new Sparkline(props);
      expect(instance.getNoDataMessage()).toBe('No Available Data');
    });
    it('returns Not Enough Data when >0 datapoints', () => {
      const props = { ...baseProps, numberOfDatapoints: 1 };
      const instance = new Sparkline(props);
      expect(instance.getNoDataMessage()).toBe('Not Enough Data');
    });
  });
});
