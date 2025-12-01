// Testing the <Tooltip /> its self is quite difficult as it
// requires setting up a visx xy chart and a lot of user events
// therefore it is assumed that visx will work as expected
import { render, screen } from '@testing-library/react';
import { getTooltipRenderer } from '../components/Tooltip';

const TOOLTIP_DATA_UNGROUPED = {
  nearestDatum: {
    key: 'bar',
    index: 0,
    datum: { label: "Niccolo' Cannone", value: '9.00' },
    distance: 166.9081422217227,
  },
  datumByKey: {
    bar: {
      datum: { label: "Niccolo' Cannone", value: '9.00' },
      index: 0,
      key: 'bar',
    },
  },
};

const TOOLTIP_DATA_UNGROUPED_DATE = {
  nearestDatum: {
    key: 'line',
    index: 1,
    datum: { label: '2022-12-19T00:00:00.000Z', value: '160' },
    distance: 335.3482888583566,
  },
  datumByKey: {
    line: {
      datum: { label: '2022-12-19T00:00:00.000Z', value: '160' },
      index: 1,
      key: 'line',
    },
  },
};

const TOOLTIP_DATA_GROUPED = {
  nearestDatum: {
    key: 'International Squad',
    index: 0,
    datum: { label: "Niccolo' Cannone", value: '1974' },
    distance: 34.72394259982639,
  },
  datumByKey: {
    'International Squad': {
      datum: { label: "Niccolo' Cannone", value: '1974' },
      index: 0,
      key: 'International Squad',
    },
    'Kitman Labs - Staff': {
      datum: { label: "Niccolo' Cannone", value: '120' },
      index: 0,
      key: 'Kitman Labs - Staff',
    },
    'Academy Squad': {
      datum: { label: 'Akanksha Athlete', value: '60' },
      index: 0,
      key: 'Academy Squad',
    },
  },
};

const TOOLTIP_DATA_GROUPED_DATE = {
  nearestDatum: {
    key: 'Akanksha Athlete',
    index: 1,
    datum: { label: '2023-05-26T23:00:00.000Z', value: '60' },
    distance: 77.81530511309334,
  },
  datumByKey: {
    "Niccolo' Cannone": {
      datum: { label: '2023-05-26T23:00:00.000Z', value: '60' },
      index: 30,
      key: "Niccolo' Cannone",
    },
    'Akanksha Athlete': {
      datum: { label: '2023-05-26T23:00:00.000Z', value: '10' },
      index: 1,
      key: 'Akanksha Athlete',
    },
  },
};

const colorScale = jest.fn();

