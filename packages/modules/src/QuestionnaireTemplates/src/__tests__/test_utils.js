// @flow
import type { Template } from '../../types/__common';
/* eslint-disable camelcase */

export const buildTemplate = ({
  id = 666,
  name = Math.random().toString(36).substring(7),
  active = false,
  platforms = ['MSK', 'Capture'],
  last_edited_at = '2017-08-16T11:10:08+01:00',
  last_edited_by = 'Jon Jones',
  scheduled_time = '',
  scheduled_days = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  },
  local_timezone = 'Europe/Dublin',
  mass_input = false,
  show_warning_message = false,
  active_athlete_count = 0,
}: {
  id?: any,
  name?: string,
  active?: boolean,
  platforms?: Array<string>,
  last_edited_at?: string,
  last_edited_by?: string,
  scheduled_time?: string,
  local_timezone?: string,
  scheduled_days?: { [string]: boolean },
  mass_input: boolean,
  show_warning_message: boolean,
  active_athlete_count: number,
}): Template => ({
  id,
  name,
  active,
  platforms,
  last_edited_at,
  last_edited_by,
  mass_input,
  scheduled_time,
  local_timezone,
  scheduled_days,
  show_warning_message,
  active_athlete_count,
});

export const buildTemplates = (number: number) => {
  const templates = {};

  for (let i = 0; i < number; i++) {
    const templateId = Math.floor(Math.random() * 100 + 1).toString();
    const iPlusOne = i + 1;
    templates[`${iPlusOne}${templateId}`] = buildTemplate({
      id: templateId,
      mass_input: false,
      show_warning_message: false,
      active: iPlusOne % 2 === 0,
      name: `Template ${iPlusOne.toString()}`,
      last_edited_at: new Date(`2021-1-${iPlusOne.toString()}`).toString(),
      last_edited_by: `User ${iPlusOne.toString()}`,
      active_athlete_count: iPlusOne,
    });
  }
  return templates;
};
