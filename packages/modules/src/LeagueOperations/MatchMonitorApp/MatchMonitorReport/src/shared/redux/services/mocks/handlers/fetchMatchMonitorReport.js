// @flow
import { rest } from 'msw';

import data from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';

const handler = rest.get(
  '/planning_hub/events/1/game_monitor_reports',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
