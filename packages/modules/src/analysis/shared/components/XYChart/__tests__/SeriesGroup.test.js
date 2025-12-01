import { render } from '@testing-library/react';
import SeriesGroup from '../components/SeriesGroup';
import { SERIES_TYPES } from '../constants';

const createMockComponent = (name, hasChildren = false) => {
  return hasChildren
    ? ({ children }) => <div data-testid={name}>{children}</div>
    : () => <div data-testid={name} />;
};

jest.mock('@visx/xychart', () => ({
  AnimatedBarSeries: createMockComponent('AnimatedBarSeries'),
  AnimatedBarStack: createMockComponent('AnimatedBarStack', true),
  AnimatedBarGroup: createMockComponent('AnimatedBarGroup', true),
  AnimatedLineSeries: createMockComponent('AnimatedLineSeries'),
  AnimatedAreaStack: createMockComponent('AnimatedAreaStack', true),
  AnimatedAreaSeries: createMockComponent('AnimatedAreaSeries'),
  GlyphSeries: createMockComponent('GlyphSeries'),
}));

jest.mock('../components/DataLabel', () => () => <></>);
jest.mock('../components/GroupDataLabel', () => () => <></>);
jest.mock('../components/StackDataLabel', () => () => <></>);
jest.mock('../components/CustomAreaGlyph', () => () => <></>);

jest.mock('../hooks/useMultiSeriesScale', () => () => ({
  convertValue: (id, value) => value,
}));

jest.mock('../hooks/useProcessSeriesGroupData', () => () => ({
  processData: (data) => data,
}));

const defaultProps = {
  id: 'series1',
  data: [
    {
      label: 'Group A',
      values: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ],
    },
  ],
  valueAccessor: jest.fn((d) => d.y),
  categoryAccessor: jest.fn((d) => d.x),
  type: SERIES_TYPES.bar,
  dataType: 'category',
  showLabels: true,
  renderAs: 'stack',
};

describe('SeriesGroup', () => {
  it('renders stacked bar chart when type is bar and renderAs is stack', () => {
    const { getByTestId } = render(<SeriesGroup {...defaultProps} />);
    expect(getByTestId('AnimatedBarStack')).toBeInTheDocument();
    expect(getByTestId('AnimatedBarSeries')).toBeInTheDocument();
  });

  it('renders grouped bar chart when type is bar and renderAs is group', () => {
    const props = { ...defaultProps, renderAs: 'group' };
    const { getByTestId } = render(<SeriesGroup {...props} />);
    expect(getByTestId('AnimatedBarGroup')).toBeInTheDocument();
    expect(getByTestId('AnimatedBarSeries')).toBeInTheDocument();
  });

  it('renders line chart with glyphs when type is line', () => {
    const props = { ...defaultProps, type: SERIES_TYPES.line };
    const { getByTestId } = render(<SeriesGroup {...props} />);
    expect(getByTestId('AnimatedLineSeries')).toBeInTheDocument();
    expect(getByTestId('GlyphSeries')).toBeInTheDocument();
  });

  it('renders area chart when type is area', () => {
    const props = { ...defaultProps, type: SERIES_TYPES.area };
    const { getByTestId } = render(<SeriesGroup {...props} />);
    expect(getByTestId('AnimatedAreaStack')).toBeInTheDocument();
    expect(getByTestId('AnimatedAreaSeries')).toBeInTheDocument();
  });
});
