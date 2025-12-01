// @flow
import * as Sentry from '@sentry/browser';
import emojiRegex from 'emoji-regex';
import sortBy from 'lodash/sortBy';
import responsibleSquads, {
  UNMATCHED_ROUTE,
  type RouteMapping,
} from '@kitman/common/src/config/responsibleSquads';
import type { _Iteratee } from 'lodash';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Status } from '@kitman/common/src/types/Status';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type {
  AlarmFilterOptions,
  AthleteFilterOptions,
} from '@kitman/common/src/types/__common';
import type { SortOrder, Validation } from '@kitman/common/src/types';
import { colors } from '@kitman/common/src/variables';
import i18n from './i18n';
import groupByOptions from './groupByOptions';

// These functions are passed to Lodash's sortBy function to sort athlete objects
const athleteFieldToLower = (athlete: Athlete, field: string) =>
  athlete[field].toLowerCase();
const lastNameToLower = (athlete: Athlete) =>
  athleteFieldToLower(athlete, 'lastname');
const firstNameToLower = (athlete: Athlete) =>
  athleteFieldToLower(athlete, 'firstname');

const groupAthletes = (athletes: Athlete[], groupByField: string) => {
  const groupedAthletes = {};

  athletes.forEach((athlete) => {
    if (groupByField === 'name') {
      if (groupedAthletes.alphabetical === undefined) {
        groupedAthletes.alphabetical = [];
      }
      groupedAthletes.alphabetical.push(athlete);
    } else {
      if (groupedAthletes[athlete[groupByField]] === undefined) {
        groupedAthletes[athlete[groupByField]] = [];
      }
      groupedAthletes[athlete[groupByField]].push(athlete);
    }
  });

  return groupedAthletes;
};

export const statusesToIds = (statuses: Array<Status>): Array<string> =>
  statuses.map((status) => status.status_id);

export const statusesToMap = (statuses: Array<Status>) => {
  return statuses.reduce((hash, status) => {
    // Using Object.assign as that's what eslint recommends
    // https://github.com/airbnb/javascript/issues/719
    Object.assign(hash, { [status.status_id]: status });
    return hash;
  }, {});
};

export const dashboardsToMap = (dashboards: Array<Object>) =>
  dashboards.reduce((hash, dashboard) => {
    // Using Object.assign as that's what eslint recommends
    // https://github.com/airbnb/javascript/issues/719
    Object.assign(hash, { [dashboard.id]: dashboard });
    return hash;
  }, {});

const sortGroups = (
  grouped: { [string]: Array<Athlete> },
  sortByFields: Array<_Iteratee<Athlete> | string> = [
    lastNameToLower,
    firstNameToLower,
  ]
) => {
  const sortedGroups = {};
  // Sort the grouped athletes
  Object.keys(grouped).forEach((group) => {
    sortedGroups[group] = sortBy(grouped[group], sortByFields);
  });

  return sortedGroups;
};

export const orderGroups = (
  group: Object,
  groupOrder: Array<string>
): Array<string> => groupOrder.map((groupID) => group[groupID]);

export const groupAthletesByPosition = (athletes: Object) => {
  const grouped = groupAthletes(athletes, 'position');
  return sortGroups(grouped);
};

export const groupAthletesByPositionGroup = (
  athletes: Object,
  orderedPositions: Array<string> = []
) => {
  const grouped = groupAthletes(athletes, 'positionGroup');

  // Lodash sort function. Given an athlete it returns the index of their position
  // in the orderedPositions array
  const posIndex = (athlete) => orderedPositions.indexOf(athlete.position);

  return sortGroups(grouped, [posIndex, lastNameToLower, firstNameToLower]);
};

export const groupAthletesByScreening = (athletes: Object) => {
  const groupedAthletes = {
    screened: [],
    not_screened: [],
  };

  athletes.forEach((athlete) => {
    const group = athlete.screened_today ? 'screened' : 'not_screened';
    groupedAthletes[group].push(athlete);
  });

  return sortGroups(groupedAthletes, [
    'last_screening',
    lastNameToLower,
    firstNameToLower,
  ]);
};

