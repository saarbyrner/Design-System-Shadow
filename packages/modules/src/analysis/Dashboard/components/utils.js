/* eslint-disable flowtype/require-valid-file-annotation */
import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import i18n from '@kitman/common/src/utils/i18n';
import {
  transformGraphResponse,
  transformSummaryResponse,
} from '@kitman/modules/src/analysis/GraphComposer/src/utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

export const emptySquadAthletes = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
};

export const getPlaceholderImgPath = (widgetType, graphType, graphGroup) => {
  let imgUrl = '';

  if (widgetType === 'annotation' || widgetType === 'development_goal') {
    imgUrl = '/img/graph-placeholders/notes-widget-placeholder.png';
  } else if (widgetType === 'graph') {
    if (graphGroup === 'summary_stack_bar') {
      return graphType === 'column'
        ? '/img/graph-placeholders/column-stack-graph-placeholder.png'
        : '/img/graph-placeholders/bar-stack-graph-placeholder.png';
    }

    const imageUrls = {
      combination: '/img/graph-placeholders/combination-graph-placeholder.png',
      column: '/img/graph-placeholders/column-graph-placeholder.png',
      bar: '/img/graph-placeholders/bar-graph-placeholder.png',
      radar: '/img/graph-placeholders/radar-graph-placeholder.png',
      spider: '/img/graph-placeholders/spider-graph-placeholder.png',
      table: '/img/graph-placeholders/table-graph-placeholder.png',
      line: '/img/graph-placeholders/line-graph-placeholder.png',
      donut: '/img/graph-placeholders/donut-graph-placeholder.png',
      pie: '/img/graph-placeholders/pie-graph-placeholder.png',
      value: '/img/graph-placeholders/value-visualisation-placeholder.png',
    };

    imgUrl = imageUrls[graphType];
  }

  return imgUrl;
};

export const getModalPlaceholderImgPath = (
  widgetType,
  graphType,
  graphGroup
) => {
  let imgUrl = '';

  if (widgetType === 'header') {
    imgUrl = '/img/graph-placeholders-modal/header-widget-placeholder.svg';
  } else if (widgetType === 'athlete_profile') {
    imgUrl = '/img/graph-placeholders-modal/profile-widget-placeholder.svg';
  } else if (widgetType === 'annotation' || widgetType === 'development_goal') {
    imgUrl = '/img/graph-placeholders-modal/notes-widget-placeholder.svg';
  } else if (widgetType === 'table') {
    imgUrl = '/img/graph-placeholders-modal/table-widget-placeholder.svg';
  } else if (widgetType === 'action') {
    imgUrl = '/img/graph-placeholders-modal/actions-widget-placeholder.svg';
  } else if (widgetType === 'graph') {
    if (graphGroup === 'summary_stack_bar') {
      return graphType === 'column'
        ? '/img/graph-placeholders-modal/column-stack-graph-placeholder.svg'
        : '/img/graph-placeholders-modal/bar-stack-graph-placeholder.svg';
    }
    const imageUrls = {
      combination:
        '/img/graph-placeholders-modal/combination-graph-placeholder.svg',
      column: '/img/graph-placeholders-modal/column-graph-placeholder.svg',
      bar: '/img/graph-placeholders-modal/bar-graph-placeholder.svg',
      radar: '/img/graph-placeholders-modal/radar-graph-placeholder.svg',
      spider: '/img/graph-placeholders-modal/spider-graph-placeholder.svg',
      table: '/img/graph-placeholders-modal/table-graph-placeholder.svg',
      line: '/img/graph-placeholders-modal/line-graph-placeholder.svg',
      donut: '/img/graph-placeholders-modal/donut-graph-placeholder.svg',
      pie: '/img/graph-placeholders-modal/pie-graph-placeholder.svg',
      value:
        '/img/graph-placeholders-modal/value-visualisation-placeholder.svg',
    };
    imgUrl = imageUrls[graphType];
  } else if (widgetType === 'chart') {
    imgUrl = '/img/graph-placeholders-modal/combination-graph-placeholder.svg';
  }

  return imgUrl;
};

export const getInitalLayout = (graphList, savedLayout) => {
  const defaultGraphHeight = 5;
  const defaultGraphWidth = 6;

  const graphsWithoutLayout = graphList.filter((graph) => {
    const hasAssociatedLayout =
      savedLayout.filter(
        (graphLayout) => `${graphLayout.graph_id}` === `${graph.id}`
      ).length < 1;
    return hasAssociatedLayout;
  });

  // Remove graph layouts for the graphs no longer on the dashboard
  const savedLayoutFiltered = savedLayout.filter((graphLayout) => {
    const isGraphOnTheDashboard =
      graphList.filter((graph) => `${graphLayout.graph_id}` === `${graph.id}`)
        .length > 0;
    return isGraphOnTheDashboard;
  });

  return [
    ...graphsWithoutLayout.map((graph) => ({
      i: `${graph.id}`,
      x: 0,
      y: 0,
      w: defaultGraphWidth,
      h: defaultGraphHeight,
      minH: 2,
      maxH: 7,
    })),
    ...savedLayoutFiltered.map((graphLayout) => ({
      i: `${graphLayout.graph_id}`,
      x: graphLayout.x,
      y: graphLayout.y,
      w: graphLayout.w,
      h: graphLayout.h,
      minH: 2,
      maxH: 7,
    })),
  ];
};

