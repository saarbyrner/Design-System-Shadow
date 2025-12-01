import { render, screen } from '@testing-library/react';
import { XYChart, DataContext } from '@visx/xychart';
import CustomAreaGlyph from '../components/CustomAreaGlyph';

const mockData = {
  dataKey: 'series1',
  data: [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
  ],
  showLabels: true,
  valueFormatter: ({ value }) => String(value),
  labelAccessor: ({ value }) => value ?? null,
};

const mockDataRegistry = {
  data: [
    [5, 10],
    [15, 20],
  ],
};

const renderCustomAreaGlyph = (
  xScale,
  yScale,
  dataRegistry,
  props = mockData
) => {
  return render(
    <XYChart
      xScale={{ type: 'band' }}
      yScale={{ type: 'linear' }}
      height={300}
      width={400}
    >
      <DataContext.Provider
        value={{
          xScale,
          yScale,
          dataRegistry,
          colorScale: () => '#000',
        }}
      >
        <CustomAreaGlyph {...props} />
      </DataContext.Provider>
    </XYChart>
  );
};

describe('XY Chart|<CustomAreaGlyph />', () => {
  const setupScales = () => {
    const xScale = jest.fn().mockImplementation((label) => {
      return label === 'A' ? 50 : 150;
    });
    xScale.bandwidth = jest.fn().mockReturnValue(100);

    const yScale = jest.fn().mockReturnValue(200);

    const dataRegistry = new Map().set(mockData.dataKey, {
      data: mockDataRegistry.data,
    });

    return { xScale, yScale, dataRegistry };
  };

  it('renders glyphs and labels for each data point', () => {
    const { xScale, yScale, dataRegistry } = setupScales();
    renderCustomAreaGlyph(xScale, yScale, dataRegistry);

    // Labels
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    // Glyphs
    const circles = document.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });

  it('hides glyphs when hideSeries is true', () => {
    const { xScale, yScale, dataRegistry } = setupScales();
    renderCustomAreaGlyph(xScale, yScale, dataRegistry, {
      ...mockData,
      hideSeries: true,
    });

    const gElements = document.querySelectorAll('g');
    gElements.forEach((g) => {
      expect(g).toHaveStyle('opacity: 0');
    });
  });

  it('shows labels only when showLabels is true', () => {
    const { xScale, yScale, dataRegistry } = setupScales();
    renderCustomAreaGlyph(xScale, yScale, dataRegistry, {
      ...mockData,
      showLabels: false,
    });

    const textElements = document.querySelectorAll('text');
    textElements.forEach((text) => {
      expect(text).toHaveStyle('opacity: 0');
    });
  });
});
