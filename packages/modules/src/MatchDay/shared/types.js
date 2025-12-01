// @flow
import type { Kit } from '@kitman/modules/src/KitMatrix/shared/types';
import type { Game } from '@kitman/common/src/types/Event';
import moment from 'moment-timezone';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SetState } from '@kitman/common/src/types/react';
import type { TransformedContactRole } from '@kitman/modules/src/Contacts/shared/types';
import type { EventGameContact } from '@kitman/services/src/services/contacts/getEventGameContacts';

export type TextEnum = {
  equipmentAlt: string,
  teamFlagAlt: string,
  officialsSavedSuccess: string,
  officialsSavedError: string,
  informationSavedSuccess: string,
  informationSavedError: string,
  assignKitSuccess: string,
  assignKitError: string,
  duplicateOfficialsErrorText: string,
  createLeagueFixtureSuccess: string,
  createLeagueFixtureError: string,
  gamedayRolesSavedSuccess: string,
  gamedayRolesSavedError: string,
  updateLeagueFixtureSuccess: string,
  updateLeagueFixtureError: string,
  canNotBeBeforeStartTime: string,
};

export type Official = {
  id: number,
  fullname: string,
};

export type OfficialRole =
  | 'referee'
  | 'assistant_referee_1'
  | 'assistant_referee_2'
  | 'fourth_referee'
  | 'reserve_ar'
  | 'var'
  | 'avar'
  | 'reserve_ar';

export type GameOfficial = {
  id: number,
  role?: OfficialRole,
  official_id: number,
  official: Official,
};

export type OfficialsByRole = {
  [role: string]: GameOfficial,
};

export type GetKitsByRoleArgs = {
  event: Game | null,
  kits: Array<Kit>,
};

export type MatchOfficialsForm = {
  referee: number | null,
  assistant_referee_1: number | null,
  assistant_referee_2: number | null,
  fourth_referee: number | null,
  reserve_ar: number | null,
  var: number | null,
  avar: number | null,
};

export type MatchInformationForm = {
  matchNumber: number | string | null,
  date: moment.Moment | null,
  time: moment.Moment | null,
  kickTime: moment.Moment | null,
  locationId: number | null,
  tvChannelIds: Array<number> | null,
  tvContactIds: Array<number> | null,
};
export type DefaultFormFields = {
  competition: number | null,
  round: number | null,
  kickTime: moment.Moment | null,
  homeTeam: number | null,
  awayTeam: number | null,
  homeSquad: number | null,
  awaySquad: number | null,
  timezone: string | null,
  location: number | null,
};
export type FixtureForm = {
  ...DefaultFormFields,
  matchId?: string | null,
  date?: moment.Moment | null,
  tvChannelIds?: Array<number> | null,
  tvContactIds?: Array<number> | null,
  referee?: number | null,
  assistant_referee_1?: number | null,
  assistant_referee_2?: number | null,
  fourth_referee?: number | null,
  reserve_ar?: number | null,
  var?: number | null,
  avar?: number | null,
  matchDirectorId?: number | null,
  notificationsRecipient?: number | null,
  visible?: boolean | null,
};

export type Option = {
  label: string,
  value: number,
};

export type Role = {
  id: number,
  role: string,
  required: boolean,
  kind: string,
  order: number,
  eventGameContactId?: number | null,
  name?: string,
  phone?: string,
  email?: string,
};

export type ReorderArrayArgs = {
  order: Array<number>,
  orderedRoles: Array<TransformedContactRole>,
  oldIndex: number,
  targetIndex: number,
};

export type Contact = {
  value: number,
  label: string,
  email: string,
  phone: string,
};

export type GameDayRolesForm = {
  [key: number]: Contact,
};

export type UseGamedayRolesArgs = I18nProps<{
  eventId: number,
  contactRoles: Array<TransformedContactRole>,
  eventGameContacts: Array<EventGameContact>,
  fetchEventGameContacts: () => Promise<void>,
}>;

export type UseGamedayRolesReturn = {
  readOnlyRoles: Array<TransformedContactRole>,
  editOnlyRoles: Array<TransformedContactRole>,
  optionalRoles: Array<TransformedContactRole>,
  form: GameDayRolesForm,
  setForm: SetState<GameDayRolesForm>,
  order: Array<number>,
  setOrder: SetState<Array<number>>,
  isEditOpen: boolean,
  anchorEl: HTMLElement | null,
  isSubmitting: boolean,
  eventGameContacts: Array<EventGameContact>,
  onRemoveOptionalRole: (roleId: number) => void,
  onAddOptionalRole: (role: TransformedContactRole) => void,
  onResetForm: () => void,
  onOpenOptionalRoles: (e: SyntheticMouseEvent<HTMLButtonElement>) => void,
  onCloseOptionalRoles: () => void,
  onOpenEditForm: () => void,
  onSubmitForm: () => Promise<void>,
};
