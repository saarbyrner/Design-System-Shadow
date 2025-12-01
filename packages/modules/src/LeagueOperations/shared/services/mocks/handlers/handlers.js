import { handler as searchOrganisationListHandler } from './searchOrganisationList';

// Payment
import { handler as deletePaymentMethodHandler } from './deletePaymentMethod';
import { handler as exportPaymentHistoryHandler } from './exportPaymentHistory';
import { handler as fetchClubPaymentHandler } from './fetchClubPayment';
import { handler as fetchRepayFormHandler } from './fetchRepayForm';
import { handler as payRegistrationHandler } from './payRegistration';
import { handler as storePaymentMethodHandler } from './storePaymentMethod';
import { handler as searchAthleteListHandler } from './searchAthleteList';
import { handler as fetchRegistrationStatusOptionsHandler } from './fetchRegistrationStatusOptions';
import { handler as fetchRegistrationStatusReasonsHandler } from './fetchRegistrationStatusReasons';
import { handler as fetchAthleteHandler } from './fetchAthlete';
import { handler as fetchUserHandler } from './fetchUser';
import { handler as fetchRegistrationProfileHandler } from './fetchRegistrationProfile';
import { handler as fetchRegistrationRequirementsProfileFormHandler } from './fetchRegistrationRequirementsProfileForm';
import { handler as fetchRegistrationRequirementsHandler } from './fetchRegistrationRequirements';
import { handler as fetchRequirementSectionsHandler } from './fetchRequirementSections';
import { handler as createRegistrationFormHandler } from './createRegistrationForm';
import { handler as createUserRegistrationStatusHandler } from './createUserRegistrationStatus';

import { handler as searchSquadListHandler } from './searchSquadList';
import { handler as fetchSquadHandler } from './fetchSquad';
import { handler as searchUserListHandler } from './searchUserList';
import { handler as fetchOrganisationHandler } from './fetchOrganisation';
import { handler as applyRequirementStatusHandler } from './applyRequirementStatus';
import { handler as updateRegistrationStatusHandler } from './updateRegistrationStatus';
import { handler as updateUserRegistrationStatusHandler } from './updateUserRegistrationStatus';
import { handler as updateRegistrationProfileFormHandler } from './updateRegistrationProfileForm';
import { handler as fetchRegistrationHistoryHandler } from './fetchRegistrationHistory';
import { handler as fetchRequirementSectionHistoryHandler } from './fetchRequirementSectionHistory';
import { handler as fetchIsRequirementSubmittable } from './fetchIsRequirementSubmittable';

import { handler as searchDiscipineAthleteListHandler } from './searchDisciplineAthleteList';
import { handler as searchDiscipineUserListHandler } from './searchDisciplineUserList';
import { handler as fetchDisciplineReasons } from './fetchDisciplineReasons';
import { handler as createDisciplinaryIssue } from './createDisciplinaryIssue';
import { handler as fetchGameComplianceInfo } from './fetchGameComplianceInfo';
import { handler as searchHomegrownList } from './searchHomegrownList';
import { handler as createHomegrownSubmission } from './createHomegrownSubmission';
import { handler as updateHomegrownSubmission } from './updateHomegrownSubmission';
import { handler as archiveHomegrownSubmission } from './archiveHomegrownSubmission';
import { handler as sendHomegrownSubmissionNotification } from './sendHomegrownSubmissionNotification';

export default [
  fetchAthleteHandler,
  fetchUserHandler,
  searchAthleteListHandler,
  searchOrganisationListHandler,
  deletePaymentMethodHandler,
  exportPaymentHistoryHandler,
  searchUserListHandler,
  fetchClubPaymentHandler,
  fetchRepayFormHandler,
  payRegistrationHandler,
  storePaymentMethodHandler,
  searchSquadListHandler,
  fetchSquadHandler,
  fetchRegistrationStatusOptionsHandler,
  fetchOrganisationHandler,
  fetchRegistrationProfileHandler,
  fetchRegistrationRequirementsHandler,
  fetchRegistrationRequirementsProfileFormHandler,
  fetchRequirementSectionsHandler,
  createRegistrationFormHandler,
  applyRequirementStatusHandler,
  updateRegistrationStatusHandler,
  updateUserRegistrationStatusHandler,
  updateRegistrationProfileFormHandler,
  fetchRegistrationHistoryHandler,
  fetchIsRequirementSubmittable,
  searchDiscipineAthleteListHandler,
  searchDiscipineUserListHandler,
  fetchRequirementSectionHistoryHandler,
  fetchDisciplineReasons,
  fetchGameComplianceInfo,
  createDisciplinaryIssue,
  fetchRegistrationStatusReasonsHandler,
  createUserRegistrationStatusHandler,
  searchHomegrownList,
  createHomegrownSubmission,
  updateHomegrownSubmission,
  archiveHomegrownSubmission,
  sendHomegrownSubmissionNotification,
];
