import { render, screen } from '@testing-library/react';
import ScrollBar from '../components/ScrollBar';
import useChartContext from '../hooks/useChartContext';

jest.mock('../hooks/useChartContext');

describe('analysis XYChart|<ScrollBar />', () => {
  const MOCK_CONTEXT = {
    series: {
      123: {
        valueAccessor: ({ value }) => value,
        categoryAccessor: ({ label }) => label,
        data: [
          {
            label: 'Label 1',
            value: 12,
          },
          {
            label: 'Label 2',
            value: 20,
          },
        ],
        dataType: 'category',
      },
      246: {
        valueAccessor: ({ value }) => value,
        categoryAccessor: ({ anotherKey }) => anotherKey,
        data: [
          {
            anotherKey: 'Label 3',
            value: 5,
          },
        ],
        dataType: 'category',
      },
    },
    parentSize: {
      width: null,
      height: null,
    },
    controls: {
      scroll: {
        isActive: false,
        startIndex: 0,
        endIndex: 0,
      },
    },
    controlsApi: {
      setScroll: () => {},
      setHiddenSeries: () => {},
    },
  };

  beforeEach(() => {
    useChartContext.mockReturnValue(MOCK_CONTEXT);
  });

  it('should not load if parent width is null', () => {
    useChartContext.mockReturnValueOnce({
      ...MOCK_CONTEXT,
      parentSize: {
        width: null,
        height: null,
      },
    });
    render(<ScrollBar />);
    expect(
      screen.queryByTestId('XYChart|ScrollControls|Zoom')
    ).not.toBeInTheDocument();
  });

  it('should not load if shouldHaveScrollBar is false', () => {
    useChartContext.mockReturnValueOnce({
      ...MOCK_CONTEXT,
      parentSize: {
        width: 300,
        height: null,
      },
    });
    render(<ScrollBar />);
    expect(
      screen.queryByTestId('XYChart|ScrollControls|Zoom')
    ).not.toBeInTheDocument();
  });

  it('should load if shouldHaveScrollBar is true', () => {
    useChartContext.mockReturnValue({
      ...MOCK_CONTEXT,
      parentSize: {
        width: 270,
        height: null,
      },
    });
    render(<ScrollBar />);
    expect(
      screen.queryByTestId('XYChart|ScrollControls|Zoom')
    ).toBeInTheDocument();
  });
});
