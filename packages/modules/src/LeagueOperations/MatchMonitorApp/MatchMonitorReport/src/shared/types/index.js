// @flow
import type { Athlete } from '@kitman/common/src/types/Event';

type RegistrationStatus = 'registered' | 'trialist';

export type VenueType = 'home' | 'away';

export type UnregisteredPlayer = {
  firstname: string,
  lastname: string,
  date_of_birth: string | null,
  registration_status: RegistrationStatus | null,
  notes: string,
  venue_type: VenueType,
};
export type MatchMonitorReportAthlete = {
  id: number,
  athlete_id: number,
  athlete: Athlete,
  venue_type: VenueType,
  compliant: boolean,
};

export type MatchMonitorReportUnregisteredAthlete = {
  id?: number,
  venue_type: VenueType,
  firstname: string,
  lastname: string,
  date_of_birth: string,
  registration_status: RegistrationStatus,
  notes: string,
};

export type MatchMonitorReport = {
  game_monitor_report_athletes?: Array<MatchMonitorReportAthlete>,
  game_monitor_report_unregistered_athletes?: Array<MatchMonitorReportUnregisteredAthlete>,
  notes?: string,
  monitor_issue?: boolean,
  submitted_by_id?: ?number,
  updated_at?: ?string,
};

export type MatchMonitorSlice = {
  existingUserPanel: {
    isOpen: boolean,
  },
  newUserFormPanel: {
    isOpen: boolean,
  },
  unregisteredPlayer: UnregisteredPlayer,
  matchMonitorReport: MatchMonitorReport,
};

export type OnUpdateAction = {
  payload: $Shape<MatchMonitorSlice>,
};

export type MatchInformation = {
  date: ?string,
  home: {
    name: string,
    squad: string,
  },
  away: {
    name: string,
    squad: string,
  },
};

export type RegisteredPlayerImageModalData = {
  playerName: string,
  playerImage: string,
};
