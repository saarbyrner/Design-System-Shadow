// @flow
import { rest } from 'msw';
import type { AvailabilityStatusesResponse } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/utils/redux/services/AvailabilityStatusApi';

export const statusOptions: AvailabilityStatusesResponse = [
  'Available',
  'Unavailable',
  'Unavailable - Injured List',
  'Unavailable - On Loan',
];

const handler = rest.get(
  '/profile_variables/athlete_game_status/permitted_values',
  (req, res, ctx) => res(ctx.json(statusOptions))
);

export default handler;