export const buildGraphData = (graphDataResponse, availableVariablesHash) => {
  if (graphDataResponse.graph_group === 'summary') {
    return transformSummaryResponse(graphDataResponse, availableVariablesHash)
      .graphData;
  }

  return transformGraphResponse(
    graphDataResponse,
    graphDataResponse.graph_group
  ).graphData;
};

export const getInitialPivotData = ({
  pivot = false,
  squadAthletesSelection = {},
  timePeriod = null,
  timePeriodLength = null,
  startDate = null,
  endDate = null,
}) => {
  const pivotData = {
    appliedSquadAthletes: _cloneDeep(emptySquadAthletes),
    appliedDateRange: {},
    appliedTimePeriod: '',
  };

  if (pivot) {
    // Set pivot population
    pivotData.appliedSquadAthletes = {
      applies_to_squad:
        squadAthletesSelection.applies_to_squad === 'true' || false,
      position_groups: squadAthletesSelection.position_groups
        ? squadAthletesSelection.position_groups
            .split(',')
            .map((id) => parseInt(id, 10))
        : [],
      positions: squadAthletesSelection.positions
        ? squadAthletesSelection.positions
            .split(',')
            .map((id) => parseInt(id, 10))
        : [],
      athletes: squadAthletesSelection.athletes
        ? squadAthletesSelection.athletes
            .split(',')
            .map((id) => parseInt(id, 10))
        : [],
      all_squads: squadAthletesSelection.all_squads === 'true' || false,
      squads: squadAthletesSelection.squads
        ? squadAthletesSelection.squads.split(',').map((id) => parseInt(id, 10))
        : [],
    };

    // Set pivot time period
    pivotData.appliedTimePeriod = timePeriod;

    if (timePeriod === TIME_PERIODS.customDateRange) {
      pivotData.appliedDateRange = {
        start_date: decodeURIComponent(startDate),
        end_date: decodeURIComponent(endDate),
      };
    }

    if (timePeriod === TIME_PERIODS.lastXDays) {
      pivotData.appliedTimePeriodLength = parseInt(timePeriodLength, 10);
    }
  }

  return pivotData;
};

export const profileWidgetDropdownItems = (config = {}) => {
  const items = [
    {
      id: 'name',
      title: i18n.t('Name'),
    },
    {
      id: 'position',
      title: i18n.t('#sport_specific__Position'),
    },
    {
      id: 'availability',
      title: i18n.t('Availability Status'),
    },
    {
      id: 'date_of_birth',
      title: i18n.t('Date of Birth (Age)'),
    },
    {
      id: 'squads',
      title: i18n.t('#sport_specific__Squads'),
    },
    {
      id: 'height',
      title: i18n.t('Height'),
    },
    {
      id: 'country',
      title: i18n.t('Country'),
    },
    {
      id: 'position_group',
      title: i18n.t('#sport_specific__Position_Group'),
    },
  ];
  if (config.isKeyValuePair) {
    return items.reduce((obj, item) => {
      // eslint-disable-next-line no-param-reassign
      obj[item.id] = item.title;
      return obj;
    }, {});
  }
  return items;
};

export const PREVIEW_FIELD_NUMBERS = [1, 2, 3, 4];

export const organisationBackgroundColor =
  'var(--theme-primary-color) linear-gradient(160deg, var(--theme-primary-4-gradient) 0%, var(--theme-primary-2-gradient) 62%, var(--theme-primary-4-gradient) 61%, var(--theme-primary-2-gradient) 100%) 100%';

export const backgroundColorDropdownItems = () => [
  {
    id: 'organisation_branding',
    title: i18n.t('Organisation Branding'),
  },
  {
    id: 'transparent',
    title: i18n.t('Transparent'),
  },
  {
    id: 'custom',
    title: i18n.t('Custom'),
  },
];

export const backgroundColorValueMap = {
  organisation_branding: organisationBackgroundColor,
  transparent: 'transparent',
  custom: colors.white,
};

export const getInitialBackgroundColorOptionValue = (color) => {
  if (color && color === 'transparent') {
    return 'transparent';
  }
  if (color && color.includes('#') && color.length === 7) {
    return 'custom';
  }
  return 'organisation_branding';
};

export const getProfileWidgetDropdownItemTitleById = (id) => {
  if (id === 'none') {
    return '';
  }
  return profileWidgetDropdownItems().filter((item) => item.id === id)[0].title;
};

export const organisationDetailsValues = {
  orgName: 'ORGANISATION_NAME',
  squadName: 'SQUAD_NAME',
  noName: 'NO_NAME',
  logo: 'LOGO',
  noLogo: 'NO_LOGO',
};
