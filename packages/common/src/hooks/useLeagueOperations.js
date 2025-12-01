// @flow
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';

export type LeagueOperations = {
  isRegistrationRequired: boolean,
  isAssociationAdmin: boolean,
  isOfficial: boolean,
  isMatchDirector: boolean,
  isMatchMonitor: boolean,
  isLeague: boolean,
  isLeagueStaffUser: boolean,
  isOrgSupervised: boolean,
  isLoginOrganisation: boolean,
  isScout: boolean,
  activeSquad: Squad | null,
  organisationId?: number,
};

const useLeagueOperations = (): LeagueOperations => {
  const { data: organisation } = useGetOrganisationQuery();
  const isAssociationAdmin = !!organisation?.association_admin;

  const { data: activeSquad } = useGetActiveSquadQuery();

  const { data: currentUser } = useGetCurrentUserQuery();

  const isOfficial = currentUser?.type === 'Official';
  const isMatchDirector = currentUser?.type === 'MatchDirector';
  const isMatchMonitor = currentUser?.type === 'MatchMonitor';
  const isScout = currentUser?.type === 'Scout';
  const isLeague =
    !isOfficial &&
    !isScout &&
    isAssociationAdmin &&
    currentUser?.role === 'Account Admin';
  const isLeagueStaffUser =
    isLeague || isOfficial || isMatchDirector || isMatchMonitor || isScout;

  const isRegistrationRequired = !!currentUser?.registration?.required;
  const isOrgSupervised = !!organisation?.supervised_by;
  const isLoginOrganisation =
    organisation?.organisation_type === 'login_organisation';
  const organisationId = organisation?.id;

  return {
    isLeague,
    isOfficial,
    isMatchMonitor,
    isMatchDirector,
    isLeagueStaffUser,
    isAssociationAdmin,
    isRegistrationRequired,
    isOrgSupervised,
    isLoginOrganisation,
    isScout,
    activeSquad,
    organisationId,
  };
};

export default useLeagueOperations;
