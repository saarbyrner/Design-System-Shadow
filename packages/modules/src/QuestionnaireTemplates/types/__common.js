// @flow
export type Template = {
  id: number | string,
  name: string,
  last_edited_at: string,
  last_edited_by: string,
  active: boolean,
  platforms: Array<string>,
  mass_input: boolean,
  show_warning_message: boolean,
  scheduled_time: string,
  local_timezone: string,
  scheduled_days: { [string]: boolean },
  active_athlete_count: number,
};

export type Templates = Array<Template>;
