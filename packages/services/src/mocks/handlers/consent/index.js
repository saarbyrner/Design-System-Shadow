// @flow
import { rest } from 'msw';
import { data as searchAthletesData } from '@kitman/services/src/mocks/handlers/consent/searchAthletes.mock';
import { data as saveAthletesConsentData } from '@kitman/services/src/mocks/handlers/consent/consentMultipleAthletes.mock';
import { data as saveSingleAthleteConsentData } from '@kitman/services/src/mocks/handlers/consent/consentSingleAthlete.mock';
import { endpoint as searchAthletes } from '@kitman/services/src/services/consent/searchAthletes';
import { endpoint as saveAthletesConsent } from '@kitman/services/src/services/consent/saveAthletesConsent';
import { endpoint as saveSingleAthleteConsent } from '@kitman/services/src/services/consent/saveSingleAthleteConsent';
import { endpoint as updateSingleAthleteConsent } from '@kitman/services/src/services/consent/updateSingleAthleteConsent';

const handlers = [
  rest.post(searchAthletes, (req, res, ctx) =>
    res(ctx.json(searchAthletesData))
  ),
  rest.post(saveAthletesConsent, (req, res, ctx) =>
    res(ctx.json(saveAthletesConsentData))
  ),
  rest.post(saveSingleAthleteConsent, (req, res, ctx) =>
    res(ctx.json(saveSingleAthleteConsentData))
  ),
  rest.patch(updateSingleAthleteConsent, (req, res, ctx) =>
    res(ctx.json(saveSingleAthleteConsentData))
  ),
];

export {
  handlers,
  searchAthletesData,
  saveAthletesConsentData,
  saveSingleAthleteConsentData,
};
