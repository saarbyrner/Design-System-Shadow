// @flow

import matchDayEmailSlice, {
  REDUCER_KEY as matchDayEmailSliceKey,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import {
  leagueOperationsApi,
  REDUCER_KEY as leagueOperationsServices,
} from '../api/leagueOperations';

import registrationProfileSlice, {
  REDUCER_KEY as registrationProfileSliceKey,
} from '../slices/registrationProfileSlice';

import registrationOrganisationSlice, {
  REDUCER_KEY as registrationOrganisationSliceKey,
} from '../slices/registrationOrganisationSlice';

import registrationSquadSlice, {
  REDUCER_KEY as registrationSquadSliceKey,
} from '../slices/registrationSquadSlice';

import registrationGridSlice, {
  REDUCER_KEY as registrationGridSliceKey,
} from '../slices/registrationGridSlice';

import registrationRequirementsSlice, {
  REDUCER_KEY as registrationRequirementsSliceKey,
} from '../slices/registrationRequirementsSlice';

import registrationApprovalSlice, {
  REDUCER_KEY as registrationApprovalSliceKey,
} from '../slices/registrationApprovalSlice';

import registrationHistorySlice, {
  REDUCER_KEY as registrationHistorySliceKey,
} from '../slices/registrationHistorySlice';

import disciplinaryIssueSlice, {
  REDUCER_KEY as disciplinaryIssueSliceKey,
} from '../slices/disciplinaryIssueSlice';

import createFixtureSlice, {
  REDUCER_KEY as createFixtureSliceKey,
} from '../slices/createFixtureSlice';

import homegrownSlice, {
  REDUCER_KEY as homegrownSliceKey,
} from '../slices/homegrownSlice';

const APIS = {
  [leagueOperationsServices]: leagueOperationsApi.reducer,
};

const SLICES = {
  [registrationProfileSliceKey]: registrationProfileSlice.reducer,
  [registrationOrganisationSliceKey]: registrationOrganisationSlice.reducer,
  [registrationSquadSliceKey]: registrationSquadSlice.reducer,
  [registrationSquadSliceKey]: registrationSquadSlice.reducer,
  [registrationGridSliceKey]: registrationGridSlice.reducer,
  [registrationRequirementsSliceKey]: registrationRequirementsSlice.reducer,
  [registrationApprovalSliceKey]: registrationApprovalSlice.reducer,
  [registrationHistorySliceKey]: registrationHistorySlice.reducer,
  [disciplinaryIssueSliceKey]: disciplinaryIssueSlice.reducer,
  [createFixtureSliceKey]: createFixtureSlice.reducer,
  [matchDayEmailSliceKey]: matchDayEmailSlice.reducer,
  [homegrownSliceKey]: homegrownSlice.reducer,
};

export default {
  ...APIS,
  ...SLICES,
};
