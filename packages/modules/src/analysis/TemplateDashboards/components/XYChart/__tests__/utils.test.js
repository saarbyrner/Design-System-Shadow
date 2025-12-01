import { scaleTime } from '@visx/scale';
import {
  valueAccessor,
  labelAccessor,
  getMinAndMax,
  getValueScale,
  getLabelScale,
  mapSummaryStackData,
  flattenData,
  getLabelAxisTickFormatter,
  getBarChartAxisLabelTrimmed,
  getLabelAxisNumTicks,
  isDataGrouped,
  getBarValueDomain,
  processData,
  getChartHeight,
  getLineColor,
  calcMarginTop,
  calcMarginBottom,
  calcMarginRight,
  calcMarginLeft,
  formatValueTick,
  labelTextAccessor,
  formatVerticalAxisTicks,
} from '../utils';

jest.mock('@visx/scale');

const TEST_GROUP_DATA = [
  {
    label: 'Group',
    values: [
      { label: 'Value', value: 123 },
      { label: 'Value 1', value: 246 },
      { label: 'Value 2', value: 544 },
    ],
  },
  {
    label: 'Another Group',
    values: [
      { label: 'Another Value', value: 111 },
      { label: 'Another Value 1', value: 222 },
      { label: 'Another Value 2', value: 332 },
    ],
  },
  {
    label: 'And Another Group',
    values: [
      { label: 'And Another Value', value: 111 },
      { label: 'And Another Value 1', value: 2223 },
      { label: 'And Another Value 2', value: 332 },
    ],
  },
];

const TEST_DATA = [
  { label: 'Value', value: 123 },
  { label: 'Value 1', value: 246 },
  { label: 'Value 2', value: 544 },
  { label: 'Another Value', value: 111 },
  { label: 'Another Value 1', value: 222 },
  { label: 'Another Value 2', value: 332 },
  { label: 'And Another Value', value: 111 },
  { label: 'And Another Value 1', value: 2223 },
  { label: 'And Another Value 2', value: 332 },
];