export const groupAthletesByName = (athletes: Object) => {
  const grouped = groupAthletes(athletes, 'name');
  return sortGroups(grouped);
};

export const groupAthletesByAvailability = (athletes: Object) => {
  const grouped = groupAthletes(athletes, 'availability');

  return sortGroups(grouped);
};

const getAlarmFilterResult = (
  selectedFilters: Array<?AlarmFilterOptions>,
  alarmFilter: AlarmFilterOptions,
  searchHit: boolean
) => {
  const isAlarmFilterSelected = selectedFilters.indexOf(alarmFilter) !== -1;
  return searchHit && isAlarmFilterSelected;
};

const filterAthletesByNameOrPosition = (athlete, athleteFilters, searchHit) => {
  if (
    athleteFilters.includes(athlete.id) ||
    athleteFilters.includes(athlete.positionId) ||
    athleteFilters.includes(athlete.positionGroupId)
  ) {
    return searchHit && true;
  }

  return false;
};

const filterAthletes = (searchHit, athlete, alarmFilters, athleteFilters) => {
  const athleteAlarms = Object.keys(athlete.status_data).map(
    (alarmId) => athlete.status_data[alarmId].alarms.length > 0
  );
  const isAthleteInAlarm = athleteAlarms.indexOf(true) !== -1;
  const alarmFilter = isAthleteInAlarm ? 'inAlarm' : 'noAlarms';
  const alarmResult = getAlarmFilterResult(
    alarmFilters,
    alarmFilter,
    searchHit
  );

  if (athleteFilters && athleteFilters.length > 0) {
    return (
      alarmResult &&
      filterAthletesByNameOrPosition(athlete, athleteFilters, searchHit)
    );
  }

  return alarmResult;
};

const sortAthletes = (athleteGroup, sortedBy, sortOrder, sortedByStatusKey) =>
  athleteGroup.sort((athlete1, athlete2) => {
    // sleep duration format is '11h 45m', we need to sort by raw value
    const comparableValue1 =
      sortedByStatusKey !== 'kitman:tv|sleep_duration'
        ? athlete1.status_data[sortedBy].value
        : athlete1.status_data[sortedBy].raw_value;
    const comparableValue2 =
      sortedByStatusKey !== 'kitman:tv|sleep_duration'
        ? athlete2.status_data[sortedBy].value
        : athlete2.status_data[sortedBy].raw_value;
    if (sortOrder === 'low_to_high') {
      if (comparableValue1 < comparableValue2) {
        return -1;
      }
      if (comparableValue1 > comparableValue2) {
        return 1;
      }
      return 0;
    }
    // sortOrder === 'high_to_low'
    if (comparableValue1 < comparableValue2) {
      return 1;
    }
    if (comparableValue1 > comparableValue2) {
      return -1;
    }
    return 0;
  });

export const getFilteredAthletes = (
  groupedAthletes: { [string]: Array<Object> },
  searchTerm: string = '',
  squadFilter?: string | number | null,
  alarmFilters?: Array<?AlarmFilterOptions>,
  athleteFilters?: Array<?AthleteFilterOptions>,
  sortOrder?: SortOrder | '',
  sortedBy?: string,
  sortedByStatusKey?: string
) => {
  let noResults = true;
  const athletes = {};
  const groupHeadings = Object.keys(groupedAthletes);

  groupHeadings.forEach((group) => {
    athletes[group] = groupedAthletes[group].filter((athlete) => {
      const fullName =
        `${athlete.firstname} ${athlete.lastname}`.toLocaleLowerCase();
      const searchHit = fullName.indexOf(searchTerm.toLocaleLowerCase()) !== -1;

      // if squad filter applied, filter by squad too
      // users can view all athletes, so we ignore if the squad filter
      // is set to all
      if (squadFilter && athlete.squad_ids) {
        return searchHit && athlete.squad_ids.indexOf(squadFilter) !== -1;
      }

      // we don't filter by squad on the dashboard where alarms are available,
      // so we ignore the results of squad filtering
      if (alarmFilters && alarmFilters.length > 0) {
        return filterAthletes(searchHit, athlete, alarmFilters, athleteFilters);
      }

      if (athleteFilters && athleteFilters.length > 0) {
        return filterAthletesByNameOrPosition(
          athlete,
          athleteFilters,
          searchHit
        );
      }

      return searchHit;
    });

    if (athletes[group].length > 0) {
      noResults = false;

      // sorting
      if (sortOrder && sortedBy && sortedByStatusKey) {
        athletes[group] = sortAthletes(
          athletes[group],
          sortedBy,
          sortOrder,
          sortedByStatusKey
        );
      }
    }
  });

  return noResults ? null : athletes;
};

