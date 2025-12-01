// @flow
import { useMemo } from 'react';
import moment from 'moment-timezone';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Game } from '@kitman/common/src/types/Event';
import { Separator } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/CommonFields';

import { EventDateTimeV2Translated as EventDateTimeV2 } from './EventDateTimeV2';
import { extractDataBasedOnGameKey } from './utils';
import style from './style';
import { LocationSelectTranslated as LocationSelection } from '../common/LocationSelect/LocationSelect';
import Attendance from '../common/Attendance/Attendance';
import type {
  EditEventPanelMode,
  CommonAttributesValidity,
  EventSessionFormData,
  EventFormData,
  EventGameFormData,
  OnUpdateEventStartTime,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventDetails,
} from '../../types';

type EventGameData = Game &
  EventGameFormData &
  EventFormData &
  EventSessionFormData;

type Props = {
  event: EventGameData,
  panelMode: EditEventPanelMode,
  eventValidity: CommonAttributesValidity,
  onUpdateEventStartTime: OnUpdateEventStartTime,
  onUpdateEventDate: OnUpdateEventDate,
  onUpdateEventTimezone: OnUpdateEventTimezone,
  onUpdateEventDetails: OnUpdateEventDetails,
  // eslint-disable-next-line react/no-unused-prop-types
  onUpdateEventManualLocation: Function,
};

export const getEventDateMoment = (event: EventGameData): moment => {
  const startTime = event?.fas_game_key ? event?.start_date : event.start_time;
  return moment.tz(startTime, event.local_timezone);
};

const CommonFieldsV2 = (props: Props) => {
  const extractDataBasedOnGameKeyTypes = extractDataBasedOnGameKey(props.event);
  const getStartTime = extractDataBasedOnGameKeyTypes?.hasGameKey
    ? props.event.start_date
    : props.event.start_time;
  const dateMoment: moment = useMemo(
    () => getEventDateMoment(props.event),
    [getStartTime, props.event.local_timezone]
  );

  return (
    <>
      <div css={style.singleColumnGrid}>
        <EventDateTimeV2
          eventValidity={props.eventValidity}
          eventDate={dateMoment}
          timeZone={props.event.local_timezone}
          onSelectDate={(date) => {
            props.onUpdateEventDate(
              moment(date).format(DateFormatter.dateTransferFormat)
            );
          }}
          onUpdateStartTime={(value) => {
            props.onUpdateEventStartTime(
              value.format(DateFormatter.dateTransferFormat)
            );
          }}
          onSelectTimezone={(value) => {
            props.onUpdateEventTimezone(value);
          }}
          data-testid="CommonFields|EventDateTime"
          disableDateTimeEdit={
            extractDataBasedOnGameKeyTypes?.hasGameKey ||
            (props.panelMode === 'EDIT' && !props.event.editable)
          }
        />
      </div>

      {window.featureFlags['event-locations'] && (
        <div css={style.singleColumnGrid}>
          <LocationSelection
            event={props.event}
            onUpdateEventDetails={props.onUpdateEventDetails}
            eventValidity={props.eventValidity}
            isDisabled={extractDataBasedOnGameKeyTypes?.hasGameKey}
          />
        </div>
      )}

      <div css={style.fullWidthRow}>
        <Separator
          shouldRender={window.getFlag(
            'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
          )}
        />
        <Attendance
          onUpdateEventDetails={props.onUpdateEventDetails}
          event={props.event}
          eventValidity={props.eventValidity}
        />
      </div>
    </>
  );
};

export default CommonFieldsV2;