describe('TemplateDashboard|XYChart|utils', () => {
  test('getMinAndMax()', () => {
    expect(
      getMinAndMax(
        [
          { value: 123, label: 'abc 123' },
          { value: 523, label: 'abc 523' },
          { value: 246, label: 'abc 246' },
          { value: 112, label: 'abc 112' },
        ],
        valueAccessor
      )
    ).toStrictEqual([112, 523]);
  });

  test('mapSummaryStackData()', () => {
    expect(
      mapSummaryStackData([
        {
          label: 'Bar value',
          values: [
            {
              label: 'Series value',
              value: 123,
            },
            {
              label: 'Series value 2',
              value: 246,
            },
          ],
        },
      ])
    ).toStrictEqual([
      {
        label: 'Series value',
        values: [
          {
            label: 'Bar value',
            value: 123,
          },
        ],
      },
      {
        label: 'Series value 2',
        values: [
          {
            label: 'Bar value',
            value: 246,
          },
        ],
      },
    ]);
  });

  describe('flattenData()', () => {
    it('flattens data with values', () => {
      expect(flattenData(TEST_GROUP_DATA)).toStrictEqual([
        { label: 'Value', value: 123 },
        { label: 'Value 1', value: 246 },
        { label: 'Value 2', value: 544 },
        { label: 'Another Value', value: 111 },
        { label: 'Another Value 1', value: 222 },
        { label: 'Another Value 2', value: 332 },
        { label: 'And Another Value', value: 111 },
        { label: 'And Another Value 1', value: 2223 },
        { label: 'And Another Value 2', value: 332 },
      ]);
    });

    it('doesnt returns the correct data shape', () => {
      expect(flattenData(TEST_DATA)).toStrictEqual(TEST_DATA);
    });
  });

  describe('data acessors', () => {
    it('returns the label', () => {
      expect(labelAccessor({ label: 'abc 123', value: 123 })).toBe('abc 123');
    });

    it('returns the value', () => {
      expect(valueAccessor({ label: 'abc 123', value: 123 })).toBe(123);
    });

    it('returns the number value if given a string', () => {
      expect(valueAccessor({ label: 'abc 123', value: '123.456' })).toBe(
        123.456
      );
      expect(valueAccessor({ label: 'abc 123', value: '123' })).toBe(123);
    });

    it('extracts a numeric value if possible', () => {
      expect(valueAccessor({ label: 'abc 123', value: '123.456 mins' })).toBe(
        123.456
      );
      expect(valueAccessor({ label: 'abc 123', value: '123abc' })).toBe(123);
    });
  });

  describe('chart margin', () => {
    describe('calcMarginTop', () => {
      it('returns correct margin for horizontal orientation', () => {
        expect(calcMarginTop('horizontal')).toBe(23);
      });
      it('returns correct margin for vertical orientation', () => {
        expect(calcMarginTop('vertical')).toBe(8);
      });
    });

    describe('calcMarginBottom', () => {
      it('returns correct margin for horizontal orientation', () => {
        // should always be 8
        expect(calcMarginBottom('horizontal', true)).toBe(8);
        expect(calcMarginBottom('horizontal', false)).toBe(8);
      });

      it('returns correct margin for vertical orientation and no scroll', () => {
        expect(calcMarginBottom('vertical', false)).toBe(23);
      });

      it('returns correct margin for vertical orientation and scroll', () => {
        expect(calcMarginBottom('vertical', true)).toBe(96);
      });
    });

    test('calcMarginRight', () => {
      expect(calcMarginRight()).toBe(0);
    });

    describe('calcMarginLeft', () => {
      it('returns correct margin for line chart', () => {
        // will be the same for both orientations
        expect(calcMarginLeft('line', 'vertical')).toBe(48);
        expect(calcMarginLeft('line', 'horizontal')).toBe(48);
      });

      it('returns correct margin for vertical bar and summary stack chart', () => {
        // will be the same for both chart types
        expect(calcMarginLeft('bar', 'vertical')).toBe(48);
        expect(calcMarginLeft('summary_stack', 'vertical')).toBe(48);
      });

      it('returns correct margin for horizontal bar and summary stack chart', () => {
        // will be the same for both chart types
        expect(calcMarginLeft('bar', 'horizontal')).toBe(100);
        expect(calcMarginLeft('summary_stack', 'horizontal')).toBe(100);
      });
    });
  });

  describe('scale config', () => {
    it('returns correct value scale for line', () => {
      expect(getValueScale({ chartType: 'line', max: 100 })).toStrictEqual({
        type: 'linear',
        zero: false,
        domain: [0, 110],
      });
    });

    it('returns correct value scale for other charts', () => {
      expect(getValueScale({ chartType: 'bar', max: 100 })).toStrictEqual({
        type: 'linear',
      });
    });

    describe('label scale', () => {
      const MOCK_SCROLL = {
        startIndex: 0,
        endIndex: 9,
        isActive: false,
      };

      const MOCK_MARGIN = {
        top: 5,
        bottom: 10,
        right: 15,
        left: 20,
      };

      const MOCK_CONFIG = {
        width: 120,
        height: 100,
        orientation: 'vertical',
        data: [],
        scroll: MOCK_SCROLL,
        margin: MOCK_MARGIN,
      };
      it('returns correct label scale for vertical bar', () => {
        expect(
          getLabelScale({
            chartType: 'bar',
            ...MOCK_CONFIG,
          })
        ).toStrictEqual({
          type: 'band',
          padding: 0.7,
          domain: [],
          range: [48, 120],
          reverse: false,
        });
      });

      it('returns correct label scale for vertical summary_stack', () => {
        expect(
          getLabelScale({
            ...MOCK_CONFIG,
            chartType: 'summary_stack',
          })
        ).toStrictEqual({
          type: 'band',
          padding: 0.7,
          domain: [], // domain tested below
          range: [48, 120], // starts based on the value axis width, ends based on the chart width
          reverse: false,
        });
      });

      it('returns the correct label scale for line chart', () => {
        const scale = getLabelScale({
          ...MOCK_CONFIG,
          chartType: 'line',
        });

        scale();

        expect(scaleTime).toHaveBeenCalledWith(
          expect.objectContaining({
            // domain tested below
            range: [0, 120], // line charts are time axis that starts from zero and ends based on the width
            nice: false,
          })
        );
      });

      it('returns the correct label scale for horizontal bar charts', () => {
        expect(
          getLabelScale({
            ...MOCK_CONFIG,
            chartType: 'bar',
            orientation: 'horizontal',
          })
        ).toStrictEqual({
          type: 'band',
          padding: 0.7,
          domain: [], // domain tested below
          range: [MOCK_MARGIN.top, 100 - 13], // the horizontal ranges from the top of the chart to the chart height minus axis font size
          reverse: true, // bar will reverse the direction (quirk with visx)
        });
      });

      it('returns the correct label scale for horizontal summary_stack charts', () => {
        expect(
          getLabelScale({
            ...MOCK_CONFIG,
            chartType: 'summary_stack',
            orientation: 'horizontal',
          })
        ).toStrictEqual({
          type: 'band',
          padding: 0.7,
          domain: [], // domain tested below
          range: [MOCK_MARGIN.top, 100 - 13], // the horizontal ranges from the top of the chart to the chart height minus axis font size
          reverse: false,
        });
      });
    });
  });

  describe('getLabelAxisNumTicks()', () => {
    it('returns the correct number of ticks for a chart with scroll not active', () => {
      // 280 chart width / HORIZONTAL_PX_PER_LABEL
      expect(getLabelAxisNumTicks(280, false)).toBe(4);
    });

    it('returns the correct number of ticks with scroll not active', () => {
      // 280 chart width / HORIZONTAL_PX_PER_LABEL
      expect(getLabelAxisNumTicks(170, true)).toBe(10);
    });
  });

  describe('getLabelAxisTickFormatter()', () => {
    describe('line chart axis formatter', () => {
      it('formats label for a domain less than a week', () => {
        const TEST_DATE_DATA = [
          {
            label: 'Group',
            values: [
              { label: new Date(2023, 1, 1), value: 123 },
              { label: new Date(2023, 1, 2), value: 246 },
              { label: new Date(2023, 1, 3), value: 544 },
              { label: new Date(2023, 1, 4), value: 550 },
            ],
          },
        ];
        const tickFormat = getLabelAxisTickFormatter({
          chartType: 'line',
          data: TEST_DATE_DATA,
        });

        expect(tickFormat(new Date(2023, 1, 1))).toBe('Wed 1st');
      });

      it('formats label for a domain less than a month', () => {
        const TEST_DATE_DATA = [
          {
            label: 'Group',
            values: [
              { label: new Date(2023, 1, 1), value: 123 },
              { label: new Date(2023, 1, 10), value: 246 },
              { label: new Date(2023, 1, 15), value: 544 },
              { label: new Date(2023, 1, 20), value: 550 },
            ],
          },
        ];
        const tickFormat = getLabelAxisTickFormatter({
          chartType: 'line',
          data: TEST_DATE_DATA,
        });

        expect(tickFormat(new Date(2023, 1, 1))).toBe('1st Feb');
      });

      it('formats label for a domain to have the month and year', () => {
        const TEST_DATE_DATA = [
          {
            label: 'Group',
            values: [
              { label: new Date(2023, 1, 1), value: 123 },
              { label: new Date(2023, 2, 10), value: 246 },
              { label: new Date(2023, 3, 15), value: 544 },
              { label: new Date(2023, 4, 20), value: 550 },
            ],
          },
        ];
        const tickFormat = getLabelAxisTickFormatter({
          chartType: 'line',
          data: TEST_DATE_DATA,
        });

        expect(tickFormat(new Date(2023, 1, 1))).toBe('Feb 23');
      });
    });

    describe('axis formatter for other charts', () => {
      it('returns the value given, trimmed for bar chart', () => {
        const barFormat = getLabelAxisTickFormatter({
          chartType: 'bar',
          data: [], // not needed
        });
        const summaryStackFormat = getLabelAxisTickFormatter({
          chartType: 'summary_stack',
          data: [], // not needed
        });

        expect(barFormat('Test')).toBe('Test');
        expect(barFormat('Testing the length of the label')).toBe(
          'Testing the length o...'
        );
        expect(summaryStackFormat('Test')).toBe('Test');
      });
    });
  });

  describe('getBarChartAxisLabelTrimmed()', () => {
    describe('bar chart axis label trim function', () => {
      it('trims the label to the appropriate number of characters and adds an elipsis for long labels', () => {
        expect(getBarChartAxisLabelTrimmed('Testing')).toBe('Testing');
        expect(getBarChartAxisLabelTrimmed('Testing 20 char text')).toBe(
          'Testing 20 char text'
        );
        expect(
          getBarChartAxisLabelTrimmed('Testing a label longer than 20 chars')
        ).toBe('Testing a label long...');
      });
    });
  });

  describe('isDataGrouped()', () => {
    it('returns true for grouped data', () => {
      expect(isDataGrouped(TEST_GROUP_DATA)).toBe(true);
    });

    it('returns false for not grouped data', () => {
      expect(!isDataGrouped(TEST_DATA)).toBe(true);
    });
  });

  describe('getBarValueDomain', () => {
    it('returns labels of the data that is supplied if scroll is not active', () => {
      expect(
        getBarValueDomain(TEST_DATA, {
          startIndex: 0,
          endIndex: 5,
          isActive: false,
        })
      ).toStrictEqual(TEST_DATA.map(({ label }) => label));
    });

    it('returns a subsection of the data labels based on the supplied indices', () => {
      expect(
        getBarValueDomain(TEST_DATA, {
          startIndex: 0,
          endIndex: 3,
          isActive: true,
        })
      ).toStrictEqual(['Value', 'Value 1', 'Value 2']);
    });
  });

  describe('processData', () => {
    it('sorts summary_stack data high to low based on sum of child values', () => {
      expect(processData(TEST_GROUP_DATA, 'summary_stack')).toStrictEqual([
        TEST_GROUP_DATA[2],
        TEST_GROUP_DATA[0],
        TEST_GROUP_DATA[1],
      ]);
    });

    it('sorts bar data high to low based on values with vertical (default) orientation', () => {
      expect(processData(TEST_DATA, 'bar')).toStrictEqual([
        { label: 'And Another Value 1', value: 2223 },
        { label: 'Value 2', value: 544 },
        { label: 'Another Value 2', value: 332 },
        { label: 'And Another Value 2', value: 332 },
        { label: 'Value 1', value: 246 },
        { label: 'Another Value 1', value: 222 },
        { label: 'Value', value: 123 },
        { label: 'Another Value', value: 111 },
        { label: 'And Another Value', value: 111 },
      ]);
    });

    it('sorts bar data high to low based on values with horizontal orientation', () => {
      expect(processData(TEST_DATA, 'bar', 'horizontal')).toStrictEqual([
        { label: 'Another Value', value: 111 },
        { label: 'And Another Value', value: 111 },
        { label: 'Value', value: 123 },
        { label: 'Another Value 1', value: 222 },
        { label: 'Value 1', value: 246 },
        { label: 'Another Value 2', value: 332 },
        { label: 'And Another Value 2', value: 332 },
        { label: 'Value 2', value: 544 },
        { label: 'And Another Value 1', value: 2223 },
      ]);
    });

    it('provides an empty array if data is undefined', () => {
      expect(processData(undefined, 'bar')).toStrictEqual([]);
    });

    it('doesnt alter data for line', () => {
      expect(processData(TEST_DATA, 'line')).toStrictEqual(TEST_DATA);
    });
  });

  describe('getChartHeight()', () => {
    it('removes the legend height when hasLegend', () => {
      expect(
        getChartHeight({
          hasLegend: true,
          isScrollActive: false,
          containerHeight: 200,
        })
      ).toBe(170);
    });

    it('removes the scroll height when isScrollActive', () => {
      expect(
        getChartHeight({
          hasLegend: false,
          isScrollActive: true,
          containerHeight: 200,
        })
      ).toBe(190);
    });

    it('doesnt remove height if nothing is active', () => {
      expect(
        getChartHeight({
          hasLegend: false,
          isScrollActive: false,
          containerHeight: 200,
        })
      ).toBe(200);
    });

    it('removes both heights if both are active', () => {
      expect(
        getChartHeight({
          hasLegend: true,
          isScrollActive: true,
          containerHeight: 200,
        })
      ).toBe(160);
    });
  });

  describe('getLineColor()', () => {
    const customEventOneData = {
      label: 'Custom Event 1',
      value: '1',
    };
    const customEventTwoData = {
      label: 'Custom Event 2',
      value: '2',
    };
    const otherCustomEventData = {
      label: 'Other Custom Event',
      value: '3',
    };
    const flatCategoryData = {
      label: 'Flat Category',
      value: '4',
    };
    const emptyCustomEventData = {};

    const chartData = [
      {
        label: 'Other Category',
        values: [{ label: 'Other Custom Event', value: '60' }],
      },
      {
        label: 'Category 1',
        values: [{ label: 'Custom Event 1', value: '30' }],
      },
      {
        label: 'Category 2',
        values: [
          { label: 'Custom Event 2', value: '60' },
          { label: 'Custom Event 3', value: '50' },
        ],
      },
      { label: 'Flat Category', value: '3' },
    ];
    const widgetColors = {
      grouping: 'custom_event_type_category',
      colors: [
        { label: 'Category 1', value: '#E86427' },
        { label: 'Category 2', value: '#279C9C' },
        { label: 'Category 3', value: '#BB8E11' },
        { label: 'Other Category', value: '#AC71F0' },
        { label: 'Flat Category', value: '#23254D' },
      ],
    };

    it('returns the correct color for the corresponding category', () => {
      expect(getLineColor(customEventOneData, chartData, widgetColors)).toEqual(
        '#E86427'
      );

      expect(getLineColor(customEventTwoData, chartData, widgetColors)).toEqual(
        '#279C9C'
      );

      expect(
        getLineColor(otherCustomEventData, chartData, widgetColors)
      ).toEqual('#AC71F0');

      expect(getLineColor(flatCategoryData, chartData, widgetColors)).toEqual(
        '#23254D'
      );
    });

    it('returns undefined for empty event data', () => {
      expect(
        getLineColor(emptyCustomEventData, chartData, widgetColors)
      ).toEqual(undefined);
    });
  });

  describe('formatValueTick', () => {
    const locale = 'en-UK';
    it('formats numbers under 999 correctly', () => {
      expect(formatValueTick(locale, 1)).toBe('1');
      expect(formatValueTick(locale, 100)).toBe('100');
      expect(formatValueTick(locale, 123)).toBe('123');
      expect(formatValueTick(locale, 999)).toBe('999');
    });

    it('formats numbers under 999,999 correctly', () => {
      expect(formatValueTick(locale, 1000)).toBe('1K');
      expect(formatValueTick(locale, 10000)).toBe('10K');
      expect(formatValueTick(locale, 100000)).toBe('100K');
      expect(formatValueTick(locale, 999999)).toBe('1M');
    });

    it('formats numbers under 999,999,999 correctly', () => {
      expect(formatValueTick(locale, 1000000)).toBe('1M');
      expect(formatValueTick(locale, 10000000)).toBe('10M');
      expect(formatValueTick(locale, 100000000)).toBe('100M');
      expect(formatValueTick(locale, 999999000)).toBe('1B');
    });
  });

  describe('formatVerticalAxisTicks', () => {
    const locale = 'en-UK';

    it('format only numbers when addDecorator is false', () => {
      expect(formatValueTick(locale, 1, false)).toBe('1');
      expect(formatValueTick(locale, 1000)).toBe('1K');
      expect(formatValueTick(locale, 999)).toBe('999');
    });

    it('formats to add decorator if  calculation = percentage_duration is passed', () => {
      const calculation = 'percentage_duration';
      expect(formatVerticalAxisTicks(locale, 98, true, calculation)).toBe(
        '98%'
      );
    });

    it('formats to add decorator if calculation = percentage is passed', () => {
      const calculation = 'percentage';
      expect(formatVerticalAxisTicks(locale, 100, true, calculation)).toBe(
        '100%'
      );
    });
  });
});

describe('labelTextAccessor()', () => {
  it('returns the value if text is not present', () => {
    const datum = { value: 456 };
    expect(labelTextAccessor(datum)).toBe(456);
  });

  it('returns NaN if text cannot be parsed as a number', () => {
    const datum = { text: 'abc', value: 456 };
    expect(labelTextAccessor(datum)).toBe(NaN);
  });

  it('returns undefined if both text and value are not present', () => {
    const datum = {};
    expect(labelTextAccessor(datum)).toBe(undefined);
  });
});
