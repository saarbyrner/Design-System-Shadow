// @flow
import { Checkbox } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SetState } from '@kitman/common/src/types/react';
import type { AdditionalMixpanelSessionData } from '@kitman/common/src/utils/TrackingData/src/types/calendar';
import style from '../style';
import { SessionLayoutTranslated as SessionLayout } from './session/SessionLayout';
import { GameLayoutTranslated as GameLayout } from './game/GameLayout';
import { GameLayoutV2Translated as GameLayoutV2 } from './gameLayoutV2/GameLayoutV2';
import { CustomEventLayoutTranslated as CustomEventLayout } from './custom/CustomEventLayout';
import { EventAttachmentsTranslated as EventAttachments } from './EventAttachments';
import { EventNotificationsTranslated as EventNotifications } from './EventNotifications';
import type {
  EventFormValidity,
  EditEventPanelMode,
  CustomEventFormValidity,
  EventFormData,
  OnUpdateEventStartTime,
  OnUpdateEventDuration,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventTitle,
  OnUpdateEventNotificationChannels,
  OnUpdateEventDetails,
} from '../types';

export type Props = $Exact<{
  event: EventFormData,
  panelMode: EditEventPanelMode,
  eventValidity?: EventFormValidity | CustomEventFormValidity,
  canManageWorkload: boolean,
  onUpdateEventStartTime: OnUpdateEventStartTime,
  onUpdateEventDuration: OnUpdateEventDuration,
  onUpdateEventDate: OnUpdateEventDate,
  onUpdateEventTimezone: OnUpdateEventTimezone,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateNotificationChannels: OnUpdateEventNotificationChannels,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
  isOpen: boolean,
  isAttachmentsDisabled?: boolean,
  setAdditionalMixpanelSessionData: SetState<AdditionalMixpanelSessionData>,
}>;

export type TranslatedProps = I18nProps<Props>;

const EditEventPanelLayout = ({
  panelMode,
  event,
  eventValidity,
  canManageWorkload,
  onUpdateEventDetails,
  onUpdateNotificationChannels,
  isOpen,
  isAttachmentsDisabled,
  setAdditionalMixpanelSessionData,
  t,
  ...restEventProps
}: TranslatedProps) => {
  const isGameDetailsFeatureFlag = window.featureFlags['game-details'];

  const isPanelModeEdit = panelMode === 'EDIT';

  const gameEventValidity =
    eventValidity?.type === 'game_event'
      ? eventValidity
      : { type: 'game_event' };

  const determineLayout = () => {
    switch (event.type) {
      case 'session_event': {
        return (
          <SessionLayout
            event={event}
            panelMode={panelMode}
            eventValidity={
              eventValidity?.type === 'session_event'
                ? eventValidity
                : { type: 'session_event' }
            }
            canManageWorkload={canManageWorkload}
            onUpdateEventDetails={onUpdateEventDetails}
            isOpen={isOpen}
            setAdditionalMixpanelSessionData={setAdditionalMixpanelSessionData}
            {...restEventProps}
          />
        );
      }
      case 'game_event': {
        return isGameDetailsFeatureFlag ? (
          <GameLayoutV2
            event={event}
            panelMode={panelMode}
            eventValidity={gameEventValidity}
            onUpdateEventDetails={onUpdateEventDetails}
            {...restEventProps}
          />
        ) : (
          <GameLayout
            event={event}
            panelMode={panelMode}
            eventValidity={gameEventValidity}
            onUpdateEventDetails={onUpdateEventDetails}
            {...restEventProps}
          />
        );
      }
      case 'custom_event': {
        return (
          <CustomEventLayout
            event={event}
            panelMode={panelMode}
            eventValidity={
              eventValidity?.type === 'custom_event'
                ? eventValidity
                : { type: 'custom_event' }
            }
            onUpdateEventDetails={onUpdateEventDetails}
            {...restEventProps}
          />
        );
      }

      default:
        return undefined;
    }
  };

  return (
    <div css={style.formHolder}>
      {determineLayout()}
      {window.getFlag('event-collection-complete') && isPanelModeEdit && (
        <Checkbox
          name="eventCollectionComplete"
          id="eventCollectionComplete"
          label={t('Event collection complete')}
          isChecked={event.event_collection_complete || false}
          kitmanDesignSystem
          toggle={(data) => {
            onUpdateEventDetails({
              event_collection_complete: data.checked,
            });
          }}
        />
      )}

      {window.featureFlags['event-attachments'] && (
        <EventAttachments
          event={event}
          isAttachmentsDisabled={isAttachmentsDisabled}
          isPanelModeEdit={isPanelModeEdit}
          onUpdateEventDetails={onUpdateEventDetails}
        />
      )}
      {window.getFlag('event-notifications') && (
        <EventNotifications
          onUpdateNotificationChannels={onUpdateNotificationChannels}
        />
      )}
    </div>
  );
};

export const EditEventPanelLayoutTranslated: ComponentType<Props> =
  withNamespaces()(EditEventPanelLayout);
export default EditEventPanelLayout;
