import { expect } from '@jest/globals';
import colors from '@kitman/common/src/variables/colors';
import {
  getPlaceholderImgPath,
  getModalPlaceholderImgPath,
  getInitalLayout,
  getInitialPivotData,
  profileWidgetDropdownItems,
  getInitialBackgroundColorOptionValue,
} from '../utils';

describe('getPlaceholderImgPath', () => {
  it('gets the correct notes widget placeholder path', () => {
    expect(getPlaceholderImgPath('annotation')).toBe(
      '/img/graph-placeholders/notes-widget-placeholder.png'
    );
    expect(getPlaceholderImgPath('development_goal')).toBe(
      '/img/graph-placeholders/notes-widget-placeholder.png'
    );
  });

  it('get the correct graph placeholder path', () => {
    expect(getPlaceholderImgPath('graph', 'column', 'summary_stack_bar')).toBe(
      '/img/graph-placeholders/column-stack-graph-placeholder.png'
    );

    expect(getPlaceholderImgPath('graph', 'bar', 'summary_stack_bar')).toBe(
      '/img/graph-placeholders/bar-stack-graph-placeholder.png'
    );

    expect(getPlaceholderImgPath('graph', 'combination')).toBe(
      '/img/graph-placeholders/combination-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'column')).toBe(
      '/img/graph-placeholders/column-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'bar')).toBe(
      '/img/graph-placeholders/bar-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'radar')).toBe(
      '/img/graph-placeholders/radar-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'spider')).toBe(
      '/img/graph-placeholders/spider-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'table')).toBe(
      '/img/graph-placeholders/table-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'line')).toBe(
      '/img/graph-placeholders/line-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'donut')).toBe(
      '/img/graph-placeholders/donut-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'pie')).toBe(
      '/img/graph-placeholders/pie-graph-placeholder.png'
    );
    expect(getPlaceholderImgPath('graph', 'value')).toBe(
      '/img/graph-placeholders/value-visualisation-placeholder.png'
    );
  });
});

describe('getModalPlaceholderImgPath', () => {
  it('gets the correct header widget placeholder path', () => {
    expect(getModalPlaceholderImgPath('header')).toBe(
      '/img/graph-placeholders-modal/header-widget-placeholder.svg'
    );
  });

  it('gets the correct profile widget placeholder path', () => {
    expect(getModalPlaceholderImgPath('athlete_profile')).toBe(
      '/img/graph-placeholders-modal/profile-widget-placeholder.svg'
    );
  });

  it('gets the correct notes widget placeholder path', () => {
    expect(getModalPlaceholderImgPath('annotation')).toBe(
      '/img/graph-placeholders-modal/notes-widget-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('development_goal')).toBe(
      '/img/graph-placeholders-modal/notes-widget-placeholder.svg'
    );
  });

  it('gets the correct action widget placeholder path', () => {
    expect(getModalPlaceholderImgPath('annotation')).toBe(
      '/img/graph-placeholders-modal/notes-widget-placeholder.svg'
    );
  });

  it('gets the correct graph placeholder paths', () => {
    expect(getModalPlaceholderImgPath('action')).toBe(
      '/img/graph-placeholders-modal/actions-widget-placeholder.svg'
    );

    expect(
      getModalPlaceholderImgPath('graph', 'bar', 'summary_stack_bar')
    ).toBe('/img/graph-placeholders-modal/bar-stack-graph-placeholder.svg');

    expect(getModalPlaceholderImgPath('graph', 'combination')).toBe(
      '/img/graph-placeholders-modal/combination-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'column')).toBe(
      '/img/graph-placeholders-modal/column-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'bar')).toBe(
      '/img/graph-placeholders-modal/bar-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'radar')).toBe(
      '/img/graph-placeholders-modal/radar-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'spider')).toBe(
      '/img/graph-placeholders-modal/spider-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'table')).toBe(
      '/img/graph-placeholders-modal/table-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'line')).toBe(
      '/img/graph-placeholders-modal/line-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'donut')).toBe(
      '/img/graph-placeholders-modal/donut-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'pie')).toBe(
      '/img/graph-placeholders-modal/pie-graph-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('graph', 'value')).toBe(
      '/img/graph-placeholders-modal/value-visualisation-placeholder.svg'
    );
    expect(getModalPlaceholderImgPath('chart')).toBe(
      '/img/graph-placeholders-modal/combination-graph-placeholder.svg'
    );
  });
});

describe('getInitalLayout', () => {
  it('returns an empty array when the graph list is empty', () => {
    expect(getInitalLayout([], [])).toStrictEqual([]);
  });

  it('returns a default layout for the graphs without saved layout, otherwise it returns the saved layout', () => {
    const defaultLayout = {
      x: 0,
      y: 0,
      w: 6,
      h: 5,
      minH: 2,
      maxH: 7,
    };
    const graphList = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];
    const savedLayout = [
      {
        graph_id: '3',
        x: 5,
        y: 4,
        w: 3,
        h: 2,
      },
    ];
    expect(getInitalLayout(graphList, savedLayout)).toStrictEqual([
      {
        i: '1',
        ...defaultLayout,
      },
      {
        i: '2',
        ...defaultLayout,
      },
      {
        i: '3',
        x: 5,
        y: 4,
        w: 3,
        h: 2,
        minH: 2,
        maxH: 7,
      },
    ]);
  });

  it('must return a layout not containing the graphs not on the dashboard', () => {
    const defaultLayout = {
      x: 0,
      y: 0,
      w: 6,
      h: 5,
      minH: 2,
      maxH: 7,
    };
    const graphList = [
      {
        id: 1,
      },
      {
        id: 3,
      },
    ];
    const savedLayout = [
      {
        graph_id: '1',
        ...defaultLayout,
      },
      {
        graph_id: '2', // Graph number 2 is not in the graphList
        ...defaultLayout,
      },
      {
        graph_id: '3',
        ...defaultLayout,
      },
    ];
    expect(getInitalLayout(graphList, savedLayout)).toStrictEqual([
      {
        i: '1',
        ...defaultLayout,
      },
      {
        i: '3',
        ...defaultLayout,
      },
    ]);
  });
});

