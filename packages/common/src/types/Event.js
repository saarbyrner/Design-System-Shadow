// @flow

import { type ActivityType } from '@kitman/services/src/services/planning';
import { type IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import { type Principle } from '@kitman/common/src/types/Principles';
import {
  type PlayerType,
  type EquipmentName,
} from '@kitman/modules/src/KitMatrix/shared/types';
import {
  type GameStatus,
  type GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import {
  type AttachedTransformedFile,
  type AttachedFile,
  type AttachedEventFile,
} from '@kitman/common/src/utils/fileHelper';
import { type Attachment } from '@kitman/modules/src/Medical/shared/types';
import { type AttachedEventLink } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { type EventLocationFull } from '@kitman/services/src/services/planning/getEventLocations';
import { type StaffUserType } from '@kitman/services/src/services/medical/getStaffUsers';
import { type CustomEventTypeFull } from '@kitman/services/src/services/planning/getCustomEventTypes';
import { type ID as AthleteID } from '@kitman/components/src/Athletes/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type Squad as SquadV2 } from '@kitman/services/src/services/getSquads';
import { type StaffVisibilityEnum } from '@kitman/modules/src/PlanningEventSidePanel/src/components/custom/utils';
import { type ContactResponse } from '@kitman/modules/src/Contacts/shared/types';
import { type RecurrencePreferencesOptions } from '@kitman/services/src/services/planning/getRecurrencePreferences';
import type { NotificationRecipient } from '@kitman/services/src/services/planning/getNotificationsRecipients';

// Since we don’t separate the types of back-end-sent values from the types of
// front-end-local state, field_condition represents both. The back end will
// always send an object and the front end will consume it as is, but will send
// it back as a number.
export type FieldCondition = { id: number, name: string } | number;

export type EventConditions = {|
  surface_type?: { id: number, name: string },
  surface_quality?: { id: number, title: string },
  weather?: { id: number, title: string },
  temperature: string,
  temperature_units: 'F' | 'C',
  humidity?: number,
|};

export type CollectionChannels = {|
  mass_input: boolean,
  rpe_collection_athlete: boolean,
  rpe_collection_kiosk: true,
|};

export const athleteAvailabilities = {
  Absent: 'absent',
  Available: 'available',
  Injured: 'injured',
  Returning: 'returning',
  Unavailable: 'unavailable',
  Ill: 'ill',
};
export type AthleteAvailabilities = $Values<typeof athleteAvailabilities>;

export type Athlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  shortname: string,
  user_id: number,
  avatar_url: string,
  squad_name?: string,
  squad_number?: number,
  designation?: string,
  availability: AthleteAvailabilities,
  position: {
    id: number,
    name: string,
    abbreviation: string,
    position_group?: {
      id: number,
      order: number,
      name: string,
    },
  },
};

export type AthleteWithSqauds = Athlete & { athlete_squads: Squad[] };

export type SubMenuParticipationLevel = {
  label: string,
  value: string,
  parentId: string,
};

export type ParticipationLevel = {
  id: number,
  participation_level_id?: number,
  name: string,
  canonical_participation_level: 'full' | 'none' | 'partial',
  include_in_group_calculations: boolean,
  default: boolean,
};

export type AthleteEvent = {
  id: number,
  athlete: Athlete,
  participation_level: ParticipationLevel,
  include_in_group_calculations: boolean,
  duration: number,
  rpe: ?number,
  rating: ?{
    id: number,
    name: string,
  },
};

// TODO: rename AthleteEventV2 to AthleteEvent after releasing the new
// AthletesTab
export type AthleteEventV2 = {
  id: number,
  athlete: Athlete & { athlete_squads?: Array<Squad> },
  participation_level: ParticipationLevel,
  participation_level_reason: ?{
    id: number,
    name: string,
    label: string,
  },
  include_in_group_calculations: boolean,
  duration: number,
  rpe: ?number,
  related_issue: IssueOccurrenceRequested,
  event_activity_ids?: Array<number>,
};

export type AthleteEventStorage = {
  apiAthleteEvents: Array<AthleteEventV2>,
};

export type EventsUser = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  role?: string,
  discipline_status?: string,
  staff_role?: string,
};

