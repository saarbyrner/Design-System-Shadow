// @flow
import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import type {
  MatchMonitorReportUnregisteredAthlete,
  MatchMonitorReportAthlete,
  MatchMonitorReport,
  UnregisteredPlayer,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';

export const getIsExistingUserPanelOpen = (state: Store): boolean =>
  state[REDUCER_KEY]?.existingUserPanel?.isOpen || false;

export const getIsNewUserFormPanelOpen = (state: Store): boolean =>
  state[REDUCER_KEY]?.newUserFormPanel?.isOpen || false;

export const getIsRegisteredPlayerImageModalOpen = (state: Store): boolean =>
  state[REDUCER_KEY]?.registeredPlayerImageModal?.isOpen || false;

export const getUnregisteredPlayer = (state: Store): ?UnregisteredPlayer =>
  state[REDUCER_KEY]?.unregisteredPlayer || null;

export const getMatchMonitorReport = (state: Store): MatchMonitorReport =>
  state[REDUCER_KEY]?.matchMonitorReport || null;

export const getUnregisteredPlayers = (
  state: Store
): Array<MatchMonitorReportUnregisteredAthlete> =>
  state[REDUCER_KEY]?.matchMonitorReport
    .game_monitor_report_unregistered_athletes || [];

export const getRegisteredPlayers = (
  state: Store
): Array<MatchMonitorReportAthlete> =>
  state[REDUCER_KEY]?.matchMonitorReport.game_monitor_report_athletes || [];
