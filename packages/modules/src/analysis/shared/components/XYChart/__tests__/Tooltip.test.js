// Testing the <Tooltip /> its self is quite difficult as it
// requires setting up a visx xy chart and a lot of user events
// therefore it is assumed that visx will work as expected
import { render, screen } from '@testing-library/react';
import { getTooltipRenderer } from '../components/Tooltip';
import {
  getTooltipTranslations,
  SERIES_TYPES,
  AGGREGATE_PERIOD,
} from '../constants';
import { generateTestSeries } from './testUtils';

jest.mock('../components/Context');

const generateUngroupedTooltip = (seriesKey, datum) => ({
  nearestDatum: {
    key: seriesKey,
    index: 0,
    datum,
    distance: 166.9081422217227,
  },
  datumByKey: {
    bar: {
      datum,
      index: 0,
      key: seriesKey,
    },
  },
});

const generateGroupedTooltip = (seriesKey, data) => ({
  nearestDatum: {
    key: data.label,
    index: 0,
    datum: {
      label: seriesKey,
      value: 123,
    },
    distance: 166.9081422217227,
  },
  datumByKey: {
    ...data.values.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.label]: {
          datum: {
            label: seriesKey,
            value: curr.value,
          },
        },
      };
    }, {}),
  },
});

describe('analysis|shared|XYChart|Tooltip', () => {
  const series = [generateTestSeries()];
  const colorScale = jest.fn();

  /**
   * The unit tests here dont specifically test the component as it is effectively
   * a wrapper on visx's tooltip. So we will perform the unit tests on a util function that
   * holds all the tooltip related rendering logic
   */
  it('renders label and value from tooltip', () => {
    const renderTooltip = getTooltipRenderer({ series });
    const [[key, seriesObj]] = Object.entries(series);

    render(
      <div>
        {renderTooltip({
          tooltipData: generateUngroupedTooltip(key, seriesObj.data[0]),
          colorScale,
        })}
      </div>
    );

    expect(screen.queryByText(seriesObj.data[0].label)).toBeVisible();
    expect(screen.queryByText('12')).toBeVisible();
  });

  it('renders the value to 2 decimal points', () => {
    const aggregatedSeries = [
      {
        data: [
          {
            label: '2024-05-01',
            value: '196950.319998 ',
          },
        ],
        valueAccessor: ({ value }) => value,
        valueFormatter: ({ value }) => Number(value).toFixed(2),
        categoryAccessor: jest.fn(),
        type: SERIES_TYPES.bar,
        aggregateValues: {
          aggregatePeriod: AGGREGATE_PERIOD.monthly,
        },
      },
    ];
    const renderTooltip = getTooltipRenderer({
      series: aggregatedSeries,
    });
    const [[key, seriesObj]] = Object.entries(aggregatedSeries);

    render(
      <div>
        {renderTooltip({
          tooltipData: generateUngroupedTooltip(key, seriesObj.data[0]),
        })}
      </div>
    );

    expect(screen.getByText(getTooltipTranslations().monthly)).toBeVisible();
    expect(screen.getByText('196950.32')).toBeVisible();
  });

  it('renders the correct messaging for data aggregated by week', () => {
    const aggregatedSeries = [
      {
        data: [{ label: '2024-01-01', value: 20 }],
        valueAccessor: jest.fn(),
        valueFormatter: jest.fn(),
        categoryAccessor: jest.fn(),
        type: SERIES_TYPES.bar,
        aggregateValues: {
          aggregatePeriod: AGGREGATE_PERIOD.weekly,
        },
      },
    ];
    const renderTooltip = getTooltipRenderer({
      series: aggregatedSeries,
    });
    const [[key, seriesObj]] = Object.entries(aggregatedSeries);

    render(
      <div>
        {renderTooltip({
          tooltipData: generateUngroupedTooltip(key, seriesObj.data[0]),
        })}
      </div>
    );

    expect(screen.getByText(getTooltipTranslations().weekly)).toBeVisible();
  });

  it('renders the correct messaging for data aggregated by month', () => {
    const aggregatedSeries = [
      {
        data: [{ label: '2024-01-01', value: 20 }],
        valueAccessor: jest.fn(),
        valueFormatter: jest.fn(),
        categoryAccessor: jest.fn(),
        type: SERIES_TYPES.bar,
        aggregateValues: {
          aggregatePeriod: AGGREGATE_PERIOD.monthly,
        },
      },
    ];
    const renderTooltip = getTooltipRenderer({
      series: aggregatedSeries,
    });
    const [[key, seriesObj]] = Object.entries(aggregatedSeries);

    render(
      <div>
        {renderTooltip({
          tooltipData: generateUngroupedTooltip(key, seriesObj.data[0]),
        })}
      </div>
    );

    expect(screen.getByText(getTooltipTranslations().monthly)).toBeVisible();
  });

  describe('when isGrouped or is multi series', () => {
    it('renders a tooltip with data grouped', () => {
      const groupedSeries = {
        123: {
          ...generateTestSeries(),
          name: 'Grouped Series',
          id: '123',
          data: [
            {
              label: 'Group 1',
              values: [
                {
                  label: '123-Label 1',
                  value: 123.0,
                },
                {
                  label: '123-Label 2',
                  value: 456.0,
                },
              ],
            },
          ],
          isGrouped: true,
        },
      };

      const renderTooltip = getTooltipRenderer({
        series: groupedSeries,
      });

      render(
        <div>
          {renderTooltip({
            tooltipData: generateGroupedTooltip('Group 1', {
              label: 'Group 1',
              values: [
                {
                  label: '123-Label 1',
                  value: 123.0,
                },
                {
                  label: '123-Label 2',
                  value: 456.0,
                },
              ],
            }),
            colorScale,
          })}
        </div>
      );

      expect(screen.getByText('Group 1')).toBeVisible(); // grouping name
      expect(screen.getAllByText('Grouped Series').length).toBe(2); // 2 series name
      expect(screen.getByText(`- Label 1`)).toBeVisible(); // label
      expect(screen.getByText('123')).toBeVisible(); // value for label 1
      expect(screen.getByText('- Label 2')).toBeVisible(); // label
      expect(screen.getByText('456')).toBeVisible(); // value for label 2
    });

    it('renders a tooltip for multi series', () => {
      const multiSeries = {
        123: {
          ...generateTestSeries(),
          name: 'Grouped Series',
          id: '123',
          data: [
            {
              label: '123-Group 1',
              values: [
                {
                  label: 'Label 1',
                  value: 200.0,
                },
                {
                  label: 'Label 2',
                  value: 456.0,
                },
              ],
            },
          ],
          isGrouped: true,
        },
        456: {
          ...generateTestSeries(),
          name: 'Series 2',
          id: '456',
          data: [
            {
              label: 'Label 1',
              value: 500,
            },
            {
              label: 'Label 2',
              value: 200,
            },
          ],
          isGrouped: false,
        },
      };

      const renderTooltip = getTooltipRenderer({
        series: multiSeries,
      });

      const multiSeriesTooltipData = {
        datumByKey: {
          456: {
            datum: {
              label: 'Label 1',
              value: 500,
            },

            index: 0,
            key: '456',
          },
          '123-Group 1': {
            datum: {
              label: 'Label 1',
              value: 200,
            },

            index: 0,
            key: '123-Group 1',
          },
        },
        nearestDatum: {
          datum: {
            label: 'Label 1',
            value: 500,
          },
        },
      };

      render(
        <div>
          {renderTooltip({
            tooltipData: {
              ...multiSeriesTooltipData,
            },
            colorScale,
          })}
        </div>
      );

      expect(screen.getByText(`Label 1`)).toBeVisible(); // shared label
      // series 123
      expect(screen.getByText(`Grouped Series`)).toBeVisible(); // series 123 name
      expect(screen.getByText('200')).toBeVisible(); // value for label 1
      // series 456
      expect(screen.getByText('Series 2')).toBeVisible(); // series 456 name
      expect(screen.getByText('500')).toBeVisible(); // value for label 1
    });

    it('renders the formatted date for date axis', () => {
      const groupedSeries = {
        123: {
          ...generateTestSeries(),
          data: [
            {
              label: '2024-02-01',
              values: [
                {
                  label: 'Series 1',
                  value: 123,
                },
                {
                  label: 'Series 2',
                  value: 456,
                },
              ],
            },
          ],
          isGrouped: true,
          dataType: 'time',
        },
        456: {
          ...generateTestSeries(),
          data: [
            {
              label: '2024-02-01',
              values: [
                {
                  label: 'Series 1',
                  value: 123,
                },
                {
                  label: 'Series 2',
                  value: 456,
                },
              ],
            },
          ],
          isGrouped: true,
          dataType: 'time',
        },
      };

      const renderTooltip = getTooltipRenderer({
        series: groupedSeries,
      });

      render(
        <div>
          {renderTooltip({
            tooltipData: generateGroupedTooltip('2024-02-01', {
              label: '2024-02-01',
              values: [
                {
                  label: 123,
                },
                {
                  label: 456,
                },
              ],
            }),
            colorScale,
          })}
        </div>
      );

      expect(screen.getByText('Feb 1, 2024')).toBeVisible();
    });

    it('renders the correct messaging for data aggregated by month', () => {
      const aggregatedGroupedSeries = {
        123: {
          ...generateTestSeries(),
          name: 'Grouped Series',
          id: '123',
          data: [
            {
              label: 'Group 1',
              values: [
                {
                  label: '2024-09-01',
                  value: 123,
                },
                {
                  label: '2024-10-01',
                  value: 456,
                },
              ],
            },
          ],
          isGrouped: true,
          aggregateValues: {
            aggregatePeriod: AGGREGATE_PERIOD.monthly,
          },
        },
        456: {
          ...generateTestSeries(),
          name: 'Grouped Series',
          id: '123',
          data: [
            {
              label: 'Group 2',
              values: [
                {
                  label: '2024-09-01',
                  value: 123,
                },
                {
                  label: '2024-10-01',
                  value: 456,
                },
              ],
            },
          ],
          isGrouped: true,
          aggregateValues: {
            aggregatePeriod: AGGREGATE_PERIOD.monthly,
          },
        },
      };

      const renderTooltip = getTooltipRenderer({
        series: aggregatedGroupedSeries,
      });

      render(
        <div>
          {renderTooltip({
            tooltipData: generateGroupedTooltip('Group 1', {
              label: 'Group 1',
              values: [
                {
                  label: 123,
                },
                {
                  label: 456,
                },
              ],
            }),
            colorScale,
          })}
        </div>
      );

      expect(screen.getByText(getTooltipTranslations().monthly)).toBeVisible();
    });
  });
});
