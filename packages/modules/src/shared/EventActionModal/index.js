// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, type ComponentType } from 'react';

import {
  ConfirmationModal,
  Alert,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  RecurrenceChangeScope,
  CreatableEventType,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import {
  recurrenceChangeScopeEnumLike,
  creatableEventTypeEnumLike,
} from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';
import getEventDeletionPrompt, {
  type EventDeletionPromptResponse,
} from '@kitman/services/src/services/planning/getEventDeletionPrompt';
import { getNotificationsConfirmationModalTranslatedText } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import { actionEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/enum-likes';
import type { Action } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/types';

import EventDeletionPrompt from './EventDeletionPrompt';

type Props = {
  action: Action,
  isOpen: boolean,
  eventType: CreatableEventType,
  shouldShowRepeatEventWarning?: boolean,
  shouldShowNotificationsModal?: boolean,
  shouldLimitScopeToNext?: boolean,
  isSubmitting?: boolean,
  eventId: number,
  isRepeatEvent: boolean,
  onClose: () => void,
  onConfirm: (params: {
    recurrenceChangeScope?: RecurrenceChangeScope,
    sendNotifications?: boolean,
  }) => Promise<void> | void,
  isNotificationActionable?: boolean,
};

export type TranslatedProps = I18nProps<Props>;

type ScopeOptions = Array<{ name: string, value: RecurrenceChangeScope }>;

const getScopeOptions = (t): ScopeOptions => [
  {
    name: t('This event only'),
    value: recurrenceChangeScopeEnumLike.This,
  },
  {
    name: t('This and all following events'),
    value: recurrenceChangeScopeEnumLike.Next,
  },
];

const EventActionModal = ({
  t,
  action,
  isOpen,
  onClose,
  onConfirm,
  shouldShowNotificationsModal,
  shouldShowRepeatEventWarning,
  shouldLimitScopeToNext,
  isSubmitting,
  eventType,
  eventId,
  isRepeatEvent,
  isNotificationActionable,
}: TranslatedProps) => {
  const title = {
    [actionEnumLike.Delete]: t('Delete event'),
    [actionEnumLike.Edit]: t('Edit event'),
  }[action];

  const [eventScope, setEventScope] = useState<RecurrenceChangeScope>(
    shouldLimitScopeToNext
      ? recurrenceChangeScopeEnumLike.Next
      : recurrenceChangeScopeEnumLike.This
  );
  const [eventDeletionAttributes, setEventDeletionAttributes] =
    useState<EventDeletionPromptResponse>({});
  const [shouldShowNotificationModal, setShouldShowNotificationModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDeleteAction = action === actionEnumLike.Delete;
  const hasLinkedData =
    isDeleteAction &&
    Object.values(eventDeletionAttributes).some(
      (item) => Array.isArray(item) && item.length > 0
    );
  const hasLinkedIssues =
    hasLinkedData && eventDeletionAttributes.issues.length > 0;

  const confirmButtonText = isDeleteAction ? t('Delete') : t('OK');

  const shouldShowWarningBanner =
    isDeleteAction || shouldShowRepeatEventWarning || hasLinkedData;

  const getModalOptions = (): ScopeOptions =>
    shouldLimitScopeToNext
      ? getScopeOptions(t).filter(
          (option) => option.value === recurrenceChangeScopeEnumLike.Next
        )
      : getScopeOptions(t);

  const fetchDeletionPromptAttributes = async () => {
    setIsLoading(true);
    try {
      const attributes = await getEventDeletionPrompt({
        eventId,
        eventScope,
        isRepeatEvent,
      });
      setEventDeletionAttributes(attributes);
      // eslint-disable-next-line no-empty
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      (eventType === creatableEventTypeEnumLike.Session ||
        eventType === creatableEventTypeEnumLike.Game) &&
      isDeleteAction
    ) {
      fetchDeletionPromptAttributes();
    }
  }, [eventId, eventScope, isDeleteAction]);

  return (
    <>
      <ConfirmationModal
        maxWidth={hasLinkedData ? 'md' : 'sm'}
        fullWidth
        isModalOpen={isOpen}
        isLoading={Boolean(isSubmitting)}
        isDeleteAction={isDeleteAction}
        onConfirm={() => {
          if (
            window.getFlag('event-notifications') &&
            // If notification channels are enabled, always show for delete actions. For edits, only show if key fields have been modified.
            isNotificationActionable &&
            (isDeleteAction || shouldShowNotificationsModal)
          ) {
            setShouldShowNotificationModal(true);
          } else {
            onConfirm({ recurrenceChangeScope: eventScope });
          }
        }}
        onCancel={onClose}
        dialogContent={
          <>
            {isRepeatEvent && (
              <FormControl>
                <RadioGroup
                  row
                  value={eventScope}
                  onChange={(e) => setEventScope(e.target.value)}
                >
                  {getModalOptions().map((option) => (
                    <FormControlLabel
                      key={option.name}
                      value={option.value}
                      control={
                        <Radio
                          sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 16,
                            },
                            '& .MuiTypography-root': {
                              fontSize: 14,
                            },
                          }}
                        />
                      }
                      label={option.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {shouldShowWarningBanner && (
              <Alert severity="warning">
                {hasLinkedData
                  ? t(
                      'This will result in loss of participation data and any inputted data on this event. Action cannot be undone. Please review the table below.'
                    )
                  : t(
                      'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
                    )}
              </Alert>
            )}

            {isDeleteAction && (
              <EventDeletionPrompt
                eventDeletionAttributes={eventDeletionAttributes}
                isLoading={isLoading}
                eventType={eventType}
              />
            )}
          </>
        }
        translatedText={{
          title,
          actions: {
            ctaButton: confirmButtonText,
            ctaButtonTooltip: hasLinkedIssues
              ? t('Unlink medical records if you wish to proceed.')
              : undefined,
            cancelButton: t('Cancel'),
          },
        }}
        disableCtaButton={hasLinkedIssues}
      />

      {window.getFlag('event-notifications') && (
        <ConfirmationModal
          isModalOpen={shouldShowNotificationModal}
          isLoading={false}
          onConfirm={() => {
            onConfirm({
              recurrenceChangeScope: eventScope,
              sendNotifications: true,
            });
            setShouldShowNotificationModal(false);
          }}
          onCancel={() => {
            onConfirm({
              recurrenceChangeScope: eventScope,
              sendNotifications: false,
            });
            setShouldShowNotificationModal(false);
          }}
          onClose={() => setShouldShowNotificationModal(false)}
          translatedText={getNotificationsConfirmationModalTranslatedText()}
        />
      )}
    </>
  );
};

export const EventActionModalTranslated: ComponentType<Props> =
  withNamespaces()(EventActionModal);
export default EventActionModal;
