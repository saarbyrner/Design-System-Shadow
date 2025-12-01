import { render, screen } from '@testing-library/react';
import { XYChart } from '@visx/xychart';
import * as utils from '@kitman/modules/src/analysis/TemplateDashboards/components/XYChart/utils';
import DataLabel from '../components/DataLabel';

const valueAccessor = ({ value }) => value ?? null;
const labelAccessor = ({ value }) => value ?? null;
const categoryAccessor = (category) => category?.label ?? '';
const valueFormatter = ({ value }) => value.toString();
const data = [
  { label: '2024-01-02', value: '64' },
  { label: '2024-01-05', value: '100' },
  { label: '2024-01-06', value: '110' },
];

const props = {
  id: 123,
  data,
  valueAccessor,
  categoryAccessor,
  labelAccessor,
  valueFormatter,
};

describe('XY Chart|<DataLabel />', () => {
  const labelTextAccessor = jest.spyOn(utils, 'labelTextAccessor');
  const originalCanvasContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = () => ({
      measureText: (text) => ({ width: text.length }),
    });
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalCanvasContext;
  });

  const renderComponent = (defaultProps) =>
    render(
      <XYChart
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
        height={300}
        width={400}
      >
        <DataLabel {...defaultProps} />
      </XYChart>
    );

  it('renders all the glyph series and their respective data labels', () => {
    renderComponent({ ...props, showLabels: true });

    const glyphSeries = screen.getAllByTestId('XYChart|DataLabel');

    glyphSeries.forEach((glyph) => {
      expect(glyph).toBeInTheDocument();
      expect(glyph).toHaveStyle('opacity: 1');
    });

    data.forEach((datum) => {
      expect(screen.getByText(datum.value)).toBeVisible();
    });
  });

  it('does not render any labels when data is empty', () => {
    renderComponent({ ...props, showLabels: true, data: [] });

    const glyphSeries = screen.queryAllByTestId('XYChart|DataLabel');
    expect(glyphSeries.length).toBe(0);
  });

  it('uses labelTextAccessor for group series and renders labels correctly', () => {
    renderComponent({ ...props, showLabels: true, displayAllLabels: true });

    data.forEach((datum) => {
      const text = labelTextAccessor(datum);
      expect(screen.getByText(String(text))).toBeVisible();
    });
  });

  it('does not use labelTextAccessor when is not group series', () => {
    renderComponent({ ...props, showLabels: true, displayAllLabels: false });

    expect(labelTextAccessor).not.toHaveBeenCalled();

    data.forEach((datum) => {
      const text = valueAccessor(datum);
      expect(screen.getByText(String(text))).toBeVisible();
    });
  });
});