export type CustomEventsUser = {
  id: number,
  user: StaffUserType,
};

export type NotificationSchedule = {
  id: string,
  scheduled_time: string,
};

export type EventActivityAthlete = {
  avatar_url: string,
  id: number,
  name: string,
  participation_level: string,
  availability: AthleteAvailabilities,
  position: {
    id: number,
    name: string,
  },
};

export type KitMatrix = {
  id: number,
  kind: string,
  kit_matrix_id: number,
  kit_matrix: {
    id: number,
    name: string,
    kind: string,
    organisation: {
      id: number,
      name: string,
    },
    primary_color: string,
    secondary_color: string,
    squads: Array<SquadV2>,
    kit_matrix_items: Array<{
      kind: EquipmentName,
      kit_matrix_color_id: number,
      attachment: {
        url: string,
        name: string,
        type: string,
      },
    }>,
  },
};

export type CreateKitMatrixPayload = {
  kind: PlayerType,
  organisation_id?: number,
  active?: boolean, // not supported yet
  squad_ids: Array<number>,
  name: string,
  primary_color: string,
  secondary_color?: string,
  kit_matrix_items: Array<{
    kind: EquipmentName,
    kit_matrix_color_id: number,
    attachment: {
      url: string,
      name: string,
      type: string,
    },
  }>,
  division_id: number,
};

// TODO: rename EventActivityAthleteV2 to EventActivityAthlete after releasing
// the new AthletesTab
export type EventActivityAthleteV2 = {
  avatar_url: string,
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  shortname: string,
  user_id: number,
};

export type DownloadTemplateAthlete = {
  id: number,
  participation_level: string,
  firstname: string,
  position: string,
  lastname: string,
};

export type DrillAttachment = {
  id?: ?number,
  original_filename: string,
  filetype: string,
  filesize: number,
  confirmed?: ?boolean,
  presigned_post?: ?Object,
};

export type DrillLabel = {
  archived: boolean,
  id: number,
  name: string,
  squads: Array<{
    id: number | string,
    name: string,
    owner_id: number,
    created_at: string,
    updated_at: ?string,
  }>,
};

export type EventActivityDrill = {
  name: string,
  sets: ?number,
  reps: ?number,
  rest_duration: ?number,
  pitch_width: ?number,
  pitch_length: ?number,
  notes: string,
  diagram: ?AttachedTransformedFile,
  attachments: Array<DrillAttachment>,
  links: Array<{
    id?: number,
    uri: string,
    title: string,
  }>,
  event_activity_drill_labels: Array<DrillLabel>,
};

export const intensities = {
  Light: 'low',
  Moderate: 'medium',
  High: 'high',
};
export type Intensities = $Values<typeof intensities>;

export type EventActivityDrillLink = {
  id?: number,
  uri: string,
  title: string,
};

export type EventActivityDrillLinkV2 = {
  id?: number,
  isIdLocal?: boolean,
  uri: string,
  title: string,
};

export type EventActivityDrillV2 = {
  id: number,
  // `event_activity_drill_library_id` is used instead of `id` for managing
  // favoriting.
  event_activity_drill_library_id?: number,
  name: string,
  notes: ?string,
  diagram: ?$Shape<AttachedFile & (AttachedTransformedFile & { url: string })>,
  links: Array<EventActivityDrillLinkV2>,
  event_activity_drill_labels: Array<DrillLabel>,
  event_activity_type?: ?ActivityType,
  event_activity_type_id: string | number,
  principle_ids: Array<string | number>,
  principles?: ?Array<Principle>,
  created_by?: EventsUser,
  attachments?: ?Array<?$Shape<
    DrillAttachment & AttachedFile & (AttachedTransformedFile & { url: string })
  >>,
  intensity: Intensities | null,
  library?: ?boolean,
  archived?: ?boolean,
  // `isFavorite` is a local property, it doesn’t exist in the database.
  isFavorite?: boolean,
  squads?: Array<SquadV2>,
  squad_ids?: Array<number>,
};

