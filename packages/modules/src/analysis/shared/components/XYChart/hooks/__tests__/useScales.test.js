import { renderHook } from '@testing-library/react-hooks';
import useChartContext from '../useChartContext';
import useScales from '../useScales';

jest.mock('../useChartContext');

describe('analysis XYChart hooks | useScales', () => {
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
    controls: {
      scroll: {
        isActive: false,
        startIndex: 0,
        endIndex: 0,
      },
    },
  };

  beforeEach(() => {
    useChartContext.mockReturnValue(MOCK_CONTEXT);
  });

  it('returns the correct xScale for category chart', () => {
    const { result } = renderHook(() => useScales());

    expect(result.current.xScale).toStrictEqual(
      expect.objectContaining({
        type: 'band',
        domain: ['Label 1', 'Label 2', 'Label 3'],
        padding: 0.7,
      })
    );
  });

  it('returns the correct xScale for longitudinal chart', () => {
    useChartContext.mockReturnValueOnce({
      ...MOCK_CONTEXT,
      series: {
        123: {
          valueAccessor: ({ value }) => value,
          categoryAccessor: ({ label }) => label,
          data: [
            {
              label: '2024-04-15',
              value: 12,
            },
            {
              label: '2024-04-16',
              value: 20,
            },
            {
              label: '2024-04-17',
              value: 20,
            },
            {
              label: '2024-04-19',
              value: 20,
            },
          ],
          dataType: 'time',
        },
      },
      controls: {
        scroll: {
          isActive: false,
          startIndex: 0,
          endIndex: 0,
        },
      },
    });

    const { result } = renderHook(() => useScales());

    expect(result.current.xScale).toStrictEqual(
      expect.objectContaining({
        type: 'band',
        // domain should have one value per day
        domain: [
          '2024-04-15',
          '2024-04-16',
          '2024-04-17',
          '2024-04-18', // note this is expected even though it is not returned in data
          '2024-04-19',
        ],
        padding: 0.7,
      })
    );
  });

  describe('when aggregating values', () => {
    it('returns the correct domain for weekly', () => {
      useChartContext.mockReturnValueOnce({
        ...MOCK_CONTEXT,
        series: {
          123: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            data: [
              {
                label: '2024-04-15',
                value: 12,
              },
              {
                label: '2024-04-16',
                value: 20,
              },
              {
                label: '2024-04-17',
                value: 20,
              },
              {
                label: '2024-04-25',
                value: 20,
              },
            ],
            dataType: 'time',
            aggregateValues: {
              aggregatePeriod: 'weekly',
              aggregateMethod: 'sum',
            },
          },
        },
        controls: {
          scroll: {
            isActive: false,
            startIndex: 0,
            endIndex: 0,
          },
        },
      });

      const { result } = renderHook(() => useScales());

      expect(result.current.xScale).toStrictEqual(
        expect.objectContaining({
          domain: ['2024-04-15', '2024-04-22'],
        })
      );
    });
    it('returns the correct domain for monthly', () => {
      useChartContext.mockReturnValueOnce({
        ...MOCK_CONTEXT,
        series: {
          123: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            data: [
              {
                label: '2024-04-15',
                value: 12,
              },
              {
                label: '2024-04-16',
                value: 20,
              },
              {
                label: '2024-05-17',
                value: 20,
              },
              {
                label: '2024-06-25',
                value: 20,
              },
            ],
            dataType: 'time',
            aggregateValues: {
              aggregatePeriod: 'monthly',
              aggregateMethod: 'sum',
            },
          },
        },
        controls: {
          scroll: {
            isActive: false,
            startIndex: 0,
            endIndex: 0,
          },
        },
      });

      const { result } = renderHook(() => useScales());

      expect(result.current.xScale).toStrictEqual(
        expect.objectContaining({
          domain: ['2024-04-01', '2024-05-01', '2024-06-01'],
        })
      );
    });
  });

  it('returns the correct xScale domain when scroll is active', () => {
    useChartContext.mockReturnValueOnce({
      ...MOCK_CONTEXT,
      controls: {
        ...MOCK_CONTEXT.controls,
        scroll: {
          startIndex: 0,
          endIndex: 1,
          isActive: true,
        },
      },
    });

    const { result } = renderHook(() => useScales());

    expect(result.current.xScale).toStrictEqual(
      expect.objectContaining({
        type: 'band',
        domain: ['Label 1'], // reduces the domain based on the scroll paramters
        padding: 0.7,
      })
    );
  });

  it('returns the correct yScale', () => {
    const { result } = renderHook(() => useScales());

    expect(result.current.yScale).toStrictEqual(
      expect.objectContaining({ type: 'linear', nice: true })
    );
  });
});
