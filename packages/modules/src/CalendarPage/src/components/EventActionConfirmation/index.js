// @flow
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { EventActionModalTranslated as EventActionModal } from '@kitman/modules/src/shared/EventActionModal';
import { actionEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/enum-likes';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { isNotificationActionable } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import type { Event } from '@kitman/common/src/types/Event';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

export type Props = {
  onDismiss: Function,
  onConfirm: Function,
};

const EventActionConfirmation = ({
  onConfirm,
  onDismiss,
}: I18nProps<Props>) => {
  const isLoading =
    useSelector((state) => state.appStatus.status) === 'loading';
  const event: Event = useSelector((state) => state.deleteEvent.event) ?? {};
  const { data: notificationTriggers } = useGetNotificationTriggersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  return isLoading ? null : (
    <EventActionModal
      action={actionEnumLike.Delete}
      isOpen
      onClose={() => {
        onDismiss();
      }}
      onConfirm={onConfirm}
      shouldLimitScopeToNext={
        // $FlowIgnore[prop-missing] valid due to getIsRepeatEvent check
        !event.recurrence?.recurring_event_id
      }
      eventType={event.type}
      isRepeatEvent={getIsRepeatEvent(event)}
      eventId={event.id}
      isNotificationActionable={isNotificationActionable(notificationTriggers)}
    />
  );
};

export const EventActionConfirmationTranslated: ComponentType<Props> =
  withNamespaces()(EventActionConfirmation);
export default EventActionConfirmation;
