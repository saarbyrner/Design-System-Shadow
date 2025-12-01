// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type {
  UserType,
  Meta,
  RegistrationStatus,
  PlayerType,
  ColumnType,
  AthleteGameStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

import type {
  GridKeys,
  OrgKey,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

import { colors } from '@kitman/common/src/variables';
import {
  type IssueType,
  type DisciplinaryStatus,
  type DisciplinaryIssueMode,
} from '../types/discipline';

export const FALLBACK_DASH = '-';

export const DEFAULT_PAGE_SIZE: number = 30;

export const DEFAULT_META_PARAMS: Meta = {
  current_page: 0,
  next_page: null,
  prev_page: null,
  total_count: 0,
  total_pages: 0,
};

export const TAB_HASHES = {
  clubs: 'clubs',
  players: 'players',
  teams: 'teams',
  staff: 'staff',
  clubDetails: 'club-details',
  details: 'details',
  requirements: 'requirements',
  information: 'information',
  rosterHistory: 'roster-history',
  teamDetails: 'team-details',
  documents: 'documents',
  kits: 'kits',
  homegrown: 'homegrown',
  competitionStats: 'competition-stats',
  currentSuspension: 'current-suspension',
  pastSuspension: 'past-suspension',
};

export const FALLBACK_USER_LOCALE: string = 'en-IE';

export const MUI_DATAGIRD_ROW_HEIGHT = 52;

export const INCOMPLETE = i18n.t('Incomplete');
export const PENDING_ORGANISATION = i18n.t('Pending (Club approval)');
export const PENDING_ASSOCIATION = i18n.t('Pending (League approval)');
export const REJECTED_ORGANISATION = i18n.t('Rejected (Club)');
export const REJECTED_ASSOCIATION = i18n.t('Rejected (League)');
export const PENDING_PAYMENT = i18n.t('Pending (Payment)');
export const APPROVED = i18n.t('Approved');
export const UNAPPROVED = i18n.t('Unapproved');

export const ELIGIBLE: DisciplinaryStatus = 'Eligible';
export const SUSPENDED: DisciplinaryStatus = 'Suspended';
export const BANNED: DisciplinaryStatus = 'Banned';
export const TRANSLATED_DISCIPLINARY_STATUSES = {
  suspended: 'Suspended',
  banned: 'Banned',
  eligible: 'Eligible',
};

export const RED_CARD_OPTIONS = [
  {
    id: 0,
    name: '0',
    value: {
      min: 0,
      max: 0,
    },
  },
  {
    id: 1,
    name: '1',
    value: {
      min: 1,
      max: 1,
    },
  },
  {
    id: 2,
    name: '2',
    value: {
      min: 2,
      max: 2,
    },
  },
  {
    id: 3,
    name: '3',
    value: {
      min: 3,
      max: 3,
    },
  },
  {
    id: 4,
    name: '4',
    value: {
      min: 4,
      max: 4,
    },
  },
  {
    id: 5,
    name: '5+',
    value: {
      min: 5,
      max: null,
    },
  },
];

export const YELLOW_CARD_OPTIONS = [
  {
    id: 0,
    name: '0',
    value: {
      min: 0,
      max: 0,
    },
  },
  {
    id: 5,
    name: '1-5',
    value: {
      min: 1,
      max: 5,
    },
  },
  {
    id: 10,
    name: '6-10',
    value: {
      min: 6,
      max: 10,
    },
  },
  {
    id: 15,
    name: '11-15',
    value: {
      min: 11,
      max: 15,
    },
  },
  {
    id: 20,
    name: '16-20',
    value: {
      min: 16,
      max: 20,
    },
  },
  {
    id: 21,
    name: '21+',
    value: {
      min: 21,
      max: null,
    },
  },
];

export const CARD_RED: IssueType = 'red_card';
export const CARD_YELLOW: IssueType = 'yellow_card';

type StatusMap = {
  [key: RegistrationStatus]: string,
};

type DisciplinaryStatusMap = {
  [key: DisciplinaryStatus]: string,
};

type AthleteGameStatusMap = {
  [key: AthleteGameStatus]: string,
};

export const STATUS_COLOR: StatusMap = {
  incomplete: colors.neutral_200,
  pending_organisation: 'warning',
  pending_association: 'warning',
  rejected_organisation: 'error',
  rejected_association: 'error',
  pending_payment: 'warning',
  approved: 'success',
};

export const DISCIPLINARY_STATUS_VALUE: DisciplinaryStatusMap = {
  Eligible: 'Eligible',
  Suspended: 'Suspended',
  Banned: 'Banned',
};

export const ATHLETE_GAME_STATUS_VALUE: AthleteGameStatusMap = {
  available: 'Available',
  unavailable: 'Unavailable',
  ineligible: 'Ineligible',
  unavailable_ineligible: 'Unavailable & Ineligible',
};

export const DISCIPLINARY_STATUS_COLOR: DisciplinaryStatusMap = {
  [DISCIPLINARY_STATUS_VALUE.Eligible]: 'success',
  [DISCIPLINARY_STATUS_VALUE.Suspended]: 'error',
  [DISCIPLINARY_STATUS_VALUE.Banned]: 'error',
};

export const CREATE_DISCIPLINARY_ISSUE: DisciplinaryIssueMode =
  'CREATE_DISCIPLINARY_ISSUE';
export const UPDATE_DISCIPLINARY_ISSUE: DisciplinaryIssueMode =
  'UPDATE_DISCIPLINARY_ISSUE';
export const DELETE_DISCIPLINARY_ISSUE: DisciplinaryIssueMode =
  'DELETE_DISCIPLINARY_ISSUE';

type DesignationMap = {
  [key: PlayerType]: string,
};

export const DESIGNATION: DesignationMap = {
  primary: 'P',
  future: 'F',
  future_affiliate: 'F',
  guest: 'G',
  late_developer: 'L',
};

// If a valid date format is not provided, moment will complain in the console & terminal, as such:
// Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.
// moment construction falls back to js Date(), which is not reliable across all browsers and versions

// Unfortunately, the BE is inconsistent with date formatting and this is necessary.
export const USER_ENDPOINT_DATE_FORMAT: string = 'YYYY-MM-DD';
export const USER_ENDPOINT_MONTH_DAY_FORMAT: string = 'MMMM D';
export const USER_ENDPOINT_MONTH_DAY_YEAR_FORMAT: string = 'MMMM D, YYYY';
export const ENDPOINT_DATE_FORMAT: string = 'D MMM YYYY';

export const COLUMN_TYPES: { [key: string]: ColumnType } = {
  AVATAR: 'avatar',
  CURRENCY: 'currency',
  STATUS: 'status',
  NODE: 'node',
  TEXT: 'text',
  LINK: 'link',
  ACTION: 'action',
  DISCIPLINE_STATUS: 'discipline_status',
  MENU: 'menu',
  LABELS: 'labels',
  DOCUMENTS: 'documents',
};

export const GRID_TYPES: { [key: string]: GridKeys } = {
  ORGANISATION: 'organisation',
  ASSOCIATION: 'association',
  SQUAD: 'squad',
  ATHLETE: 'athlete',
  STAFF: 'staff',
  ORGANISATION_ATHLETE: 'organisation_athlete',
  ORGANISATION_STAFF: 'organisation_staff',
  REGISTRATION: 'registration',
  ATHLETE_SQUAD: 'athlete_squad',
  ATHLETE_REGISTRATION: 'athlete_registration',
  STAFF_REGISTRATION: 'staff_registration',
  ROSTER_HISTORY: 'roster_history',
  REQUIREMENTS: 'requirements',
  ATHLETE_DISCIPLINE: 'athlete_discipline',
  USER_DISCIPLINE: 'user_discipline',
  HOMEGROWN: 'homegrown',
  SUSPENSION_DETAILS: 'suspension_details',
};

export const REGISTRATION_PERMISSION_GROUP: string = 'registration';
export const ASSOCIATION_ADMIN: UserType = 'association_admin';
export const ORGANISATION_ADMIN: UserType = 'organisation_admin';
export const ATHLETE: UserType = 'athlete';
export const STAFF: UserType = 'staff';

export const USER_TYPES: { [key: string]: UserType } = {
  ASSOCIATION_ADMIN: 'association_admin',
  ORGANISATION_ADMIN: 'organisation_admin',
  ATHLETE: 'athlete',
  STAFF: 'staff',
};

export const DEFAULT_CURRENCY: string = 'USD';

export const REGISTRATIONS_GRID_HASHES = {
  Athlete: GRID_TYPES.ATHLETE_REGISTRATION,
  Staff: GRID_TYPES.STAFF_REGISTRATION,
};

export const WALLET = 'Wallet';
export const CLUB_WALLET = {
  get label() {
    return i18n.t('Club wallet');
  },
};

export const PAYMENT_DETAILS_LABEL = {
  get Season() {
    return i18n.t('Season');
  },
  get Registrations() {
    return i18n.t('Total registrations');
  },
  get 'Amount Paid'() {
    return i18n.t('Amount paid');
  },
  get 'Total Registrations Paid'() {
    return i18n.t('Total registrations paid');
  },
};

export const SAVE_PROGRESS_FEATURE_FLAG = 'league-ops-save-progress';

export const MLS: OrgKey = 'MLS';
export const MLS_NEXT: OrgKey = 'MLS_NEXT';
export const MLS_NEXT_PRO: OrgKey = 'MLS_NEXT_PRO';

export const FF_LEAGUE_OPS_FORMS_QA = 'league-ops-forms-qa';
export const ACCOUNT_ADMIN = 'Account Admin';

export const DISCIPLINE_PERMISSION_GROUP: string = 'discipline';
export const REGISTRATION_HOMEGROWN_GROUP: string = 'homegrown';