// getIslocalStorageAvailable()
// returns whether the localStorage API is avaialble
export const getIsLocalStorageAvailable = () => {
  // check if localStorage is available. We do
  // this mainly for spec purposes, because there is
  // no concept of a "browser", so localStorage causes
  // a lot of errors. But it's good defensive programming
  // to have in place anyways
  if (typeof localStorage !== 'undefined') {
    return true;
  }
  return false;
};

export const getDefaultGroupBy = () => {
  if (getIsLocalStorageAvailable()) {
    return window.localStorage.getItem('groupBy')
      ? window.localStorage.getItem('groupBy')
      : 'availability';
  }
  return 'availability';
};

export const isDevEnvironment = () =>
  process.env.NODE_ENV !== 'production' && typeof window === 'object';

// set up Redux dev tools
export const setupReduxDevTools = (compose: Function) => {
  if (isDevEnvironment() && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify here name, actionsBlacklist, actionsCreators and other options
    });
  }

  return compose;
};
/* eslint-enable */

export const sendIntercomMessage = (message: string) => {
  if (typeof window.Intercom !== 'undefined') {
    window.Intercom('showNewMessage', message);
  } else {
    window.location.href = `mailto:support@kitmanlabs.com?body=${message}`;
  }
};

export const thunkStub =
  (
    // for more info on testing Redux middleware, see here:
    // https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#async-action-creators
    { dispatch, getState }: { dispatch: Function, getState?: Function }
  ) =>
  (action: Function, arg: any = null) => {
    if (typeof action === 'function') {
      return dispatch(action(arg)(dispatch, getState));
    }

    // do nothing
    return null;
  };

export const formatDate = (date: string) => {
  if (window.moment) {
    return window.moment.parseZone(date).format('h:mm a, DD MMM YYYY');
  }
  return date;
};

export const containsAnEmoji = (text: string): Validation => {
  const regex = emojiRegex();
  const theTextContainsEmoji = regex.test(text);

  return {
    isValid: !theTextContainsEmoji,
    errorType: 'emoji',
    message: i18n.t('Emojis cannot be used :('),
  };
};

export const getAlarmColour = (
  colourName: ?$PropertyType<Alarm, 'colour'>
): string => {
  switch (colourName) {
    case 'colour1':
      return colors.alarmColour1;
    case 'colour2':
      return colors.alarmColour2;
    case 'colour3':
      return colors.alarmColour3;
    case 'colour4':
      return colors.alarmColour4;
    case 'colour5':
      return colors.alarmColour5;
    case 'colour6':
      return colors.alarmColour6;
    case 'colour7':
      return colors.alarmColour7;
    case 'colour8':
      return colors.alarmColour8;
    default:
      return colors.alarmColour1;
  }
};

export const TrackEvent = (
  eventCategory: string,
  eventAction: string,
  eventLabel: string
) => {
  // $FlowFixMe: third party library not imported (Google analytics)
  if (typeof ga === 'function') {
    ga('send', 'event', eventCategory, eventAction, eventLabel); // eslint-disable-line no-undef
  }
};

export const trackIntercomEvent = (eventName: string) => {
  // $FlowFixMe Flow cannot resolve Intercom
  if (window.isIntercomEnabled && typeof Intercom !== 'undefined')
    Intercom('trackEvent', eventName); // eslint-disable-line no-undef
};

