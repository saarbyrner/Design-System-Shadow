// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { TemplateDashboardKey } from './types';

export const NUM_WIDGET_COLUMNS = 6; // 6 columns to match the analysis dashboard
export const HEIGHT_WIDGET_ROW = 100; // px
export const MARGIN_BETWEEN_WIDGETS_VERTICALLY = 25; // px
export const MARGIN_BETWEEN_WIDGETS_HORIZONTALLY = 25; // px

// This object is used to store the layouts of each of the template dashboards. It is
// based on the react-grid-layout props here https://github.com/react-grid-layout/react-grid-layout#grid-layout-props
// - Each key represents the key for a dashboard which you will find in the URL
// - The value is then an array of objects to be supplied to react grid
type LayoutConfig = {
  [TemplateDashboardKey]: Array<{
    i: string, // should match the id of the widget returned from the API
    w: number, // width of the widget based on the number of columns the widget takes up
    h: number, // height of the widget based on the number of rows it takes up
    x: number, // column where the widget starts
    y: number, // column where the widget ends
  }>,
};

const COACHING_DASHBOARD_WIDGET_HEIGHT = 3;
const COACHING_DASHBOARD_WIDGET_WIDTH = 3;
const coachingDashboardRow = (rowNumber) =>
  (rowNumber - 1) * COACHING_DASHBOARD_WIDGET_HEIGHT + 1;