export type EventActivity = {
  athletes: Array<EventActivityAthlete>,
  duration: ?number,
  id: number,
  principles: Array<Principle>,
  event_activity_drill: ?EventActivityDrill,
  users: Array<any>,
  event_activity_type: ?{ id: number, name: string },
};

export const areaSize: { [string]: string } = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
  Xlarge: 'xlarge',
};
export type AreaSize = $Values<typeof areaSize>;

export const sportType: { [string]: string } = {
  Soccer: 'soccer',
  GAA: 'gaa',
  RugbyUnion: 'rugby_union',
  RugbyLeague: 'rugby_league',
};
export type SportType = $Values<typeof sportType>;

export const sessionThemeOptionTypes = {
  PrincipleType: 'PrincipleType',
  PrincipleCategory: 'PrincipleCategory',
  PhaseOfPlay: 'Phase',
};
export type SessionThemeOptionTypes = $Values<typeof sessionThemeOptionTypes>;

export type ParticipantsCounts = {|
  available?: number,
  total?: number,
|};
// TODO: rename EventActivityV2 to EventActivity after releasing the new
// AthletesTab
export type EventActivityV2 = {
  athletes: Array<EventActivityAthleteV2>,
  duration?: ?number,
  id: number,
  principles: Array<Principle>,
  principle_ids?: ?Array<number>,
  event_activity_drill?: ?EventActivityDrillV2,
  users: Array<StaffUserType>,
  event_activity_type: ActivityType,
  event_activity_ids: Array<number>,
  order?: ?number,
  order_label?: ?string,
  note?: ?string,
  area_size?: ?AreaSize,
  participants?: {|
    athletes?: ParticipantsCounts,
    staff?: ParticipantsCounts,
  |},
};

export type DownloadTemplateEventActivity = {
  id: number,
  activityname: ?string,
  drillname: ?string,
  duration: ?number,
  principles: Array<Principle>,
  notes: ?string,
  participants: Array<DownloadTemplateAthlete>,
  attachment: ?AttachedTransformedFile,
  event_activity_drill_labels: ?Array<DrillLabel>,
};

export type EventLinkDetail = {
  id: number,
  created_at?: string,
  created_by?: {
    id?: number,
    firstname?: string,
    lastname?: string,
    fullname?: string,
  },
  description?: string,
  title?: string,
  updated_at?: string,
  uri?: string,
  uri_type?: string,
};

export type EventCategory = {
  id: number,
  name: string,
};

export type EventAttachment = {
  attachment: Attachment,
  event_attachment_categories: EventCategory[],
  created_at: string,
  updated_at: string,
  id: number,
};

export type EventLink = {
  attached_link: EventLinkDetail,
  event_attachment_categories: EventCategory[],
  created_at: string,
  updated_at: string,
  id: number,
};

export type EventUser = {
  id: number,
  user: {
    email: string,
    firstname: string,
    lastname: string,
    fullname: string,
    avatar_url: ?string,
    role: ?string,
    id: number,
  },
};

export type OpponentTeam = {
  id: number,
  name: string,
  logo_full_path?: string,
  custom?: boolean,
  owner_id: number,
};

export type OpponentSquad = {
  id: number,
  name: string,
  owner_id: number,
  owner_name: string,
  logo_full_path?: string,
};

export type EventAthlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  shortname: string,
  user_id: number,
  avatar_url: string,
  date_of_birth: ?string,
  squad_number: ?number,
  position: {
    id: number,
    abbreviation: string,
    name: string,
  },
  designation: string,
  graduation_date?: string,
  squad_name?: string,
};

export type EventAssociatedIssue = {
  athlete_fullname: string,
  occurrence_date: string,
  full_pathology: string,
  issue_occurrence_title: ?string,
  athlete_id: number,
  id: number,
  issue_type: string,
};

