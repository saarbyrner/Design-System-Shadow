// @flow
import type { ComponentType } from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import type { StoreCreator } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import _cloneDeep from 'lodash/cloneDeep';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import userEvent from '@testing-library/user-event';
import i18n from './i18n';

const availabilities = ['available', 'unavailable', 'injured', 'returning'];

export const buildAthlete = ({
  id = Math.floor(Math.random() * 100 + 1),
  firstname = 'Foo',
  lastname = `Bar Baz ${id}`,
  fullname = `Foo Bar Baz ${id}`,
  shortname = `F. Bar Baz ${id}`,
  availability = 'available',
  position = 'Blindside Flanker',
  positionId = Math.floor(Math.random() * 100 + 1),
  positionGroup = 'Back',
  positionGroupId = Math.floor(Math.random() * 100 + 1),
  squad_ids = [], // eslint-disable-line
  screened_today = false, // eslint-disable-line
}: Object): Athlete => ({
  id,
  firstname,
  lastname,
  fullname,
  shortname,
  availability,
  position,
  positionId,
  positionGroup,
  positionGroupId,
  status_data: {
    'pretend-uuid-0': {
      value: null,
      raw_value: null,
      data_points_used: 0,
      alarms: [],
    },
    'pretend-uuid-1': {
      value: '23',
      raw_value: '23',
      data_points_used: 1,
      alarms: [],
    },
    'pretend-uuid-2': {
      value: '4000',
      raw_value: '4000',
      data_points_used: 10,
      alarms: [],
    },
    'pretend-uuid-3': {
      value: null,
      raw_value: null,
      data_points_used: 0,
      alarms: [],
    },
    'pretend-uuid-4': {
      value: null,
      raw_value: null,
      data_points_used: 0,
      alarms: [],
    },
    'pretend-uuid-5': {
      value: '21.43',
      raw_value: '21.43',
      data_points_used: 1,
      alarms: [],
    },
    'pretend-uuid-6': {
      value: 'true',
      raw_value: 'true',
      data_points_used: 1,
      alarms: [],
    },
    'pretend-uuid-7': {
      value: null,
      raw_value: null,
      data_points_used: 0,
      alarms: [],
    },
    'pretend-uuid-8': {
      value: 'false',
      raw_value: 'false',
      data_points_used: 1,
      alarms: [],
    },
    'pretend-uuid-9': {
      value: '321.892',
      raw_value: '321.892',
      data_points_used: 5,
      alarms: [],
    },
  },
  indications: {},
  last_screening: '2017-05-05T10:31:14+01:00',
  screened_today,
  squad_ids,
  avatar_url: '',
});

export const buildAthletes = (numberAthletes: number) => {
  const athletes = [];
  for (let index = 0; index < numberAthletes; index++) {
    athletes.push(
      buildAthlete({
        id: index + 1,
        availability: availabilities[index % 4],
      })
    );
  }

  return athletes;
};

export const buildTemplate = () => ({
  id: Math.floor(Math.random() * 100 + 1).toString(),
  organisation: {
    id: Math.floor(Math.random() * 100 + 1).toString(),
    name: Math.floor(Math.random() * 100 + 1).toString(),
  },
  editor: {
    id: Math.floor(Math.random() * 100 + 1),
    firstname: Math.floor(Math.random() * 100 + 1).toString(),
    lastname: Math.floor(Math.random() * 100 + 1).toString(),
  },
  name: Math.random().toString(36).substring(7),
  created_at: '2017-08-16T11:10:08+01:00',
  updated_at: '2017-08-16T11:10:08+01:00',
});

export const buildTemplates = (number: number) => {
  const templates = [];

  for (let i = 0; i < number; i++) {
    templates.push(buildTemplate());
  }
  return templates;
};

export const i18nextTranslateStub = () => {
  i18n.init({
    fallbackLng: false,
    debug: false,
    saveMissing: false,

    // react i18next special options (optional)
    react: {
      wait: false,
      nsMode: 'fallback', // set it to fallback to let passed namespaces to translated hoc act as fallbacks
    },
    nsSeparator: false,
    keySeparator: false,
  });

  const translateFunction = (key: string, options: Object) =>
    i18n.t(key, options);
  return translateFunction.bind(this);
};