export const getDashboardLayoutConfig = (): LayoutConfig => ({
  coaching_summary: [
    {
      i: 'session_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 0,
    },
    {
      i: '1', // Session Mins Over Time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(1),
    },
    {
      i: '2', // Total Sessions Mins by Player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(1),
    },
    {
      i: '3', // Session by Type
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(2),
    },
    {
      i: '4', // Session by Type by Player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(2),
    },
    {
      i: '7', // Training Session RPE over time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(3),
    },

    {
      i: '8', // Training Session RPE by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(3),
    },
    {
      i: '9', // Training Workload (RPE x Duration) Over Time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(4),
    },
    {
      i: '10', // Training Workload (RPE x Duration)
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(4),
    },

    {
      i: '17', // Drill Duration
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(5),
    },
    {
      i: '18', // Drill Duration by Player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(5),
    },

    {
      i: 'game_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: coachingDashboardRow(6),
    },
    {
      i: '7.1', // Game Session RPE over time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(7),
    },
    {
      i: '8.1', // Game Session RPE by player
      w: 3,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(7),
    },

    {
      i: '10.1', // Game Workload (RPE x Duration)
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(8),
    },
    {
      i: '9.1', // Game Workload (RPE x Duration) Over Time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(8),
    },

    {
      i: '13', // Yellow Cards by player
      w: 3,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(9),
    },
    {
      i: '14', // Red Cards by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(9),
    },

    {
      i: '15', // Goals by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(10),
    },
    {
      i: '16', // Assists by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(10),
    },

    {
      i: '5', // Number of Games of player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(11),
    },
    {
      i: '6', // Total Minutes
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(11),
    },

    {
      i: '12', // Time in Competition
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(12),
    },
    {
      i: '12.1', // Time in Competition by Player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(12),
    },

    {
      i: '11', // Time in position by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(13),
    },
  ],
  development_journey: [
    {
      i: 'coaching_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 0,
    },
    {
      i: 'athlete_widget',
      w: 1,
      h: 4,
      x: 0,
      y: 0,
    },
    {
      i: '1',
      w: 1,
      h: 2,
      x: 1,
      y: 0,
    },
    {
      i: '2',
      w: 1,
      h: 2,
      x: 1,
      y: 2,
    },
    {
      i: '3',
      w: 2,
      h: 4,
      x: 2,
      y: 0,
    },
    {
      i: '4',
      w: 2,
      h: 4,
      x: 4,
      y: 0,
    },
    {
      i: 'games_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 5,
    },
    {
      i: '5',
      w: 1,
      h: 2,
      x: 0,
      y: 6,
    },
    {
      i: '6',
      w: 1,
      h: 2,
      x: 0,
      y: 8,
    },
    {
      i: '7',
      w: 5,
      h: 4,
      x: 1,
      y: 6,
    },
    {
      i: '11',
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: 9,
    },
    {
      i: '12',
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: 9,
    },
    {
      i: 'issues_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 10,
    },
    {
      i: '9',
      w: 1,
      h: 2,
      x: 0,
      y: 11,
    },
    {
      i: '10',
      w: 1,
      h: 2,
      x: 1,
      y: 11,
    },
    ...(window.getFlag('rep-show-player-care-dev-journey')
      ? [
          {
            i: 'player_care_header',
            minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
            w: 6,
            h: 0.5,
            x: 0,
            y: 13,
          },
          {
            i: '13',
            w: COACHING_DASHBOARD_WIDGET_WIDTH,
            h: COACHING_DASHBOARD_WIDGET_HEIGHT,
            x: 0,
            y: 14,
          },
          {
            i: '14',
            w: COACHING_DASHBOARD_WIDGET_WIDTH,
            h: COACHING_DASHBOARD_WIDGET_HEIGHT,
            x: 3,
            y: 14,
          },
          {
            i: '15',
            w: COACHING_DASHBOARD_WIDGET_WIDTH,
            h: COACHING_DASHBOARD_WIDGET_HEIGHT,
            x: 0,
            y: 18,
          },
          {
            i: '16',
            w: COACHING_DASHBOARD_WIDGET_WIDTH,
            h: COACHING_DASHBOARD_WIDGET_HEIGHT,
            x: 3,
            y: 18,
          },
          {
            i: '17',
            w: COACHING_DASHBOARD_WIDGET_WIDTH,
            h: COACHING_DASHBOARD_WIDGET_HEIGHT,
            x: 0,
            y: 22,
          },
          {
            i: '18',
            w: COACHING_DASHBOARD_WIDGET_WIDTH,
            h: COACHING_DASHBOARD_WIDGET_HEIGHT,
            x: 3,
            y: 22,
          },
        ]
      : []),
  ],
  medical: [
    {
      i: 'injuries_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 0,
    },
    {
      i: '1', // Illness over time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(1),
    },
    {
      i: '2', // Illness by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(1),
    },
    {
      i: '3', // Injury over time
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(2),
    },
    {
      i: '4', // Injury by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(2),
    },
    {
      i: '5', // Injury body part by player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(3),
    },
    {
      i: '10', // Injuries by contact type
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(3),
    },
    {
      i: '11', // Injuries by event type
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(4),
    },
    {
      i: '12', // Injuries by competition category type
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(4),
    },
    {
      i: '15', // Total Exposure - Sessions
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(5),
    },
    {
      i: '16', // Total Exposure - Games
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(5),
    },
    {
      i: '14', // Total Exposure - Sessions & Games
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(6),
    },
    {
      i: '13', // Injuries by competition surface type
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(6),
    },
    {
      i: 'treatments_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: coachingDashboardRow(7),
    },
    {
      i: '8', // Treatments by Treatment Category by Player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(8),
    },
    {
      i: '9', // Treatments by Treatment Modality  by Player
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(8),
    },
    {
      i: '6', // Treatments by Category
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: coachingDashboardRow(9),
    },
    {
      i: '7', // Treatments by Type
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: coachingDashboardRow(9),
    },
  ],
  growth_and_maturation: [
    {
      i: 'growth_and_maturation_header',
      minH: 0,
      w: 6,
      h: 0.5,
      x: 0,
      y: 0,
    },
    {
      i: 'growth_and_maturation_table',
      minH: 0,
      w: 6,
      h: 6,
      x: 1,
      y: 1,
    },
  ],
  staff_development: [
    {
      i: 'coaching_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 0,
    },
    {
      i: '1',
      w: 1,
      h: 2,
      x: 0,
      y: 0,
    },
    {
      i: '2',
      w: 1,
      h: 2,
      x: 0,
      y: 1,
    },
    {
      i: '3',
      w: 2.5,
      h: 4,
      x: 1,
      y: 0,
    },
    {
      i: '4',
      w: 2.5,
      h: 4,
      x: 4,
      y: 0,
    },
    {
      i: 'games_header',
      minH: 0, // The default value for this is 1, so because h is 0.5 we set to 0 to prevent error
      w: 6,
      h: 0.5,
      x: 0,
      y: 5,
    },
    {
      i: '5',
      w: 1.5,
      h: 2,
      x: 0,
      y: 6,
    },
    {
      i: '6',
      w: 1.5,
      h: 2,
      x: 1.5,
      y: 6,
    },
    {
      i: 'format_header',
      minH: 0,
      w: 6,
      h: 0,
      x: 0,
      y: 7,
    },
    {
      i: '7',
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 0,
      y: 8,
    },
    {
      i: '8',
      w: COACHING_DASHBOARD_WIDGET_WIDTH,
      h: COACHING_DASHBOARD_WIDGET_HEIGHT,
      x: 4,
      y: 8,
    },
  ],
});

export const tabHashes = {
  SESSION_SUMMARY: '#session-summary',
  GAME_SUMMARY: '#game-summary',
};

