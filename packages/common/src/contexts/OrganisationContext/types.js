// @flow
import type { Organisation } from '@kitman/services/src/services/getOrganisation';

export type OrganisationContextType = {
  organisation: Organisation,
  organisationRequestStatus: 'PENDING' | 'SUCCESS' | 'FAILURE',
  organisationPHIWarning: boolean,
  setOrganisationPHIWarning: Function,
};
