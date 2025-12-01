// @flow
import type { RequestStatus } from '@kitman/common/src/types';
import type { OrganisationVariations } from '../types';

export type RehabContextType = {
  organisationVariations: OrganisationVariations,
  organisationVariationsRequestStatus: RequestStatus,
};