type AccessStatus = {
  total?: number,
  pending?: number,
  approved?: number,
  denied?: number,
  expired?: number,
  withdrawn?: number,
};
export type EventCommonAttributes = {|
  id: number,
  name?: ?string,
  description?: ?string,
  background_color?: string,
  duration: ?number,
  game_event_id?: number,
  time?: string,
  local_timezone: string,
  start_date: string,
  end_date: string,
  game_time?: string,
  round_number?: number,
  notification_schedule: NotificationSchedule,
  editable: boolean,
  duplicated_event_id?: boolean,
  athlete_events_count?: number,
  are_participants_duplicated: boolean,
  duplicate_event_activities: boolean,
  no_participants?: boolean,
  event_collection_complete?: boolean,
  nfl_surface_composition_id?: number,
  nfl_surface_composition?: { id: number, name: string },
  nfl_field_type?: { id: number, name: string },
  nfl_location_feed: ?Object,
  nfl_location_feed_id: ?number,
  ...CollectionChannels,
  ...EventConditions,
  unUploadedFiles?: Array<AttachedEventFile>,
  unUploadedLinks?: Array<AttachedEventLink>,
  attachments?: Array<EventAttachment>,
  attached_links?: Array<EventLink>,
  event_location?: EventLocationFull,
  event_users: Array<CustomEventsUser & { event_activity_ids?: Array<number> }>,
  user_ids?: Array<number>,
  athlete_ids?: Array<number | string>,
  squad: {
    name: string,
    id: number,
    logo_full_path?: string,
    owner_id?: number,
    owner_name?: string,
  },
  field_condition?: ?FieldCondition,
  opponent_team?: ?OpponentTeam,
  opponent_squad?: ?OpponentSquad,
  theme_type?: ?SessionThemeOptionTypes,
  theme_id?: ?number,
  theme?: ?{
    id: number,
    name: string,
  },
  kit_matrix?: Array<KitMatrix>,
  venue_type?: { id: number, name: string },
  has_associated_issues?: boolean,
  associated_injury_occurrences?: Array<EventAssociatedIssue>,
  associated_illness_occurrences?: Array<EventAssociatedIssue>,
  skip_automatic_game_team_email: ?boolean,
  association_contact?: NotificationRecipient,
  visible?: boolean,
  shared?: boolean,
|};

export type EventRecurrenceBasic = $Exact<{
  recurring_event_id: number | null,
  original_start_time: string | null,
}>;

export type TrainingSession = {
  ...EventCommonAttributes,
  type: 'session_event',
  session_type: {
    id: number,
    name: string,
    is_joint_practice?: boolean,
    isJointSessionType: boolean,
    sessionTypeCategoryName?: string,
  },
  game_day_plus: string,
  game_day_minus: string,
  workload_type: number,
  workload_units?: ?Object,
  nfl_surface_type_id: ?number,
  nfl_location_id: ?number,
  nfl_equipment_id: ?number,
  field_condition: FieldCondition,
  season_type: {
    id: number,
    name: string,
    is_archived: boolean,
  },
  opponent_team?: {
    id: number,
    name: string,
  },
  opponent_squad?: {
    id: number,
    name: string,
    owner_name?: string,
    owner_id?: number,
    logo_full_path?: string,
  },
  mls_game_key: ?string,
  recurrence?: {
    ...EventRecurrenceBasic,
    rule: string | null,
    rrule_instances: Array<string> | null,
    preferences: RecurrencePreferencesOptions,
  },
};

export type Competition = {
  competition_categories: [],
  id: number,
  name: string,
  maximum_players?: number,
  athlete_selection_locked?: boolean,
  athlete_selection_deadline?: string,
  max_staffs: ?number,
  min_staffs: ?number,
  max_substitutes: ?number,
  min_substitutes: ?number,
  required_designation_roles?: Array<string>,
  show_captain?: boolean,
};

export type MatchMonitor = {
  id: number,
  match_monitor_id: number,
  match_monitor: {
    id: number,
    fullname: string,
  },
};

// TODO: Merge Squad, SquadV2, and GameSquad into a single type to avoid redundancy and inconsistencies.
export type GameSquad = {
  id: number,
  name: string,
  owner_id?: number,
  owner_name: string,
  logo_full_path?: string,
  division?: {
    id: number,
    name: string,
  }[],
};

