// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Event } from '@kitman/common/src/types/Event';

type PatchEvent = {
  id?: number,
  score?: number | null,
  opponent_score?: number | null,
  skip_automatic_game_team_email?: boolean,
  current_calendar_month?: string,
};

type UrlParams = {
  includeDmrLockedTime: boolean,
};

const saveEvent = async ({
  event,
  urlFilterParams,
  skipCreatePeriod,
}: {
  event: PatchEvent,
  urlFilterParams?: UrlParams,
  skipCreatePeriod?: boolean,
}): Promise<Event> => {
  const patchEvent = event.id !== undefined && event.id !== -1;
  const skipCreatePeriodString = skipCreatePeriod ? '?no_period=1' : '';
  const requestUrl =
    event.id !== undefined && patchEvent
      ? `/planning_hub/events/${event.id}`
      : `/planning_hub/events${skipCreatePeriodString}`;

  let urlParams = {};

  if (urlFilterParams?.includeDmrLockedTime) {
    urlParams = {
      ...urlParams,
      include_game_participants_lock_time: true,
    };
  }

  const { data } = patchEvent
    ? await axios.patch(requestUrl, event, { params: urlParams })
    : await axios.post(requestUrl, event, { params: urlParams });

  return data.event;
};

export default saveEvent;
