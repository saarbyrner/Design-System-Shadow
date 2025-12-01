// @flow
import $ from 'jquery';

/*
  Gets the active permissions for the user, filters out:

  * Permissions for modules the organisation doesn't have access to
  * Permissions the organisation doesn't have

  Output is a hash where the key is the module and the value is a list of
  permissions in that Module. e.g.

  {
    "athlete-screening" => ["questionnaires-admin", "questionnaires-roll", "questionnaire-comments"],
    "messaging"         => ["to-athletes"]
  }

  The API returns modules keys only for modules where the user has at least 1 permission
*/

export type Permissions = $Exact<{
  alerts?: Array<string>,
  analysis?: Array<string>,
  assessments?: Array<string>,
  'athlete-app'?: Array<string>,
  'athlete-screening'?: Array<string>,
  coach?: Array<string>,
  general?: Array<string>,
  homepage?: Array<string>,
  kiosk?: Array<string>,
  medical?: Array<string>,
  user?: Array<string>,
  concussion?: Array<string>,
  messaging?: Array<string>,
  rehab?: Array<string>,
  notes?: Array<string>,
  documents?: Array<string>,
  'risk-advisor'?: Array<string>,
  settings?: Array<string>,
  workloads?: Array<string>,
  registration?: Array<string>,
  'tso-video'?: Array<string>,
  'tso-document'?: Array<string>,
  'tso-event'?: Array<string>,
  'tso-fixture'?: Array<string>,
  'tso-jtc-fixture'?: Array<string>,
  'tso-reviews'?: Array<string>,
  'tso-recruitment'?: Array<string>,
  'tso-private-forms'?: Array<string>,
  'human-input'?: Array<string>,
  'user-accounts'?: Array<string>,
  'development-goals'?: Array<string>,
  'calendar-settings'?: Array<string>,
  'injury-surveillance'?: Array<string>,
  'user-movement'?: Array<string>,
  'event-location-settings'?: Array<string>,
  efile: Array<string>,
  eforms: Array<string>,
  scout: Array<string>,
  'scout-access-management':  Array<string>,
  discipline: Array<string>,
  'league-game': Array<string>,
  notifications?: Array<string>,
  'logic-builder'?: Array<string>,
  homegrown?: Array<string>,
  'match-monitor'?: Array<string>,
  'guardian-access'?: Array<string>,
}>;

const getPermissions = (): Promise<Permissions> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/permissions',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getPermissions;