export type Game = {
  ...EventCommonAttributes,
  type: 'game_event',
  organisation_team: { id: number, name: string, logo_full_path?: string },
  opponent_team: OpponentTeam | null,
  opponent_squad: OpponentSquad | null,
  squad: {
    id: number,
    name: string,
    owner_id?: number,
    owner_name: string,
    logo_full_path?: string,
    division?: {
      id: number,
      name: string,
    }[],
  },
  venue_type: {
    id: number,
    name: string,
  },
  competition_category: {
    id: number,
    name: string,
  },
  score: number,
  opponent_score: number,
  number_of_periods: ?number,
  workload_units?: ?Object,
  nfl_surface_type_id: ?number,
  nfl_location_id: ?number,
  nfl_equipment_id: ?number,
  field_condition: FieldCondition,
  session_type: {
    id: number,
    name: string,
  },
  organisation_fixture_rating: { id: number, name: string },
  organisation_fixture_rating_id?: number,
  organisation_format_id?: number,
  organisation_format?: {
    id: number,
    name: string,
  },
  fas_game_key?: string,
  competition: Competition,
  competition_categories?: {
    id: number,
    name: string,
  },
  competition_category_id?: number,
  match_report_submitted_by_id?: number,
  roster_submitted_by_id?: number,
  disciplinary_issue?: boolean,
  home_athletes: Array<EventAthlete>,
  away_athletes: Array<EventAthlete>,
  game_status?: GameStatus,
  mls_game_key?: string,
  game_status?: string,
  event_users: Array<EventUser>,
  home_event_users: Array<EventUser>,
  away_event_users: Array<EventUser>,
  home_event_id?: number,
  away_event_id?: number,
  turnaround_fixture?: boolean,
  turnaround_prefix?: string,
  custom_periods: Array<GamePeriod>,
  custom_opposition_name?: string,
  custom_period_duration_enabled: boolean,
  user_event_requests_counts?: AccessStatus,
  game_participants_lock_time?: string,
  game_participants_unlocked?: boolean,
  dmr?: Array<string>,
  home_dmr?: Array<string>,
  away_dmr?: Array<string>,
  game_time?: string,
  dmn_notification_status?: boolean,
  dmr_notification_status?: boolean,
  tv_channels?: Array<{
    id: number,
    name: string,
  }> | null,
  tv_game_contacts?: Array<ContactResponse> | null,
  league_setup: boolean,
  match_monitors: Array<MatchMonitor>,
  match_director: {
    id: number,
    firstname: string,
    lastname: string | null,
    fullname: string,
    username: string | null,
    date_of_birth: Date,
    role: string | null,
    division: string | null,
    email: string,
    mobile_number: string | null,
    created_at: Date,
    locale: string | null,
    is_active: boolean,
  } | null,
  game_monitor_report_submitted?: boolean,
  access_request_accessible?: boolean,
  access_request_time_valid?: boolean,
  association_contact?: NotificationRecipient,
  scout_attendees?: Array<{
    id: number,
    firstname: string,
    lastname: string | null,
  }>,
};

export type CustomEvent = {
  ...EventCommonAttributes,
  type: 'custom_event',
  athlete_ids: AthleteID[],
  user_ids: number[],
  custom_event_type: CustomEventTypeFull,
  athlete_events: { id: number, athlete: AthleteWithSqauds }[],
  recurrence?: {
    ...EventRecurrenceBasic,
    rule: string | null,
    rrule_instances: Array<string> | null,
  },
  visibility_ids: Array<number>,
  staff_visibility: ?StaffVisibilityEnum,
  mls_game_key: ?string,
  skip_automatic_game_team_email?: boolean,
};

export type TSOEvent = {
  Id: number,
  KitmanTeamId: number,
  StartDate: string,
  EndDate: string,
  Name: string,
  Description: string,
  Team: {
    Id: number,
    Name: string,
    Order: number,
    ClubId: number,
    Club?: string,
    OptaTeamId?: number,
    IsFirstTeam: boolean,
    TeamType: number,
    IsHiddenFromClub: boolean,
  },
  IsShared: boolean,
};

export type Event = TrainingSession | Game | CustomEvent;
export type EventType =
  | 'game'
  | 'training'
  | 'other'
  | 'nonfootball'
  | 'prior'
  | 'nonsport';
