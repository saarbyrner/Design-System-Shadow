/* eslint-env jest */
import { render } from '@testing-library/react';
import { DataContext } from '@visx/xychart';
import { CHART_BACKGROUND_ZONE_CONDITIONS } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel/constants';
import { colors } from '@kitman/common/src/variables';
import getContrastingColor from '@kitman/common/src/utils/getContrastingColor';
import ReferenceLine from '../components/ReferenceLine';
import { AXIS_CONFIG } from '../constants';
import { getIsFormattingOutOfChartBounds } from '../utils';

// --- Mocks ---
jest.mock('../hooks/useMultiSeriesScale', () => () => ({
  convertValueWithRanges: (v) => v / 2, // simulate different scale on right axis
  ranges: { left: [0, 200], right: [0, 400] },
}));

jest.mock('../utils', () => ({
  getIsFormattingOutOfChartBounds: jest.fn(() => false),
}));

// Mock getContrastingColor; implementation assigned in beforeEach to avoid require usage
jest.mock('@kitman/common/src/utils/getContrastingColor', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Capture Label props (similar to BackgroundZone approach) without rendering actual Label
const LABEL_CALLS_KEY = '__referenceLineLabelCalls';
jest.mock('@visx/annotation', () => {
  const calls = [];
  function Label(props) {
    calls.push(props);
    return null;
  }
  if (typeof global !== 'undefined') global[LABEL_CALLS_KEY] = calls;
  return { Label };
});

const getLabelCalls = () => global[LABEL_CALLS_KEY] || [];

// Helper to render with DataContext
const renderWithContext = (
  ui,
  {
    width = 500,
    height = 300,
    margin = { top: 0, right: 10, bottom: 0, left: 10 },
    scaleFactor = 10,
  } = {}
) => {
  const yScale = (v) => v * scaleFactor;
  yScale.domain = () => [0, 200];
  return render(
    <DataContext.Provider value={{ yScale, width, height, margin }}>
      <svg width={width} height={height} data-testid="reference-line-test-svg">
        {ui}
      </svg>
    </DataContext.Provider>
  );
};

describe('ReferenceLine', () => {
  beforeEach(() => {
    if (global[LABEL_CALLS_KEY]) global[LABEL_CALLS_KEY].length = 0;
    getIsFormattingOutOfChartBounds.mockReset();
    getIsFormattingOutOfChartBounds.mockReturnValue(false);
    getContrastingColor.mockReturnValue(colors.white);
  });

  it('renders line at correct Y for left axis', () => {
    const { container } = renderWithContext(
      <ReferenceLine
        color={colors.blue_100}
        axis={AXIS_CONFIG.left}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.greater_than}
        value={12} // y = 12 * 10 = 120
        label="GT"
        isPrimaryAxis
      />
    );
    const line = container.querySelector('line');
    expect(line?.getAttribute('y1')).toBe('120');
    expect(line?.getAttribute('y2')).toBe('120');
    expect(line?.getAttribute('stroke')).toBe(colors.blue_100);
  });

  it('converts value for right axis using convertValueWithRanges', () => {
    const { container } = renderWithContext(
      <ReferenceLine
        color={colors.red_100}
        axis={AXIS_CONFIG.right}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.greater_than}
        value={50} // converted to 25 => y=250
        label="Right"
        isPrimaryAxis={false}
      />
    );
    const line = container.querySelector('line');
    expect(line?.getAttribute('y1')).toBe('250');
  });

  it('positions label using fixed verticalAnchor end and +1 offset (less_than)', () => {
    renderWithContext(
      <ReferenceLine
        color={colors.green_100}
        axis={AXIS_CONFIG.left}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.less_than}
        value={5} // y=50
        label="Less"
        isPrimaryAxis
      />
    );
    const call = getLabelCalls()[0];
    expect(call.verticalAnchor).toBe('end');
    expect(call.y).toBe(51); // y + 1 offset
  });

  it('positions label using fixed verticalAnchor end and +1 offset (greater_than)', () => {
    renderWithContext(
      <ReferenceLine
        color={colors.orange_100}
        axis={AXIS_CONFIG.left}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.greater_than}
        value={5} // y=50
        label="Greater"
        isPrimaryAxis
      />
    );
    const call = getLabelCalls()[0];
    expect(call.verticalAnchor).toBe('end');
    expect(call.y).toBe(51); // y + 1 offset (implementation currently does not invert)
  });

  it('does not render label when label prop missing', () => {
    renderWithContext(
      <ReferenceLine
        color={colors.purple_100}
        axis={AXIS_CONFIG.left}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.greater_than}
        value={10}
        isPrimaryAxis
      />
    );
    expect(getLabelCalls().length).toBe(0);
  });

  it('returns null when value out of bounds (utility true)', () => {
    getIsFormattingOutOfChartBounds.mockReturnValueOnce(true);
    const { container } = renderWithContext(
      <ReferenceLine
        color={colors.yellow_100}
        axis={AXIS_CONFIG.left}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.greater_than}
        value={10}
        label="Hidden"
        isPrimaryAxis
      />
    );
    expect(container.querySelector('line')).toBeNull();
    expect(getLabelCalls().length).toBe(0);
  });

  it('uses contrasting color for label background text color (mocked)', () => {
    renderWithContext(
      <ReferenceLine
        color={colors.blue_80}
        axis={AXIS_CONFIG.left}
        condition={CHART_BACKGROUND_ZONE_CONDITIONS.less_than}
        value={3}
        label="Contrast"
        isPrimaryAxis
      />
    );
    const call = getLabelCalls()[0];
    expect(call.fontColor).toBe(colors.white);
  });
});