describe('getInitialPivotData', () => {
  it('returns the empty pivot data when pivot is false', () => {
    expect(getInitialPivotData({ pivot: false })).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: false,
        athletes: [],
        position_groups: [],
        positions: [],
        squads: [],
      },
      appliedTimePeriod: '',
    });
  });

  it('returns the correct pivot data when pivot is true', () => {
    // Entire Squad / last_week
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: 'true',
          position_groups: null,
          positions: null,
          athletes: null,
          all_squads: null,
          squads: null,
        },
        timePeriod: 'last_week',
      })
    ).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: true,
        athletes: [],
        position_groups: [],
        positions: [],
        squads: [],
      },
      appliedTimePeriod: 'last_week',
    });

    // All squads / last_week
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: null,
          position_groups: null,
          positions: null,
          athletes: null,
          all_squads: 'true',
          squads: null,
        },
        timePeriod: 'last_week',
      })
    ).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: true,
        applies_to_squad: false,
        athletes: [],
        position_groups: [],
        positions: [],
        squads: [],
      },
      appliedTimePeriod: 'last_week',
    });

    // Athlete / custom_date_range
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: null,
          position_groups: null,
          positions: null,
          athletes: '3,10',
          all_squads: null,
          squads: null,
        },
        timePeriod: 'custom_date_range',
        startDate: '2016-07-01T00%3A00%3A00%2B01%3A00', // encoded URI
        endDate: '2019-09-23T23%3A59%3A59%2B01%3A00', // encoded URI
      })
    ).toStrictEqual({
      appliedDateRange: {
        start_date: '2016-07-01T00:00:00+01:00',
        end_date: '2019-09-23T23:59:59+01:00',
      },
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: false,
        athletes: [3, 10],
        position_groups: [],
        positions: [],
        squads: [],
      },
      appliedTimePeriod: 'custom_date_range',
    });

    // Athlete / last_x_days
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: null,
          position_groups: null,
          positions: null,
          athletes: '3',
          all_squads: null,
          squads: null,
        },
        timePeriod: 'last_x_days',
        timePeriodLength: '300',
      })
    ).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: false,
        athletes: [3],
        position_groups: [],
        positions: [],
        squads: [],
      },
      appliedTimePeriod: 'last_x_days',
      appliedTimePeriodLength: 300,
    });

    // Position / last_year
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: null,
          position_groups: null,
          positions: '5,10',
          athletes: null,
          all_squads: null,
          squads: null,
        },
        timePeriod: 'last_year',
      })
    ).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: false,
        athletes: [],
        position_groups: [],
        positions: [5, 10],
        squads: [],
      },
      appliedTimePeriod: 'last_year',
    });

    // Squad / last_year
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: null,
          position_groups: null,
          positions: null,
          athletes: null,
          all_squads: null,
          squads: '5,10',
        },
        timePeriod: 'last_year',
      })
    ).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: false,
        athletes: [],
        position_groups: [],
        positions: [],
        squads: [5, 10],
      },
      appliedTimePeriod: 'last_year',
    });

    // Position Group / last_year
    expect(
      getInitialPivotData({
        pivot: true,
        squadAthletesSelection: {
          applies_to_squad: null,
          position_groups: '5,10',
          positions: null,
          athletes: null,
          all_squads: null,
          squads: null,
        },
        timePeriod: 'last_year',
      })
    ).toStrictEqual({
      appliedDateRange: {},
      appliedSquadAthletes: {
        all_squads: false,
        applies_to_squad: false,
        athletes: [],
        position_groups: [5, 10],
        positions: [],
        squads: [],
      },
      appliedTimePeriod: 'last_year',
    });
  });
});

describe('profileWidgetDropdownItems', () => {
  it('returns array if isKeyValue false', () => {
    expect(Array.isArray(profileWidgetDropdownItems())).toBe(true);
  });

  it('returns key value pair if isKeyValue true', () => {
    expect(typeof profileWidgetDropdownItems({ isKeyValuePair: true })).toBe(
      'object'
    );
  });
});

describe('getInitialBackgroundColorOptionValue', () => {
  it('returns custom if HEX value is provided', () => {
    expect(getInitialBackgroundColorOptionValue(colors.black_100)).toBe(
      'custom'
    );
    expect(getInitialBackgroundColorOptionValue(colors.white)).toBe('custom');
  });

  it('returns organistion branding if nothing is provided', () => {
    expect(getInitialBackgroundColorOptionValue('')).toBe(
      'organisation_branding'
    );
    expect(getInitialBackgroundColorOptionValue(null)).toBe(
      'organisation_branding'
    );
  });
});