export const getTabDashboardLayoutConfig = () => ({
  coaching_summary: [
    {
      title: i18n.t('Session Summary'),
      tabHash: tabHashes.SESSION_SUMMARY,
      layout: [
        {
          i: '1', // Session Mins Over Time
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(1),
        },
        {
          i: '2', // Total Sessions Mins by Player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(1),
        },
        {
          i: '3', // Session by Type
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(2),
        },
        {
          i: '4', // Session by Type by Player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(2),
        },
        {
          i: '7', // Training Session RPE over time
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(3),
        },

        {
          i: '8', // Training Session RPE by player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(3),
        },
        {
          i: '9', // Training Workload (RPE x Duration) Over Time
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(4),
        },
        {
          i: '10', // Training Workload (RPE x Duration)
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(4),
        },

        {
          i: '17', // Drill Duration
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(5),
        },
        {
          i: '18', // Drill Duration by Player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(5),
        },
      ],
    },
    {
      title: i18n.t('Game Summary'),
      tabHash: tabHashes.GAME_SUMMARY,
      layout: [
        {
          i: '7.1', // Game Session RPE over time
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(7),
        },
        {
          i: '8.1', // Game Session RPE by player
          w: 3,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(7),
        },

        {
          i: '10.1', // Game Workload (RPE x Duration)
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(8),
        },
        {
          i: '9.1', // Game Workload (RPE x Duration) Over Time
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(8),
        },

        {
          i: '13', // Yellow Cards by player
          w: 3,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(9),
        },
        {
          i: '14', // Red Cards by player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(9),
        },

        {
          i: '15', // Goals by player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(10),
        },
        {
          i: '16', // Assists by player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(10),
        },

        {
          i: '5', // Number of Games of player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(11),
        },
        {
          i: '6', // Total Minutes
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(11),
        },

        {
          i: '12', // Time in Competition
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(12),
        },
        {
          i: '12.1', // Time in Competition by Player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 4,
          y: coachingDashboardRow(12),
        },

        {
          i: '11', // Time in position by player
          w: COACHING_DASHBOARD_WIDGET_WIDTH,
          h: COACHING_DASHBOARD_WIDGET_HEIGHT,
          x: 0,
          y: coachingDashboardRow(13),
        },
      ],
    },
  ],
});

/**
 * BE will only define widgets related to charts and charting logic, so we will need to define
 * additional widgets here per dashboard. they are baked into the layout above through descriptive
 * string ids such as coaching_header.
 * The order they are inserted into the widget list does not matter as react grid layout will handle that
 */
type AdditionalWidgets = Array<{
  id: string | number,
  title: string,
  type: 'header' | 'athlete' | 'table',
}>;

export const getAdditionalWidgets = (
  key: TemplateDashboardKey
): AdditionalWidgets => {
  const config = {
    coaching_summary: [
      {
        id: 'session_header',
        title: i18n.t('Session Analysis'),
        type: 'header',
      },
      {
        id: 'game_header',
        title: i18n.t('Game Analysis'),
        type: 'header',
      },
    ],
    development_journey: [
      {
        id: 'coaching_header',
        title: i18n.t('Coaching'),
        type: 'header',
      },
      {
        id: 'games_header',
        title: i18n.t('Games'),
        type: 'header',
      },
      {
        id: 'issues_header',
        title: i18n.t('Injuries/Illnesses'),
        type: 'header',
      },
      {
        id: 'player_care_header',
        title: i18n.t('Player Care'),
        type: 'header',
      },
      {
        id: 'athlete_widget',
        title: '',
        type: 'athlete',
      },
    ],
    medical: [
      {
        id: 'injuries_header',
        title: i18n.t('Injuries & Illnesses'),
        type: 'header',
      },
      {
        id: 'treatments_header',
        title: i18n.t('Treatments'),
        type: 'header',
      },
    ],
    growth_and_maturation: [
      {
        id: 'growth_and_maturation_header',
        title: i18n.t('Growth & Maturation'),
        type: 'header',
      },
      {
        id: 'growth_and_maturation_table',
        title: i18n.t('Growth & Maturation Table'),
        type: 'table',
      },
    ],
    staff_development: [
      {
        id: 'coaching_header',
        title: i18n.t('Coaching'),
        type: 'header',
      },
      {
        id: 'games_header',
        title: i18n.t('Games'),
        type: 'header',
      },
      // Work around header to fix blank space adjacent to 'Total Games' and 'Total minutes'.
      {
        id: 'format_header',
        title: i18n.t(''),
        type: 'header',
      },
    ],
  };

  return config[key] || [];
};
