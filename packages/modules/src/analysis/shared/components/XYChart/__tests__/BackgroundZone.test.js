import { render } from '@testing-library/react';
import { XYChart, DataContext } from '@visx/xychart';
import { colors } from '@kitman/common/src/variables';
import BackgroundZone from '../components/BackgroundZone';
import useMultiSeriesScale from '../hooks/useMultiSeriesScale';

// Mock ResizeObserver for visx Label component
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the useMultiSeriesScale hook
jest.mock('../hooks/useMultiSeriesScale');

const mockUseMultiSeriesScale = useMultiSeriesScale;

const mockProps = {
  color: colors.red_100,
  from: 20,
  to: 80,
  axis: 'left',
  label: 'Test Background Zone',
  isPrimaryAxis: true,
};

describe('XY Chart| <BackgroundZone />', () => {
  const setupMocks = () => {
    const margin = { left: 50, right: 30, top: 20, bottom: 40 };
    const width = 400;
    const height = 300;

    const yScale = jest.fn().mockImplementation((value) => {
      // Mock yScale to convert data values to pixel positions
      // Higher values should result in lower y positions (top of chart)
      return 300 - value * 2;
    });
    // Provide a domain so BackgroundZone can derive domainMax
    yScale.domain = () => [0, 100];

    const dataContext = {
      yScale,
      margin,
      width,
      height,
    };

    return { dataContext };
  };

  const renderBackgroundZone = (props = mockProps, dataContext = null) => {
    const { dataContext: defaultContext } = setupMocks();
    const contextValue = dataContext || defaultContext;

    return render(
      <XYChart
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
        height={300}
        width={400}
      >
        <DataContext.Provider value={contextValue}>
          <BackgroundZone {...props} />
        </DataContext.Provider>
      </XYChart>
    );
  };

  beforeEach(() => {
    mockUseMultiSeriesScale.mockReturnValue({
      convertValueWithRanges: jest.fn((value, primaryRange, secondaryRange) => {
        // Simple conversion for testing: convert from secondary to primary range proportionally
        const [secMin, secMax] = secondaryRange;
        const [primMin, primMax] = primaryRange;
        const normalized = (value - secMin) / (secMax - secMin);
        return primMin + normalized * (primMax - primMin);
      }),
      ranges: {
        left: [0, 100],
        right: [0, 200],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render background zone when yScale is not available', () => {
    const { dataContext } = setupMocks();
    const contextWithoutYScale = { ...dataContext, yScale: null };

    const { container } = renderBackgroundZone(mockProps, contextWithoutYScale);

    const backgroundElements = container.querySelectorAll(
      `rect[fill="${colors.red_100}"], line[stroke="${colors.red_100}"]`
    );
    expect(backgroundElements).toHaveLength(0);
  });

  it('does not render background zone when zone is out of bounds', () => {
    const props = {
      color: colors.red_100,
      from: 1000, // out of axis range, left: [0, 100]
      axis: 'left',
      label: 'Test Background Zone',
      isPrimaryAxis: true,
    };

    const { container } = renderBackgroundZone(props);

    const backgroundElements = container.querySelectorAll(
      `rect[fill="${colors.red_100}"], line[stroke="${colors.red_100}"]`
    );
    expect(backgroundElements).toHaveLength(0);
  });

  it('renders a background zone with rect and line elements', () => {
    renderBackgroundZone();

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);
    const line = document.querySelector(`line[stroke="${colors.red_100}"]`);

    expect(rect).toBeInTheDocument();
    expect(line).toBeInTheDocument();
  });

  it('applies correct color to rect and line elements', () => {
    renderBackgroundZone();

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);
    const line = document.querySelector(`line[stroke="${colors.red_100}"]`);

    expect(rect).toHaveAttribute('fill', colors.red_100);
    expect(line).toHaveAttribute('stroke', colors.red_100);
  });

  it('applies correct opacity and stroke properties', () => {
    renderBackgroundZone();

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);
    const line = document.querySelector(`line[stroke="${colors.red_100}"]`);

    expect(rect).toHaveAttribute('fill-opacity', '0.3');
    expect(line).toHaveAttribute('stroke-width', '3');
    expect(line).toHaveAttribute('vector-effect', 'non-scaling-stroke');
    expect(line).toHaveAttribute('shape-rendering', 'crispEdges');
  });

  it('calculates correct bounds for left axis when left is primary axis', () => {
    renderBackgroundZone();

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);
    const line = document.querySelector(`line[stroke="${colors.red_100}"]`);

    // Expected calculations:
    // fromY = yScale(20) = 300 - (20 * 2) = 260
    // toY = yScale(80) = 300 - (80 * 2) = 140
    // BOUNDS.left = margin.left = 50
    // BOUNDS.right = width - margin.right - margin.left = 400 - 30 - 50 = 320
    // BOUNDS.top = toY = 140
    // BOUNDS.bottom = Math.max(260, 140) - Math.min(260, 140) = 120

    expect(rect).toHaveAttribute('x', '50');
    expect(rect).toHaveAttribute('y', '140');
    expect(rect).toHaveAttribute('width', '320');
    expect(rect).toHaveAttribute('height', '120');

    // Line should be at left edge for left axis
    expect(line).toHaveAttribute('x1', '50');
    expect(line).toHaveAttribute('x2', '50');
    expect(line).toHaveAttribute('y1', '140');
    expect(line).toHaveAttribute('y2', '260');
  });

  it('converts values for right axis when not primary axis', () => {
    const mockConvertValueWithRanges = jest.fn((value) => value * 2);

    mockUseMultiSeriesScale.mockReturnValue({
      convertValueWithRanges: mockConvertValueWithRanges,
      ranges: {
        left: [0, 100],
        right: [0, 200],
      },
    });

    renderBackgroundZone({ ...mockProps, axis: 'right', isPrimaryAxis: false });

    // Verify that convertValueWithRanges was called with correct parameters
    expect(mockConvertValueWithRanges).toHaveBeenCalledWith(
      20,
      [0, 100],
      [0, 200]
    );
    expect(mockConvertValueWithRanges).toHaveBeenCalledWith(
      80,
      [0, 100],
      [0, 200]
    );
  });

  it('positions line correctly for right axis', () => {
    renderBackgroundZone({ ...mockProps, axis: 'right' });

    const line = document.querySelector(`line[stroke="${colors.red_100}"]`);

    // rightX = BOUNDS.left + BOUNDS.right = 50 + 320 = 370
    expect(line).toHaveAttribute('x1', '370');
    expect(line).toHaveAttribute('x2', '370');
  });

  it('renders label when provided', () => {
    renderBackgroundZone();

    const labelText = document.body.textContent;
    expect(labelText).toContain('Test Background Zone');
  });

  it('does not render label when not provided', () => {
    renderBackgroundZone({ ...mockProps, label: undefined });

    const foreignObject = document.querySelector('foreignObject');
    expect(foreignObject).not.toBeInTheDocument();
  });

  it('uses axis range min as default from value when from is undefined', () => {
    renderBackgroundZone({ ...mockProps, from: undefined });

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);

    // Should use 0 as default from value
    // fromY = yScale(0) = 300 - (0 * 2) = 300
    // toY = yScale(80) = 300 - (80 * 2) = 140
    // height = Math.max(300, 140) - Math.min(300, 140) = 160
    expect(rect).toHaveAttribute('height', '160');
  });

  it('uses axis range max when to is undefined', () => {
    renderBackgroundZone({ ...mockProps, to: undefined });

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);

    // Should use ranges.left[1] = 100 as default to value
    // fromY = yScale(20) = 300 - (20 * 2) = 260
    // toY = yScale(100) = 300 - (100 * 2) = 100
    // height = Math.max(260, 100) - Math.min(260, 100) = 160
    expect(rect).toHaveAttribute('height', '160');
  });

  it('extends to domain max for greater_than when to undefined', () => {
    const { dataContext } = setupMocks();

    dataContext.yScale.domain = () => [0, 130];

    renderBackgroundZone(
      { ...mockProps, to: undefined, condition: 'greater_than' },
      dataContext
    );

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);
    // from = 20 -> fromY = 300 - 40 = 260
    // domainMax fallback (130) -> toY = 300 - 260 = 40
    // height = 260 - 40 = 220
    expect(rect).toHaveAttribute('y', '40');
    expect(rect).toHaveAttribute('height', '220');
  });

  it('calculates bounds correctly with different from/to values', () => {
    renderBackgroundZone({ ...mockProps, from: 10, to: 90 });

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);

    // fromY = yScale(10) = 300 - (10 * 2) = 280
    // toY = yScale(90) = 300 - (90 * 2) = 120
    // height = Math.max(280, 120) - Math.min(280, 120) = 160
    expect(rect).toHaveAttribute('y', '120');
    expect(rect).toHaveAttribute('height', '160');
  });

  it('anchors rect to top of chart when "props.to" is out of bounds', () => {
    renderBackgroundZone({ ...mockProps, to: 200 });

    const rect = document.querySelector(`rect[fill="${colors.red_100}"]`);
    expect(rect).toHaveAttribute('y', '20'); // margin.top = 20
  });
});
