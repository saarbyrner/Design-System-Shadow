import { renderHook } from '@testing-library/react-hooks';
import useScrollControls from '../useScrollControls';
import useChartContext from '../useChartContext';

jest.mock('../useChartContext');

describe('analysis XYChart hooks | useScrollControls', () => {
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

  it('returns the data to read scroll state', () => {
    const { result } = renderHook(() => useScrollControls());
    expect(result.current.scroll).toStrictEqual({
      isActive: false,
      startIndex: 0,
      endIndex: 0,
    });
  });

  it('returns the data to read metadata', () => {
    const { result } = renderHook(() => useScrollControls());
    expect(result.current.metadata).toStrictEqual({
      shouldHaveScrollBar: false,
      numItems: 3,
    });
  });

  it('returns the data to access method to set scroll', () => {
    const { result } = renderHook(() => useScrollControls());
    expect(result.current.setScroll).toBeDefined();
  });

  describe('shouldHaveScrollBar', () => {
    it('returns false if scale type is time', () => {
      useChartContext.mockReturnValueOnce({
        ...MOCK_CONTEXT,
        series: {
          246: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ anotherKey }) => anotherKey,
            data: [
              {
                anotherKey: 'Label 3',
                value: 5,
              },
            ],
            dataType: 'time',
          },
        },
      });
      const { result } = renderHook(() => useScrollControls());
      expect(result.current.metadata.shouldHaveScrollBar).toEqual(false);
    });

    it('returns false if parent width is null', () => {
      const { result } = renderHook(() => useScrollControls());
      expect(result.current.metadata.shouldHaveScrollBar).toEqual(false);
    });

    it('returns false if min width is lesser than parent width', () => {
      useChartContext.mockReturnValueOnce({
        ...MOCK_CONTEXT,
        parentSize: {
          width: 400,
          height: null,
        },
      });
      const { result } = renderHook(() => useScrollControls());
      expect(result.current.metadata.shouldHaveScrollBar).toEqual(false);
    });

    it('returns true if min width is greater than parent width', () => {
      useChartContext.mockReturnValueOnce({
        ...MOCK_CONTEXT,
        parentSize: {
          width: 270,
          height: null,
        },
      });
      const { result } = renderHook(() => useScrollControls());
      expect(result.current.metadata.shouldHaveScrollBar).toEqual(true);
    });
  });
});
