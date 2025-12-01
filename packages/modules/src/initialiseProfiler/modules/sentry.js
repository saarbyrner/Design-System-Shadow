// @flow
import * as Sentry from '@sentry/browser';

import { sentryIgnorePrefix } from '@kitman/common/src/consts/services';
import { getSquadFromPath } from '@kitman/common/src/utils';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';

export default () => {
  const configElement = document.getElementById('SentryConfig');
  if (!configElement || isConnectedToStaging) return;

  const config = configElement.dataset;

  Sentry.init({
    dsn: config.sentrySecret,
    environment: config.environment,
    release: config.revision || null,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      new RegExp(`^${sentryIgnorePrefix}`),
      /^NoRoute: no route found at \/$/,
      /^NoRoute: no route found at \/activity$/,
      /^NoRoute: no route found at \/administration\/athletes\/new$/,
      /^NoRoute: no route found at \/analysis\/athletes$/,
      /^NoRoute: no route found at \/analysis\/biomechanical$/,
      /^NoRoute: no route found at \/analysis\/dashboard$/,
      /^NoRoute: no route found at \/analysis\/injuries$/,
      /^NoRoute: no route found at \/analysis\/squad$/,
      /^NoRoute: no route found at \/athletes\/\d+$/,
      /^NoRoute: no route found at \/athletes\/reports$/,
      /^NoRoute: no route found at \/athletes\/screenings$/,
      /^NoRoute: no route found at \/fixture_negotiation$/,
      /^NoRoute: no route found at \/fixtures$/,
      /^NoRoute: no route found at \/frontend_application\/$/,
      /^NoRoute: no route found at \/medical\/athletes$/,
      /^NoRoute: no route found at \/medical\/users\/\d+$/,
      /^NoRoute: no route found at \/planning_hub\/events\/\d+\/transform_event$/,
      /^NoRoute: no route found at \/registration$/,
      /^NoRoute: no route found at \/registration\/requirements$/,
      /^NoRoute: no route found at \/settings\/set_squad\/\d+$/,
      /^NoRoute: no route found at \/settings\/athletes\/\d+\/edit$/,
      /^NoRoute: no route found at \/settings\/athletes\/new$/,
      /^NoRoute: no route found at \/users\/\d+\/edit$/,
      /^NoRoute: no route found at \/users\/new$/,
      /^NoRoute: no route found at \/workloads\/athletes$/,
      /^NoRoute: no route found at \/workloads\/squad$/,
    ],
  });

  Sentry.configureScope((scope) => {
    scope.setTag('logger', 'Javascript');
    scope.setTag('request_id', config.request_id);
    /**
     * When the SPA is fully implemented this tag can be removed,
     * the responsible squads will be tracked based on the Router.
     */
    scope.setTag(
      'responsible_squad',
      getSquadFromPath?.(window.location.pathname)
    );

    scope.setUser({
      current_organisation: config.currentOrganisation,
      current_organisation_id: config.currentOrganisationId,
      timeseries_active: config.timeseriesActive,
      timeseries_start_date: config.timeseriesStartDate,
      timeseries_end_date: config.timeseriesEndDate,
      current_squad: config.currentSquad,
      current_squad_id: config.currentSquad_id,
      id: config.id,
    });
  });
};