export const SentryCaptureMessage = (
  message: string,
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info'
) => {
  Sentry.captureMessage(message, level);
};

export const getGroupOrderingByType = (positionsHash: { [string]: any }) => {
  const groupOrderingByType = {};
  groupByOptions().forEach((option) => {
    switch (option.id) {
      case 'position':
        groupOrderingByType[option.id] = orderGroups(
          positionsHash.positions,
          positionsHash.position_order
        );
        break;
      case 'positionGroup':
        groupOrderingByType[option.id] = orderGroups(
          positionsHash.position_groups,
          positionsHash.position_group_order
        );
        break;
      case 'availability':
        groupOrderingByType[option.id] = [
          'unavailable',
          'injured',
          'returning',
          'available',
        ];
        break;
      case 'last_screening':
        groupOrderingByType[option.id] = ['screened', 'not_screened'];
        break;
      case 'name':
        groupOrderingByType[option.id] = ['alphabetical'];
        break;
      default:
        groupOrderingByType[option.id] = [];
    }
  });
  return groupOrderingByType;
};

// Edge 15 and bellow don't support URL.searchParams
const searchParamPolyfill = (param) => {
  const getParamRegex = new RegExp(`${param}=([^&]+)`);
  const getParamResult = getParamRegex.exec(window.location.search);
  const paramValue =
    getParamResult && getParamResult.length > 1 ? getParamResult[1] : '';

  return paramValue;
};

export const searchParams = (param: string) => {
  const parsedUrl = new URL(window.location.href);
  if (parsedUrl.searchParams) {
    return parsedUrl.searchParams.get(param);
  }

  return searchParamPolyfill(param);
};

export const parseNoteMedicalTypeOptions = (medicalTypes: {
  [string]: { [string]: string },
}) => {
  const options = [];
  Object.keys(medicalTypes).forEach((group) => {
    options.push({ isGroupOption: true, name: group });
    Object.keys(medicalTypes[group]).forEach((medicalType) => {
      options.push({
        name: medicalType,
        key_name: medicalTypes[group][medicalType],
      });
    });
  });
  return options;
};

export const isColourDark = (colour: string) => {
  const red = parseInt(colour.slice(1, 3), 16);
  const green = parseInt(colour.slice(3, 5), 16);
  const blue = parseInt(colour.slice(5, 7), 16);

  // values taken from https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 150) {
    return false;
  }
  return true;
};

export const isValidUrl = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator

  return !!pattern.test(str);
};

export const validateURL = (url: string) => {
  const res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
  );
  return res !== null;
};

export const containsWhitespace = (url: string) =>
  /\s/.test(url) || url.includes('%20');

/**
 * returns a valid href for an external link
 * if the received url has any protocol (http/https) it returns the url
 * otherwise, // is added at the beginning of the returned href to prevent
 * a concatenated url like http://kitman.injuryprofiler.test:8081/www.google.com
 */
export const getValidHref = (url: string) => {
  const hasProtocol = /(http(s?)):\/\//i.test(url);
  return hasProtocol ? url : `//${url}`;
};

export const arraysAreNotEqual = (arr1: Array<any>, arr2: Array<any>) => {
  return JSON.stringify(arr1) !== JSON.stringify(arr2);
};

const sortedRoutes: RouteMapping[] = Object.keys(responsibleSquads)
  .flatMap((squad) =>
    responsibleSquads[squad].map((route) => ({ route, squad }))
  )
  .sort((a, b) => b.route.length - a.route.length);

/**
 * Returns the responsible squad for a given path.
 * Routes are matched by specificity - more specific paths take priority over general ones.
 * For example, '/athletes/reports' will match the reporting squad instead of a general '/athletes' route.
 * If the path does not match any known route, it returns 'Unknown Route'.
 */
export const getSquadFromPath = (path: string): string => {
  if (!path) return 'Unknown Route';

  const match = sortedRoutes.find(({ route }) => path.startsWith(route));
  return match?.squad || UNMATCHED_ROUTE;
};
