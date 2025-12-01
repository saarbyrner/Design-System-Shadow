// @flow

import { menuButtonTypes, fixtureReports } from './helpers';

export type MenuButtonModalInfo = {
  id: ?number | string,
  type: $Values<typeof menuButtonTypes> | '',
};

export type FixtureReportTypes = $Values<typeof fixtureReports>;
