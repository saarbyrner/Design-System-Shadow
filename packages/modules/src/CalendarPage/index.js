/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import planningEvent from '@kitman/modules/src/PlanningEvent/src/redux/reducers';
import filtersReducer, {
  getInitialState,
} from '@kitman/components/src/Calendar/CalendarFilters/redux/slices/filters';
import settingsReducer from '@kitman/components/src/Calendar/CalendarSettings/redux/slices/settings';
import { calendarFiltersApi } from '@kitman/components/src/Calendar/CalendarFilters/redux/services/filters';
import { notificationsApi } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { calendarSettingsApi } from '@kitman/components/src/Calendar/CalendarSettings/redux/services/settings';
import { reducerKey as calendarFiltersReducerKey } from '@kitman/components/src/Calendar/CalendarFilters/redux/consts';
import { reducerKey as calendarSettingsReducerKey } from '@kitman/components/src/Calendar/CalendarSettings/redux/consts';
import { isDevEnvironment, setupReduxDevTools } from '@kitman/common/src/utils';
import { getEventConditions, getPermissions } from '@kitman/services';

import App from './src/containers/App';
import {
  calendarPage,
  appStatus,
  eventsPanel,
  deleteEvent,
  eventTooltip,
} from './src/reducer';
import { calculatePermission } from '../PlanningEvent/src/helpers/utils';

const isOptimizedCalendarFFOn = window.featureFlags['optimized-calendar'];
const isCalendarSettingsFFOn = window.featureFlags['calendar-settings-ip'];

// setup Redux dev tools
const middlewares = [
  thunkMiddleware,
  globalApi.middleware,
  notificationsApi.middleware,
];

const composeEnhancers = setupReduxDevTools(compose);

const reducers = {
  calendarPage,
  appStatus,
  eventsPanel,
  deleteEvent,
  eventTooltip,
  planningEvent,
  globalApi: globalApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
};

const optimizedCalendarStateTree = combineReducers({
  ...reducers,
  [calendarFiltersReducerKey]: filtersReducer,
  calendarFiltersApi: calendarFiltersApi.reducer,
  notificationsApi: notificationsApi.reducer,
  ...(isCalendarSettingsFFOn
    ? {
        [calendarSettingsReducerKey]: settingsReducer,
        calendarSettingsApi: calendarSettingsApi.reducer,
      }
    : {}),
});

const stateTree = combineReducers({ ...reducers });

const body = document.getElementsByTagName('body')[0];
const orgTimeZone = body.dataset.timezone || null;
const userLocale = body.dataset.userLocale || null;

const selectedCalendarView =
  window.localStorage && window.localStorage.getItem('selectedCalendarView')
    ? window.localStorage.getItem('selectedCalendarView')
    : 'dayGridMonth';

const appliedCalendarFilters =
  window.localStorage &&
  window.localStorage.getItem('calendarSquadSessionsFilter') &&
  window.localStorage.getItem('calendarIndividualSessionsFilter') &&
  window.localStorage.getItem('calendarGamesFilter') &&
  window.localStorage.getItem('calendarPlannedWorkloadsFilter') &&
  window.localStorage.getItem('calendarTreatmentsFilter') &&
  window.localStorage.getItem('calendarRehabFilter') &&
  window.localStorage.getItem('calendarCustomEventsFilter')
    ? {
        squadSessionsFilter: JSON.parse(
          window.localStorage.getItem('calendarSquadSessionsFilter')
        ),
        individualSessionsFilter: JSON.parse(
          window.localStorage.getItem('calendarIndividualSessionsFilter')
        ),
        gamesFilter: JSON.parse(
          window.localStorage.getItem('calendarGamesFilter')
        ),
        treatmentsFilter: JSON.parse(
          window.localStorage.getItem('calendarTreatmentsFilter')
        ),
        rehabFilter: JSON.parse(
          window.localStorage.getItem('calendarRehabFilter')
        ),
        customEventsFilter: JSON.parse(
          window.localStorage.getItem('calendarCustomEventsFilter')
        ),
      }
    : {
        squadSessionsFilter: true,
        individualSessionsFilter: false,
        gamesFilter: true,
        treatmentsFilter: false,
        rehabFilter: false,
        customEventsFilter: !!window.featureFlags['custom-events'],
      };

const fetchData = () =>
  new Promise((resolve, reject) => {
    $.get(
      '/calendar/calendar_initial_data',
      (data) => resolve(data),
      'json'
    ).fail(() => reject());
  });

const preloadedState = {
  calendarPage: {
    events: [],
    calendarDates: {
      startDate: null,
      endDate: null,
    },
    calendarSettings: {},
    currentView: selectedCalendarView,
    calendarFilters: isOptimizedCalendarFFOn
      ? { ...getInitialState() }
      : appliedCalendarFilters,
    squadSelection: {
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    gameModal: {
      isOpen: false,
    },
    sessionModal: {
      isOpen: false,
    },
    customEventModal: {
      isOpen: false,
    },
  },
  appStatus: {
    status: null,
    message: null,
  },
  eventsPanel: {
    isOpen: false,
    mode: 'VIEW_TEMPLATES',
    event: null,
  },
  eventTooltip: {
    active: false,
    calendarEvent: null,
    element: null,
  },
  deleteEvent: {
    event: null,
  },
};

const store = isOptimizedCalendarFFOn
  ? configureStore({
      reducer: optimizedCalendarStateTree,
      devTools: isDevEnvironment(),
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false,
        }).concat([
          ...middlewares,
          calendarFiltersApi.middleware,
          ...(isCalendarSettingsFFOn ? [calendarSettingsApi.middleware] : []),
        ]),
      preloadedState,
    })
  : createStore(
      stateTree,
      preloadedState,
      composeEnhancers(applyMiddleware(...middlewares))
    );

const CalendarApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    Promise.all([fetchData(), getPermissions(), getEventConditions()]).then(
      ([calendarData, permissions, eventConditions]) => {
        setData({
          permissions,
          squadAthletes: calendarData.squad_athletes,
          eventConditions,
        });
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App
                orgTimeZone={orgTimeZone}
                userLocale={userLocale}
                canShowTreatments={
                  (window.featureFlags['schedule-treatments'] &&
                    data.permissions.notes?.includes('view') &&
                    data.permissions.notes?.includes('medical-notes')) ||
                  false
                }
                canShowRehab={
                  (window.featureFlags['schedule-rehab'] &&
                    data.permissions.notes?.includes('view') &&
                    data.permissions.notes?.includes('medical-notes')) ||
                  false
                }
                canManageWorkload={data.permissions.workloads?.includes(
                  'workload-manage'
                )}
                squadAthletes={data.squadAthletes}
                eventConditions={data.eventConditions}
                isGamesAdmin={data.permissions.workloads?.includes(
                  'games-admin'
                )}
                canCreateGames={
                  data.permissions.workloads?.includes('games-create') ||
                  data.permissions.workloads?.includes('games-admin')
                }
                canCreateCustomEvents={
                  calculatePermission(
                    data.permissions['calendar-settings'],
                    'create-custom-event'
                  ) ||
                  calculatePermission(
                    data.permissions['calendar-settings'],
                    'super-admin-custom-event'
                  )
                }
              />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default CalendarApp;
