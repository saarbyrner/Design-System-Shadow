// @flow
import { handler as fetchFormDetails } from './mockServices/fetchFormDetails';
import { handler as fetchFormResult } from './mockServices/fetchFormResult';
import { handler as searchFormsHandler } from './mockServices/searchForms';
import { handler as searchFormResults } from './mockServices/searchFormResults';
import { handler as searchTemplateForms } from './mockServices/searchTemplateForms';

import { handler as updateAthleteProfile } from './athleteProfile/updateAthleteProfile';
import { handler as exportAthleteProfile } from './athleteProfile/exportAthleteProfile';
import { handler as fetchAthleteProfileForm } from './athleteProfile/fetchAthleteProfileForm';
import { handler as fetchIntegrationSettings } from './athleteProfile/fetchIntegrationSettings';
import { handler as updateAthleteIntegrationSettings } from './athleteProfile/updateAthleteIntegrationSettings';
import { handler as resetAthletePassword } from './athleteProfile/resetAthletePassword';

import { handler as fetchFormAnswersSet } from './genericForms/fetchFormAnswersSet';
import { handler as bulkCreateFormAnswersSet } from './genericForms/bulkCreateFormAnswersSet';
import { handler as updateFormAnswersSet } from './genericForms/updateFormAnswersSet';
import { handler as deleteFormAnswersSet } from './genericForms/deleteFormAnswersSet';
import { handler as createFormAnswersSet } from './genericForms/createFormAnswersSet';
import { handler as autosavePatchFormAnswersSet } from './genericForms/autosavePatchFormAnswersSet';

import { handler as fetchFormTypes } from './fetchFormTypes';

import { handler as fetchAssignedForms } from './assignedForms/fetchAssignedForms';

export default [
  createFormAnswersSet,
  bulkCreateFormAnswersSet,
  deleteFormAnswersSet,
  exportAthleteProfile,
  fetchAssignedForms,
  fetchAthleteProfileForm,
  fetchFormAnswersSet,
  fetchFormDetails,
  fetchFormResult,
  fetchFormTypes,
  fetchIntegrationSettings,
  resetAthletePassword,
  searchFormResults,
  searchFormsHandler,
  searchTemplateForms,
  updateAthleteIntegrationSettings,
  updateAthleteProfile,
  updateFormAnswersSet,
  autosavePatchFormAnswersSet,
];