describe('TemplateDashboards|Tooltip', () => {
  /**
   * The unit tests here dont specifically test the component as it is effectively
   * a wrapper on visx's tooltip. So we will perform the unit tests on a util function that
   * holds all the tooltip related rendering logic
   */
  it('renders value for regular tooltip', () => {
    const renderTooltip = getTooltipRenderer({
      isGrouped: false,
      chartType: 'bar',
    });

    render(
      <div>
        {renderTooltip({ tooltipData: TOOLTIP_DATA_UNGROUPED, colorScale })}
      </div>
    );

    expect(screen.queryByText("Niccolo' Cannone")).toBeVisible();
    expect(screen.queryByText('9')).toBeVisible();
  });

  it('renders all values for grouped tooltip', () => {
    const renderTooltip = getTooltipRenderer({
      isGrouped: true,
      chartType: 'bar',
    });

    render(
      <div>
        {renderTooltip({ tooltipData: TOOLTIP_DATA_GROUPED, colorScale })}
      </div>
    );

    // Header label
    expect(screen.queryByText("Niccolo' Cannone")).toBeVisible();
    expect(screen.queryByText('International Squad')).toBeVisible();
    expect(screen.queryByText('1,974')).toBeVisible();
    expect(screen.queryByText('Kitman Labs - Staff')).toBeVisible();
    expect(screen.queryByText('120')).toBeVisible();

    // This shouldnt be visible as the label is different from the header label
    expect(screen.queryByText('Academy Squad')).not.toBeInTheDocument();
  });

  it('renders the correct formatted label for a line chart', () => {
    const renderTooltip = getTooltipRenderer({
      isGrouped: false,
      chartType: 'line',
    });

    render(
      <div>
        {renderTooltip({
          tooltipData: TOOLTIP_DATA_UNGROUPED_DATE,
          colorScale,
        })}
      </div>
    );

    expect(screen.queryByText('Dec 19, 2022')).toBeVisible();
    expect(screen.queryByText('160')).toBeVisible();
  });

  it('renders the correct formatted label for a grouped line chart', () => {
    const renderTooltip = getTooltipRenderer({
      isGrouped: true,
      chartType: 'line',
    });

    render(
      <div>
        {renderTooltip({
          tooltipData: TOOLTIP_DATA_GROUPED_DATE,
          colorScale,
        })}
      </div>
    );

    // Header label
    expect(screen.queryByText('May 26, 2023')).toBeVisible();
    expect(screen.queryByText("Niccolo' Cannone")).toBeVisible();
    expect(screen.queryByText('60')).toBeVisible();
    expect(screen.queryByText('Akanksha Athlete')).toBeVisible();
    expect(screen.queryByText('60')).toBeVisible();
  });

  describe('when rendering numbers', () => {
    const TOOLTIP_DATA_UNGROUPED_LARGE_NUMBER = {
      nearestDatum: {
        ...TOOLTIP_DATA_UNGROUPED.nearestDatum,
        datum: { label: "Niccolo' Cannone", value: '90000.00' },
      },
      datumByKey: {
        bar: {
          ...TOOLTIP_DATA_UNGROUPED.datumByKey.bar,
          datum: { label: "Niccolo' Cannone", value: '90000.00' },
        },
      },
    };

    const TOOLTIP_DATA_GROUPED_LARGE_NUMBER = {
      nearestDatum: {
        ...TOOLTIP_DATA_GROUPED.nearestDatum,
        datum: { label: "Niccolo' Cannone", value: '1974' },
      },
      datumByKey: {
        'International Squad': {
          ...TOOLTIP_DATA_GROUPED.datumByKey['International Squad'],
          datum: { label: "Niccolo' Cannone", value: '1974' },
        },
        'Kitman Labs - Staff': {
          ...TOOLTIP_DATA_GROUPED.datumByKey['Kitman Labs - Staff'],
          datum: { label: "Niccolo' Cannone", value: '120000' },
        },
        'Academy Squad': {
          ...TOOLTIP_DATA_GROUPED.datumByKey['Academy Squad'],
          datum: { label: 'Akanksha Athlete', value: '6000' },
        },
      },
    };
    it('formats ungrouped tooltip numbers correctly', () => {
      const renderTooltip = getTooltipRenderer({
        isGrouped: false,
        chartType: 'bar',
        locale: 'en-GB',
      });

      render(
        <div>
          {renderTooltip({
            tooltipData: TOOLTIP_DATA_UNGROUPED_LARGE_NUMBER,
            colorScale,
          })}
        </div>
      );

      expect(screen.queryByText("Niccolo' Cannone")).toBeVisible();
      expect(screen.queryByText('90,000')).toBeVisible();
    });

    it('formats grouped tooltip numbers correctly', () => {
      const renderTooltip = getTooltipRenderer({
        isGrouped: true,
        chartType: 'bar',
      });

      render(
        <div>
          {renderTooltip({
            tooltipData: TOOLTIP_DATA_GROUPED_LARGE_NUMBER,
            colorScale,
          })}
        </div>
      );

      // Header label
      expect(screen.queryByText("Niccolo' Cannone")).toBeVisible();
      expect(screen.queryByText('International Squad')).toBeVisible();
      expect(screen.queryByText('1,974')).toBeVisible();
      expect(screen.queryByText('Kitman Labs - Staff')).toBeVisible();
      expect(screen.queryByText('120,000')).toBeVisible();

      // This shouldnt be visible as the label is different from the header label
      expect(screen.queryByText('Academy Squad')).not.toBeInTheDocument();
    });
  });
});
