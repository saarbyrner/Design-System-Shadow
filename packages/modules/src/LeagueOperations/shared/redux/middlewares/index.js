// @flow
import { leagueOperationsApi } from '../api/leagueOperations';
import { registrationPaymentApi } from '../api/registrationPaymentApi';
import { registrationProfileApi } from '../api/registrationProfileApi';
import { registrationOrganisationApi } from '../api/registrationOrganisationApi';
import { registrationSquadApi } from '../api/registrationSquadApi';
import { registrationGridApi } from '../api/registrationGridApi';
import { registrationFormApi } from '../api/registrationFormApi';
import { registrationRequirementsApi } from '../api/registrationRequirementsApi';
import { requirementSectionApi } from '../api/requirementSectionApi';
import { disciplineApi } from '../api/disciplineApi';
import { formsApi } from '../api/formsApi';
import { gameComplianceApi } from '../api/gameComplianceApi';

export default [
  leagueOperationsApi.middleware,
  registrationPaymentApi.middleware,
  registrationProfileApi.middleware,
  registrationOrganisationApi.middleware,
  registrationSquadApi.middleware,
  registrationGridApi.middleware,
  registrationFormApi.middleware,
  registrationRequirementsApi.middleware,
  requirementSectionApi.middleware,
  disciplineApi.middleware,
  formsApi.middleware,
  gameComplianceApi.middleware,
];
