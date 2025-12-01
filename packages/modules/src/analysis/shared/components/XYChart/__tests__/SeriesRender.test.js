import { render } from '@testing-library/react';
import SeriesRender from '../components/SeriesRender';
import { SERIES_TYPES, AXIS_CONFIG } from '../constants';

jest.mock('@visx/xychart', () => ({
  AnimatedBarSeries: () => <div data-testid="AnimatedBarSeries" />,
  AnimatedLineSeries: () => <div data-testid="AnimatedLineSeries" />,
  AnimatedAreaSeries: () => <div data-testid="AnimatedAreaSeries" />,
  GlyphSeries: () => <div data-testid="GlyphSeries" />,
}));

jest.mock('../components/DataLabel', () => () => (
  <div data-testid="DataLabel" />
));

const defaultProps = {
  id: 'series1',
  data: [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
  ],
  valueAccessor: jest.fn((d) => d.y),
  categoryAccessor: jest.fn((d) => d.x),
  axisConfig: AXIS_CONFIG.left,
  type: SERIES_TYPES.bar,
  dataType: 'category',
  showLabels: true,
};

describe('SeriesRender', () => {
  it('renders AnimatedBarSeries for bar type', () => {
    const { getByTestId } = render(<SeriesRender {...defaultProps} />);
    expect(getByTestId('AnimatedBarSeries')).toBeInTheDocument();
  });

  it('renders AnimatedLineSeries and GlyphSeries for line type', () => {
    const props = { ...defaultProps, type: SERIES_TYPES.line };
    const { getByTestId } = render(<SeriesRender {...props} />);
    expect(getByTestId('AnimatedLineSeries')).toBeInTheDocument();
    expect(getByTestId('GlyphSeries')).toBeInTheDocument();
  });

  it('renders AnimatedAreaSeries and GlyphSeries for area type', () => {
    const props = { ...defaultProps, type: SERIES_TYPES.area };
    const { getByTestId } = render(<SeriesRender {...props} />);
    expect(getByTestId('AnimatedAreaSeries')).toBeInTheDocument();
    expect(getByTestId('GlyphSeries')).toBeInTheDocument();
  });
});
