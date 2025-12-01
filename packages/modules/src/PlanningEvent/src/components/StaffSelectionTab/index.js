// @flow
import {
  type EventActivityV2,
  type Event,
  type EventsUser,
} from '@kitman/common/src/types/Event';
import { type RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { type SetState } from '@kitman/common/src/types/react';

import { StaffSelectionGameTranslated as StaffSelectionGame } from './StaffSelectionGame';
import { StaffSelectionSessionTranslated as StaffSelectionSession } from './StaffSelectionSession';

type Props = {
  requestStatus: RequestStatus,
  eventSessionActivities: Array<EventActivityV2>,
  event: Event,
  leagueEvent: Event,
  onUpdateLeagueEvent: SetState<Event>,
  onUpdateEvent: Function,
};

export type RowActivities = Array<{
  id: number,
  value: boolean,
}>;

export type Row = {
  ...EventsUser,
  activities?: RowActivities,
  order: number,
};

const StaffSelectionTab = (props: Props) => {
  switch (props.event.type) {
    case eventTypePermaIds.game.type:
      return <StaffSelectionGame {...props} />;
    case eventTypePermaIds.session.type:
      return <StaffSelectionSession {...props} />;
    default:
      return null;
  }
};

export default StaffSelectionTab;