export const buildStatus = (index: number) => ({
  status_id: `pretend-uuid-${index}`,
  name: `Status ${index + 1}`,
  is_custom_name: false,
  alarms: [],
  source_key: `kitman:tv|variable${index}`,
  localised_unit: 'm',
  description: 'last value from today',
  type: 'scale',
  summary: null,
  period_scope: null,
  second_period_all_time: null,
  second_period_length: null,
  period_length: null,
  variables: [{ source: 'kitman:tv', variable: `variable${index}` }],
  settings: {},
});

export const buildStatuses = (numberStatuses: number) => {
  const statuses = [];
  for (let index = 0; index < numberStatuses; index++) {
    statuses.push(buildStatus(index));
  }
  return statuses;
};

export const buildStatusVariable = (index: number) => ({
  source_key: `kitman:tv|variable${index}`,
  name: `Variable ${index + 1}`,
  source_name: 'Training Variable',
  type: 'Number',
  localised_unit: '',
});

export const buildStatusVariables = (numberVariables: number) => {
  const statuses = [];
  for (let index = 0; index < numberVariables; index++) {
    statuses.push(buildStatusVariable(index));
  }
  return statuses;
};

export const buildDashboards = (amount: number) => {
  const dashboards = [];

  for (let index = 0; index < amount; index++) {
    dashboards.push({
      created_at: new Date(Date.now()),
      id: Math.floor(Math.random() * 1000) + 1,
      last_update_by: Math.floor(Math.random() * 1000) + 1,
      name: Math.random().toString(36).substring(7),
      organisation_id: Math.floor(Math.random() * 1000) + 1,
      updated_at: new Date(Date.now()),
    });
  }
  return dashboards;
};

export const buildEvent = () => ({
  id: 37196,
  type: 'game_event',
  name: 'Chelea 3–2 Arsenal',
  duration: null,
  local_timezone: 'Europe/Dublin',
  start_date: '2020-12-19T20:00:00+00:00',
  date: '2020-12-19T20:00:00+00:00',
  score: 3,
  opponent_score: 2,
  opponent_team: {
    id: 1,
    name: 'Arsenal',
  },
  venue_type: {
    id: 1,
    name: 'Away',
  },
  competition: {
    id: 1,
    name: 'Premier league',
  },
  event_users: [],
});

export const buildAlarms = (numberAlarms: number) => {
  const alarms = [];
  for (let index = 0; index < numberAlarms; index++) {
    alarms.push({
      alarm_id: `pretend-uuid-${index}`,
      alarm_type: 'numeric',
      applies_to_squad: true,
      condition: 'less_than',
      value: 5,
      colour: 'colour1',
      position_groups: [],
      positions: [],
      athletes: [],
      percentage_alarm_definition: {},
    });
  }
  return alarms;
};

export const storeFake = (state: any) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: sinon.spy(),
  getState: () => Object.assign({}, state, {}),
});

export const TestProviders = (props: Object) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={storeFake(props.store)}>{props.children}</Provider>
  </I18nextProvider>
);

/*
  Util function to render a component by wrapping it with a redux provider.
  It is specially handy when the component rendered is fetching data by using RTK query
*/

export function renderWithProvider<T>(
  component: ComponentType<T>,
  store: StoreCreator
): RenderOptions {
  const ProviderWrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...render(component, { wrapper: ProviderWrapper }) };
}

/**
 * This is a util to allow for finding nodes in react testing library
 * that might have text split accross multiple html elements.
 *
 * Example would be rich text editor:
 * if this was in the dom
 * <p>This is my <strong> bold </strong> content </p>
 *
 * The regular screen.findByText('this is my bold content') would fail
 *
 * However using this util we can return a function that will match it.
 *
 * screen.findByText(textContentMatcher('this is my bold content'))
 *
 * Ref -> https://github.com/testing-library/dom-testing-library/issues/410
 * @param {String | RegExp} text to be run through matcher
 * @returns Function
 */
export function textContentMatcher(text: string | RegExp) {
  const hasText = (node: HTMLElement) => {
    if (text instanceof RegExp) {
      return node.textContent.match(text);
    }

    return node.textContent === text;
  };

  return (_content: string, node: HTMLElement) => {
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  };
}

export const mockLocalStorage = (mockState: Object = {}) => {
  const originalLocalStorage = _cloneDeep(window.localStorage);

  const localStorageMockValue = (() => {
    let store = {
      ...mockState,
    };

    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMockValue,
  });

  const resetMock = () => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  };

  return resetMock;
};

export const renderWithUserEventSetup = (component: Node) => ({
  user: userEvent.setup(),
  ...render(component),
});
