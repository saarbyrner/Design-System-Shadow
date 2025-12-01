// @flow
import type { LeagueGamePermissions } from './types';

export const defaultLeagueGamePermissions: LeagueGamePermissions = {
  viewKits: false,
  manageKits: false,
  viewContacts: false,
  manageContacts: false,
  viewGameSchedule: false,
  viewGameInformation: false,
  viewGameTeam: false,
  manageGameInformation: false,
  manageGameTeam: false,
  viewMatchReport: false,
  manageMatchReport: false,
  viewMatchMonitorReport: false,
  manageMatchMonitorReport: false,
};

export const setLeagueGamePermissions = (
  leagueGamePermissions: ?Array<string>
): LeagueGamePermissions => {
  return {
    viewKits: leagueGamePermissions?.includes('view-kits') || false,
    manageKits: leagueGamePermissions?.includes('manage-kits') || false,
    viewContacts: leagueGamePermissions?.includes('view-contacts') || false,
    manageContacts: leagueGamePermissions?.includes('manage-contacts') || false,
    viewGameSchedule:
      leagueGamePermissions?.includes('view-game-schedule') || false,
    viewGameInformation:
      leagueGamePermissions?.includes('view-game-information') || false,
    viewGameTeam: leagueGamePermissions?.includes('view-game-team') || false,
    manageGameInformation:
      leagueGamePermissions?.includes('manage-game-information') || false,
    manageGameTeam:
      leagueGamePermissions?.includes('manage-game-team') || false,
    viewMatchReport:
      leagueGamePermissions?.includes('view-match-report') || false,
    manageMatchReport:
      leagueGamePermissions?.includes('manage-match-report') || false,
    viewMatchMonitorReport:
      leagueGamePermissions?.includes('view-match-monitor-report') || false,
    manageMatchMonitorReport:
      leagueGamePermissions?.includes('manage-match-monitor-report') || false,
  };
};
