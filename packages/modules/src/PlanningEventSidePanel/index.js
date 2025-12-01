/* eslint-disable max-depth */
// @flow
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import { isEqual, capitalize, compact } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { RRule } from 'rrule';

import {
  transformEventFilesForUpload,
  type AttachedTransformedEventFile,
} from '@kitman/common/src/utils/fileHelper';
import {
  uploadFile,
  getSport,
  createCustomOppositionName,
  updateCustomOppositionName,
  deleteCustomOppositionName,
} from '@kitman/services';
import type { Event as PlanningEvent } from '@kitman/common/src/types/Event';
import {
  SlidingPanelResponsive,
  TextButton,
  AppStatus,
  ExpandingPanel,
  SegmentedControl,
} from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type {
  Status,
  StatusChangedCallback,
} from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import { getValidHref } from '@kitman/common/src/utils';
import type { ButtonItem } from '@kitman/components/src/SegmentedControl';

import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getCalendarEventData } from '@kitman/common/src/utils/TrackingData/src/data/calendar/getCalendarEventData';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import {
  getPeriodDurationInfo,
  onAddPeriod,
  onDeletePeriod,
  recalculatePeriodEventInfo,
  updateAllPeriodGameActivities,
  getCurrentLocalPeriods,
  recalculateCustomPeriodExistingActivities,
} from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import {
  regenerateRRuleWithUpdatedDateTime,
  getRemainingDaysInRecurrence,
} from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/helpers';
import { isRRuleCustom } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/config-helpers';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AdditionalMixpanelSessionData } from '@kitman/common/src/utils/TrackingData/src/types/calendar';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';
import type { FullCalendarRef } from '@kitman/modules/src/CalendarPage/src/types';

import { getSeasonMarkerRange } from '@kitman/services/src/services/leaguefixtures';
import { EventActionModalTranslated as EventActionModal } from '@kitman/modules/src/shared/EventActionModal';
import { EditEventPanelLayoutTranslated as EditEventPanelLayout } from './src/components/EditEventPanelLayout';
import { actionEnumLike } from './src/components/common/RepeatEvent/utils/enum-likes';
import style from './src/style';
import {
  createInitialEvent,
  sanitizeEvent,
  createInitialValidation,
} from './src/utils';
import {
  convertPlanningEventToEventFormData,
  parseRepeatRule,
} from './src/convertPlanningEventToEventFormData';
import validateGame from './src/validation/validateGame';
import validateSession from './src/validation/validateSession';
import saveEvent from '../PlanningEvent/src/services/saveEvent';
import updateEventPeriods from '../PlanningEvent/src/services/updateEventPeriods';
import { DUPLICATED_EVENT_HASH } from '../PlanningEvent/src/constants';
import type {
  EventFormData,
  EventGameFormData,
  CreatableEventType,
  EventFormValidity,
  EventFormValidityResult,
  EventNotificationChannels,
  EditEventPanelMode,
  PanelType,
  SaveRequestStatus,
  CustomEventFormValidity,
  OnUpdateEventStartTime,
  OnUpdateEventDuration,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventTitle,
  OnUpdateEventNotificationChannels,
  OnUpdateEventDetails,
  RecurrenceChangeScope,
} from './src/types';
import validateCustomEvent from './src/validation/validateCustomEvent';
import { StaffVisibilityOptions } from './src/components/custom/utils';
import { setSavedEventPeriods } from '../PlanningEvent/src/redux/slices/eventPeriodsSlice';
import { setSavedGameActivities } from '../PlanningEvent/src/redux/slices/gameActivitiesSlice';
import saveAllPeriodGameActivities from '../PlanningEvent/src/services/saveAllPeriodGameActivities';
import {
  creatableEventTypeEnumLike,
  recurrenceChangeScopeEnumLike,
} from './src/enumLikes';
import { LOCAL_CUSTOM_OPPOSITION_OPTION_ID } from './src/components/gameLayoutV2/gameFieldsUtils';
import {
  transformFeRecurrenceRuleToFitBe,
  getIsEditedRecurrenceRuleLessFrequent,
  getNotificationsConfirmationModalTranslatedText,
  isNotificationActionable,
} from '../CalendarPage/src/utils/eventUtils';

export type Props = {
  isOpen: boolean,
  panelType: PanelType,
  panelMode: EditEventPanelMode,
  planningEvent?: PlanningEvent,
  eventConditions: ?EventConditions,
  createNewEventType?: CreatableEventType,
  defaultEventDuration?: number, // Minutes
  onUpdatedEventTimeInfoCallback?: Function,
  onUpdatedEventTitleCallback?: Function,
  onUpdatedEventDetailsCallback?: Function,
  onSaveEventSuccess?: Function,
  redirectToEventOnClose?: boolean,
  canManageWorkload?: boolean,
  onClose: Function,
  isCalendarMode?: boolean,
  isAttachmentsDisabled?: boolean,
  onFileUploadStart?: Function,
  onFileUploadSuccess?: Function,
  onFileUploadFailure?: Function,
  removeFileUploadToast?: Function,
  calendarRef?: FullCalendarRef,
};

type Event = {
  name: string,
  value: string,
  edit: string,
  duplicate: string,
  create: string,
  tab: ?ButtonItem,
};

type EventNames = {
  game_event: Event,
  session_event: Event,
  custom_event: Event,
};

const EditEventPanel = (props: I18nProps<Props>) => {
  const checkIsMounted = useIsMountedCheck();

  const { trackEvent } = useEventTracking();

  const [additionalMixpanelSessionData, setAdditionalMixpanelSessionData] =
    useState<AdditionalMixpanelSessionData>({
      areParticipantsDuplicated: false,
      isSessionPlanDuplicated: false,
      drillsCount: 0,
    });

  const dispatch = useDispatch();
  const retrievedActivities = useSelector(
    (state) => state?.planningEvent?.gameActivities
  );
  const localGameActivities = retrievedActivities?.localGameActivities ?? [];
  const apiGameActivities = retrievedActivities?.apiGameActivities ?? [];
  const retrievedPeriods = useSelector(
    (state) => state?.planningEvent?.eventPeriods
  );
  const eventPeriods = retrievedPeriods?.localEventPeriods ?? [];

  const activeEventPeriods = getCurrentLocalPeriods(eventPeriods);

  const isGameDetailsFeatureFlag = window.featureFlags['game-details'];
  const customPeriodDurationFF =
    window.featureFlags['games-custom-duration-and-additional-time'];
  const customOppositionNameFF =
    window.featureFlags['manually-add-opposition-name'];

  const [initialDataRequestStatus, setInitialDataRequestStatus] = useState<
    'PENDING' | 'SUCCESS' | 'FAILURE'
  >('PENDING');
  const [saveRequestStatus, setSaveRequestStatus] =
    useState<SaveRequestStatus>('IDLE');
  const [dataLoadingHasErrored, setDataLoadingHasErrored] =
    useState<boolean>(false);
  const [seasonMarkerRange, setSeasonMarkerRange] =
    useState<?Array<string>>(null);
  const [defaultGameDuration, setDefaultGameDuration] = useState<?number>(null);

  const locationAssign = useLocationAssign();
  const { isLeague, isOfficial } = useLeagueOperations();
  const isLeagueOps = isLeague || isOfficial;

  const { data: notificationTriggers } = useGetNotificationTriggersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const [isValidEvent, setIsValidEvent] = useState(false);
  const [eventType, setEventType] = useState<CreatableEventType>('');
  const [event, setEvent] = useState<EventFormData>(
    props.planningEvent
      ? convertPlanningEventToEventFormData({
          event: props.planningEvent,
          activeEventPeriods,
          isCalendarMode: props?.isCalendarMode,
          isDuplicate: props.panelMode === 'DUPLICATE',
        })
      : createInitialEvent(
          isGameDetailsFeatureFlag,
          eventType,
          props.defaultEventDuration ||
            EditEventPanel.defaultProps.defaultEventDuration,
          defaultGameDuration
        )
  );

  const initialEvent = useRef(props.planningEvent);

  const [shouldShowSaveVerificationModal, setShouldShowSaveVerificationModal] =
    useState(false);
  const [shouldShowRepeatEventWarning, setShouldShowRepeatEventWarning] =
    useState(false);

  const [shouldShowNotificationModal, setShouldShowNotificationModal] =
    useState(false);

  const [hasKeyFieldsChanged, setHasKeyFieldsChanged] = useState(false);
  const [eventValidity, setEventValidity] = useState<
    EventFormValidity | CustomEventFormValidity
  >(createInitialValidation(props.planningEvent?.type || eventType));

  const [shouldCheckEventValidity, setShouldCheckEventValidity] =
    useState(false);
  // adding useCallback here because this is used in many memoized functions/components
  // down the component tree
  const onDataLoadingStatusChanged: StatusChangedCallback = useCallback(
    (status: Status) => {
      if (status === 'FAILURE' && checkIsMounted()) {
        setDataLoadingHasErrored(true);
      }
    },
    []
  );

  const areCustomEventsOn = window.featureFlags['custom-events'];
  // $FlowIgnore[incompatible-call] flow getting confused
  const isRepeatEvent = getIsRepeatEvent(event);

  useEffect(() => {
    if (!checkIsMounted()) return;
    setEventType(
      props.planningEvent?.type ||
        props.createNewEventType ||
        creatableEventTypeEnumLike.Default
    );
  }, [props.planningEvent, props.createNewEventType]);

  useEffect(() => {
    // Fetch initial data
    Promise.all([getSeasonMarkerRange(), getSport()]).then(
      ([seasonMarkerRangeData, sport]) => {
        if (!checkIsMounted()) return;
        setDefaultGameDuration(sport.duration);
        setSeasonMarkerRange(seasonMarkerRangeData);
        setInitialDataRequestStatus('SUCCESS');
      },
      () => {
        if (!checkIsMounted()) return;
        onDataLoadingStatusChanged('FAILURE');
        setInitialDataRequestStatus('FAILURE');
      }
    );
  }, []);

  const getEventFormValidityResult = (
    updatedEvent: EventFormData
  ): EventFormValidityResult => {
    switch (updatedEvent.type) {
      case 'game_event':
        return validateGame(
          updatedEvent,
          seasonMarkerRange,
          props.eventConditions?.temperature_units,
          isGameDetailsFeatureFlag,
          customPeriodDurationFF,
          customOppositionNameFF
        );
      case 'session_event':
        return validateSession(
          updatedEvent,
          props.eventConditions?.temperature_units
        );
      case 'custom_event':
        return validateCustomEvent(updatedEvent);
      default:
        return { isValid: false };
    }
  };

  const updateValidityState = (updatedEvent: EventFormData) => {
    if (shouldCheckEventValidity && checkIsMounted()) {
      const result = getEventFormValidityResult(updatedEvent);
      if (result.validation) {
        setEventValidity(result.validation);
      }
      setIsValidEvent(result.isValid);
    }
  };

  useEffect(() => {
    updateValidityState(event);
  }, [event]);

  const resetState = () => {
    if (!checkIsMounted()) return;

    setSaveRequestStatus('IDLE');
    setIsValidEvent(false);

    setEvent(
      props.planningEvent
        ? convertPlanningEventToEventFormData({
            event: props.planningEvent,
            activeEventPeriods,
            isCalendarMode: props?.isCalendarMode,
            isDuplicate: props.panelMode === 'DUPLICATE',
          })
        : createInitialEvent(
            isGameDetailsFeatureFlag,
            eventType,
            props.defaultEventDuration ||
              EditEventPanel.defaultProps.defaultEventDuration,
            defaultGameDuration
          )
    );
    setEventValidity(
      createInitialValidation(props.planningEvent?.type || eventType)
    );
    setShouldCheckEventValidity(false);
  };

  // Reset state when closing the panel or initial useState data changes
  useEffect(() => {
    if (props.isOpen) {
      resetState();
    }
  }, [
    props.panelMode,
    props.planningEvent?.start_date, // for drag n drop of event in month view
    props.planningEvent?.end_date, // for drag n drop extension of event (with end_date) in non month view
    props.planningEvent?.duration, // for drag n drop extension of event (without end_date) in non month view
    eventType,
    props.isOpen,
    defaultGameDuration,
  ]);

  const uploadFiles = (unConfirmedFiles): Array<Promise<void>> =>
    unConfirmedFiles.map((unConfirmedFile, index) => {
      props.onFileUploadStart?.(
        unConfirmedFile.attachment.id,
        unConfirmedFile.attachment.name
      );

      return uploadFile(
        // $FlowFixMe
        event.unUploadedFiles[index].file,
        unConfirmedFile.attachment.id,
        unConfirmedFile.attachment.presigned_post
      )
        .then(() => {
          console.log('File upload succeeded.');
          props.onFileUploadSuccess?.(
            unConfirmedFile.attachment.name,
            unConfirmedFile.attachment.id
          );
        })
        .catch(() => {
          console.log('File upload failed.');
          props.onFileUploadFailure?.(
            unConfirmedFile.attachment.name,
            unConfirmedFile.attachment.id
          );
        })
        .finally(() => {
          props.removeFileUploadToast?.(unConfirmedFile.attachment.id);
        });
    });

  const handleNewEventWithCustomPeriods = async (
    customPeriods: Array<GamePeriod>,
    eventId: number
  ) => {
    const savedEventPeriods = await updateEventPeriods(customPeriods, eventId);
    await saveAllPeriodGameActivities(eventId, savedEventPeriods[0].id, [
      {
        kind: eventTypes.formation_change,
        absolute_minute: 0,
        minute: 0,
        relation: { id: 4, name: '4-5-1' },
      },
    ]);
  };

  const handleCustomPeriodChanges = async (
    customPeriods: Array<GamePeriod>,
    eventId: number
  ) => {
    const currentCustomPeriods = [...customPeriods];
    let currentGameActivities = [...localGameActivities];
    let updatedActivities;

    currentGameActivities = recalculateCustomPeriodExistingActivities(
      activeEventPeriods,
      currentCustomPeriods,
      currentGameActivities
    );

    const updatedEventPeriods = await updateEventPeriods(
      currentCustomPeriods,
      eventId
    );

    if (currentGameActivities.length > 0)
      updatedActivities = await updateAllPeriodGameActivities({
        gamePeriods: updatedEventPeriods,
        apiGameActivities,
        localGameActivities: currentGameActivities,
        gameId: eventId,
      });

    dispatch(setSavedEventPeriods(updatedEventPeriods));
    if (updatedActivities)
      dispatch(setSavedGameActivities(updatedActivities.flat()));
  };

  const handleEvenSplitPeriodChanges = async (savedEvent: PlanningEvent) => {
    if (activeEventPeriods.length > 0 && savedEvent.duration) {
      let currentPeriods = [...activeEventPeriods];
      let currentGameActivities = [...localGameActivities];
      const numberOfPeriods =
        typeof savedEvent.number_of_periods === 'number'
          ? savedEvent.number_of_periods
          : activeEventPeriods.length;
      const hasCustomChangedToEvenSplit =
        customPeriodDurationFF &&
        savedEvent.type === 'game_event' &&
        !savedEvent.custom_period_duration_enabled;

      const shouldAddPeriods = numberOfPeriods > activeEventPeriods.length;
      const shouldRemovePeriods = numberOfPeriods < activeEventPeriods.length;

      if (shouldAddPeriods) {
        const numberOfAdditions = numberOfPeriods - activeEventPeriods.length;
        for (let i = 0; i < numberOfAdditions; i++) {
          const { recalculatedPeriods, recalculatedActivities } = onAddPeriod(
            currentPeriods,
            currentGameActivities,
            savedEvent.duration
          );
          currentPeriods = recalculatedPeriods;
          currentGameActivities = recalculatedActivities;
        }
      } else if (shouldRemovePeriods) {
        const numberOfDeletions = activeEventPeriods.length - numberOfPeriods;
        for (let i = 1; i <= numberOfDeletions; i++) {
          const { recalculatedPeriods, recalculatedActivities } =
            onDeletePeriod(
              currentPeriods[currentPeriods.length - i],
              currentPeriods,
              currentGameActivities,
              savedEvent.duration
            );
          currentPeriods = recalculatedPeriods;
          currentGameActivities = recalculatedActivities;
        }
      } else if (
        savedEvent.duration !== props.planningEvent?.duration ||
        hasCustomChangedToEvenSplit
      ) {
        const newPeriodDuration = Math.floor(
          +savedEvent.duration / currentPeriods.length
        );
        const newPeriodsDurationSum =
          (currentPeriods.length - 1) * newPeriodDuration;
        const newPeriodFinalDuration =
          +savedEvent.duration - newPeriodsDurationSum;
        getPeriodDurationInfo(currentPeriods, false);
        const { recalculatedPeriods, recalculatedActivities } =
          recalculatePeriodEventInfo(
            currentPeriods,
            currentGameActivities,
            newPeriodDuration,
            newPeriodFinalDuration
          );
        currentPeriods = recalculatedPeriods;
        currentGameActivities = recalculatedActivities;
      }

      if (!isEqual(activeEventPeriods, currentPeriods)) {
        const updatedEventPeriods = await updateEventPeriods(
          currentPeriods,
          +savedEvent.id
        );
        if (currentGameActivities.length > 0)
          await updateAllPeriodGameActivities({
            gamePeriods: updatedEventPeriods,
            apiGameActivities,
            localGameActivities: currentGameActivities,
            gameId: +savedEvent.id,
            shouldReloadActivities: false,
          });
        dispatch(setSavedEventPeriods(updatedEventPeriods));
      }
    }
  };

  const handleCustomOppositionNameSave = async (
    sanitizedEvent: EventGameFormData
  ): Promise<?number> => {
    const currentEvent = { ...sanitizedEvent };
    let currentTeamId = currentEvent.team_id;
    try {
      if (currentTeamId === LOCAL_CUSTOM_OPPOSITION_OPTION_ID) {
        const newCustomSavedName = await createCustomOppositionName(
          currentEvent.custom_opposition_name
        );
        currentTeamId = newCustomSavedName.id;
      } else if (
        currentEvent.team_id &&
        currentEvent.custom_opposition_name &&
        currentEvent.custom_opposition_name !==
          currentEvent?.opponent_team?.name
      ) {
        await updateCustomOppositionName(
          currentEvent.custom_opposition_name,
          currentEvent.team_id
        );
      }
    } catch (e) {
      if (!checkIsMounted()) return -1;
      setSaveRequestStatus('FAILURE');
    }
    return currentTeamId;
  };

  const onUpdateEventDetails: OnUpdateEventDetails = (details: Object) => {
    if (!checkIsMounted()) return;
    setEvent((prevEvent) => {
      const updatedEvent = sanitizeEvent({ ...prevEvent, ...details });
      props.onUpdatedEventDetailsCallback?.(details, updatedEvent);
      return updatedEvent;
    });
    // Will never hit second condition when game event
    // $FlowIgnore[prop-missing]
    if (isRepeatEvent && initialEvent.current?.recurrence?.rule) {
      const convertedInitialEventRule = RRule.fromString(
        initialEvent.current.recurrence.rule
      );
      const hasRecurrenceRuleBeenChanged =
        !!details?.recurrence &&
        details?.recurrence?.rule?.toString() !==
          convertedInitialEventRule?.toString();

      if (hasRecurrenceRuleBeenChanged) {
        const isEditedRecurrenceRuleLessFrequent =
          getIsEditedRecurrenceRuleLessFrequent(
            details?.recurrence?.rule,
            convertedInitialEventRule
          );
        setShouldShowRepeatEventWarning(isEditedRecurrenceRuleLessFrequent);
      }
    }
  };

  const handleCustomOppositionNameCleanup = async (
    sanitizedEvent: EventGameFormData,
    savedEvent: PlanningEvent
  ) => {
    // Checks if the current opposition is different from the last saved data and if the last was a custom team
    // fires off a delete to remove the team.
    if (
      savedEvent.type === 'game_event' &&
      savedEvent.opponent_team &&
      sanitizedEvent.opponent_team &&
      sanitizedEvent.opponent_team.custom &&
      sanitizedEvent.opponent_team.id &&
      +savedEvent.opponent_team.id !== +sanitizedEvent.opponent_team?.id
    ) {
      await deleteCustomOppositionName(+sanitizedEvent.opponent_team.id);
    }

    if (
      savedEvent.type === 'game_event' &&
      savedEvent.opponent_team &&
      savedEvent.opponent_team.custom &&
      sanitizedEvent.opponent_team &&
      +savedEvent.opponent_team.id !== sanitizedEvent.opponent_team.id
    ) {
      onUpdateEventDetails({
        opponent_team: savedEvent.opponent_team,
        custom_opposition_name: savedEvent.opponent_team.name,
      });
    }
  };

  const getEventTrackingName = () => {
    let transformedPanelMode;
    switch (props.panelMode) {
      case 'EDIT':
        transformedPanelMode = 'Edit';
        break;
      case 'CREATE':
        transformedPanelMode = 'Add';
        break;
      default: // DUPLICATE
        transformedPanelMode = 'Duplicate';
        break;
    }

    switch (eventType) {
      case 'game_event':
        return `${transformedPanelMode} game`;
      case 'session_event':
        return `${transformedPanelMode} session`;
      default: // custom_event
        return `${transformedPanelMode} event`;
    }
  };

  const prepareAndTriggerTrackingEvent = (eventToTrack) => {
    trackEvent(
      getEventTrackingName(),
      getCalendarEventData({
        eventType,
        panelMode: props.panelMode,
        eventToTrack,
        additionalMixpanelSessionData,
        isRepeatEvent,
        createWithNoParticipants: Boolean(event.no_participants),
      })
    );
  };

  useEffect(() => {
    if (
      Object.values(eventValidity).some(
        // $FlowIgnore[incompatible-call] type is correct
        (element: { isInvalid: boolean }) => element.isInvalid
      )
    ) {
      const sidePanelSelector =
        props.panelType === 'EXPANDING' ? 'ExpandingPanel' : 'sliding-panel';
      const firstInvalidField = document
        .querySelector(`[data-testid="${sidePanelSelector}"]`)
        ?.querySelector('[class*="--invalid"]');
      firstInvalidField?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [eventValidity]);

  // Used to determine if key fields have changed and trigger the notification modal
  const haveKeyFieldsChanged = () => {
    if (props.panelMode !== 'EDIT' || !initialEvent.current) {
      // For CREATE and DUPLICATE modes,
      // we will always consider that "changes have been made" to allow the notification
      // modal flow to proceed if the feature flag is active.
      return true;
    }

    const original = convertPlanningEventToEventFormData({
      event: initialEvent.current,
      activeEventPeriods,
      isCalendarMode: props?.isCalendarMode,
      isDuplicate: props.panelMode === 'DUPLICATE',
    });
    const current = event;

    //  Common fields
    const originalMoment = moment(original.start_time);
    const currentMoment = moment(current.start_time);
    const dateChanged = !originalMoment.isSame(currentMoment, 'day');
    const timeChanged = !originalMoment.isSame(currentMoment, 'minute');
    const locationChanged =
      original.event_location?.id !== current.event_location?.id;
    const descriptionChanged = original.description !== current.description;
    const athletesChanged = !isEqual(original.athlete_ids, current.athlete_ids);
    const staffChanged = !isEqual(original.user_ids, current.user_ids);

    switch (current.type) {
      case 'custom_event':
      case 'session_event': {
        const titleChanged = original.title !== current.title;

        return (
          titleChanged ||
          dateChanged ||
          timeChanged ||
          locationChanged ||
          descriptionChanged ||
          athletesChanged ||
          staffChanged
        );
      }

      case 'game_event': {
        // Type guard to ensure both objects are game events, satisfying the linter.
        if (original.type !== 'game_event' || current.type !== 'game_event') {
          return false;
        }

        const competitionChanged =
          original.competition?.id !== current.competition?.id;

        const oppositionChanged = original.team_id !== current.team_id;
        const venueChanged = original.venue_type_id !== current.venue_type_id;

        return (
          dateChanged ||
          timeChanged ||
          locationChanged ||
          competitionChanged ||
          oppositionChanged ||
          venueChanged ||
          descriptionChanged ||
          athletesChanged ||
          staffChanged
        );
      }

      default:
        // By default, if the event type doesn't match, don't show the modal.
        return false;
    }
  };

  const attemptEventSave = async ({
    recurrenceChangeScope,
    sendNotifications = false,
  }: {
    recurrenceChangeScope?: RecurrenceChangeScope,
    sendNotifications?: boolean,
  } = {}): Promise<void> => {
    if (!checkIsMounted()) return;

    setSaveRequestStatus('IDLE');
    // UX requires the user be allowed enter data and only once pressed save highlight invalid fields to them
    // Now that we have attempted a save, the validity of the event should be checked
    setShouldCheckEventValidity(true);

    const { title, ...sanitizedEvent } = sanitizeEvent(event);

    const result = isLeagueOps
      ? { isValid: true }
      : getEventFormValidityResult(sanitizedEvent);

    if (!result.isValid) {
      if (result.validation) {
        setEventValidity(result.validation);
      }
      setIsValidEvent(result.isValid);
    } else {
      const hasInitialRecurrence =
        // $FlowIgnore[prop-missing] recurrence will exist
        isRepeatEvent && !!initialEvent.current?.recurrence?.rule;

      if (hasInitialRecurrence && !shouldShowSaveVerificationModal) {
        setHasKeyFieldsChanged(haveKeyFieldsChanged());
        setShouldShowSaveVerificationModal(true);
        return;
      }

      const isNotificationActionableFlag = isNotificationActionable(
        notificationTriggers,
        event.notification_channels
      );

      if (
        window.getFlag('event-notifications') &&
        !shouldShowNotificationModal &&
        !hasInitialRecurrence &&
        haveKeyFieldsChanged() &&
        isNotificationActionableFlag
      ) {
        setShouldShowNotificationModal(true);

        return;
      }

      setSaveRequestStatus('SUBMITTING');

      const name: string | void = title || undefined;

      let duplicatedEventId: number | void;
      if (props.panelMode === 'DUPLICATE') {
        duplicatedEventId = sanitizedEvent.id;
        delete sanitizedEvent.id;
      }

      let attachmentsAttributes: Array<AttachedTransformedEventFile> | void;
      if (
        window.featureFlags['event-attachments'] &&
        !!event.unUploadedFiles &&
        event.unUploadedFiles.length > 0
      ) {
        attachmentsAttributes = transformEventFilesForUpload(
          event.unUploadedFiles
        );
        delete sanitizedEvent.attachments;
      }

      let attachedLinksAttributes: Array<{
        event_attached_link_category_ids: Array<number>,
        attached_link: { title: string, uri: string },
      }> | void;
      if (
        window.featureFlags['event-attachments'] &&
        !!event.unUploadedLinks &&
        event.unUploadedLinks.length > 0
      ) {
        attachedLinksAttributes = event.unUploadedLinks?.map((eventLink) => ({
          event_attached_link_category_ids:
            eventLink.event_attachment_category_ids,
          attached_link: {
            title: eventLink.title,
            uri: getValidHref(eventLink.uri),
          },
        }));
        delete sanitizedEvent.unUploadedLinks;
        delete sanitizedEvent.attached_links;
      }

      let customPeriods = [];
      let isCustomPeriodsActive = false;
      if (sanitizedEvent.type === 'game_event') {
        if (customPeriodDurationFF) {
          customPeriods = sanitizedEvent.custom_periods;
          isCustomPeriodsActive = sanitizedEvent.custom_period_duration_enabled;
        } else {
          sanitizedEvent.custom_periods = [];
        }
      }

      let eventLocationId: number | void;
      if (
        window.featureFlags['event-locations'] &&
        sanitizedEvent.event_location
      ) {
        eventLocationId = sanitizedEvent.event_location.id;
      }

      if (
        !isLeagueOps &&
        sanitizedEvent.type !== 'custom_event' &&
        (!areCustomEventsOn || sanitizedEvent.user_ids?.length === 0) &&
        !window.getFlag(
          'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
        )
      ) {
        delete sanitizedEvent.user_ids;
      }

      let customEventTypeId: number | void;
      if (
        areCustomEventsOn &&
        sanitizedEvent.type === 'custom_event' &&
        sanitizedEvent.custom_event_type
      ) {
        customEventTypeId = sanitizedEvent.custom_event_type.id;
        delete sanitizedEvent.custom_event_type;
      }

      // TODO: danhigginskitman extract below repeat events logic to
      // new util - too complex for inline
      if (getIsRepeatEvent(sanitizedEvent)) {
        let newRule;
        const hasRRuleChanged = !isEqual(
          // $FlowIgnore[prop-missing] recurrence will exist due to getIsRepeatEvent check
          sanitizedEvent.recurrence?.rule,
          // $FlowIgnore[prop-missing] recurrence will exist due to getIsRepeatEvent check
          parseRepeatRule(initialEvent?.current?.recurrence?.rule)
        );

        if (
          !hasRRuleChanged &&
          // $FlowIgnore[prop-missing]
          // $FlowIgnore[incompatible-use]
          sanitizedEvent.recurrence.rule.origOptions &&
          isRRuleCustom(
            // $FlowIgnore[prop-missing] recurrence will exist due to getIsRepeatEvent check
            sanitizedEvent.recurrence.rule,
            props.t,
            moment.tz(sanitizedEvent.start_time, sanitizedEvent.local_timezone)
          ) &&
          // $FlowIgnore[prop-missing] recurrence will exist due to getIsRepeatEvent check
          !sanitizedEvent.recurrence.rule.origOptions.until // Ensuring count & until don't co-exist
        ) {
          newRule = new RRule({
            // $FlowIgnore[prop-missing] recurrence will exist due to getIsRepeatEvent check
            ...sanitizedEvent.recurrence.rule.origOptions,
            count:
              getRemainingDaysInRecurrence(sanitizedEvent) ??
              // $FlowIgnore[prop-missing]
              // $FlowIgnore[incompatible-use]
              sanitizedEvent.recurrence.rule.origOptions.count,
          });
        }

        // $FlowIgnore recurrence.rule will exist
        sanitizedEvent.recurrence.rule = transformFeRecurrenceRuleToFitBe(
          // $FlowIgnore[prop-missing]
          // $FlowIgnore[incompatible-use]
          newRule ?? sanitizedEvent.recurrence.rule
        );

        if (
          // $FlowIgnore[prop-missing] recurrence will exist
          sanitizedEvent.recurrence?.original_start_time &&
          sanitizedEvent.recurrence.recurring_event_id
        ) {
          sanitizedEvent.recurrence.scope = recurrenceChangeScope;
          if (recurrenceChangeScope === recurrenceChangeScopeEnumLike.This) {
            sanitizedEvent.recurrence.rule = null;
          }
        }
        // Ensuring that scope gets sent in recurrence object, if exists
        // $FlowIgnore[prop-missing] recurrence will exist
        if (recurrenceChangeScope && !sanitizedEvent.recurrence?.scope) {
          // $FlowIgnore[incompatible-use] recurrence will exist
          sanitizedEvent.recurrence.scope = recurrenceChangeScope;
        }
      }

      if (
        areCustomEventsOn &&
        sanitizedEvent.type === 'custom_event' &&
        window.featureFlags['staff-visibility-custom-events'] &&
        sanitizedEvent.staff_visibility &&
        sanitizedEvent.visibility_ids
      ) {
        switch (sanitizedEvent.staff_visibility) {
          case StaffVisibilityOptions.allStaff: {
            sanitizedEvent.visibility_ids = [];
            break;
          }
          case StaffVisibilityOptions.onlySelectedStaff: {
            sanitizedEvent.visibility_ids = sanitizedEvent.user_ids
              ? [...sanitizedEvent.user_ids]
              : [];
            break;
          }
          case StaffVisibilityOptions.selectedStaffAndAdditional: {
            // add the user attendees to the visibility array
            sanitizedEvent.visibility_ids =
              sanitizedEvent.visibility_ids.concat([
                ...(sanitizedEvent.user_ids || []),
              ]);
            break;
          }
          default: {
            break;
          }
        }
        delete sanitizedEvent.staff_visibility;
      }

      if (
        sanitizedEvent.type === 'game_event' &&
        sanitizedEvent.opponent_squad
      ) {
        sanitizedEvent.opponent_team = null;
      }

      // Checks if is the frontend default custom ID or if it is the same ID as the previously saved custom name.
      if (
        customOppositionNameFF &&
        sanitizedEvent.type === 'game_event' &&
        (sanitizedEvent.team_id === LOCAL_CUSTOM_OPPOSITION_OPTION_ID ||
          (sanitizedEvent.opponent_team &&
            sanitizedEvent.opponent_team.id === sanitizedEvent.team_id &&
            sanitizedEvent.opponent_team.custom))
      ) {
        sanitizedEvent.team_id = await handleCustomOppositionNameSave(
          sanitizedEvent
        );
      }

      if (sanitizedEvent.theme) {
        // $FlowIgnore
        sanitizedEvent.theme_id = sanitizedEvent.theme.id;
      }

      // We want to ensure that the send_notifications field is
      // always present in the event object, even if it is false
      if (typeof sendNotifications === 'boolean') {
        sanitizedEvent.send_notifications = sendNotifications;
      }

      saveEvent({
        event: {
          ...sanitizedEvent,
          name,
          duplicated_event_id: duplicatedEventId,
          attachments_attributes: attachmentsAttributes,
          attached_links_attributes: attachedLinksAttributes,
          event_location_id: eventLocationId,
          custom_event_type_id: customEventTypeId,
          current_calendar_month: props.calendarRef?.current
            ?.getApi()
            .getDate()
            // Sending as string to avoid conversion (Date created with
            // timestamp at 00:00:00 will cause issues when timezone is BST)
            .toString(),
        },
        skipCreatePeriod: isCustomPeriodsActive,
      })
        .then(async (savedEvent) => {
          if (customOppositionNameFF && sanitizedEvent.type === 'game_event') {
            await handleCustomOppositionNameCleanup(sanitizedEvent, savedEvent);
          }

          // Checks if custom periods have been added and if so sends off an api call to create them rather than
          // auto added and split evenly.
          if (
            isGameDetailsFeatureFlag &&
            customPeriodDurationFF &&
            props.panelMode === 'CREATE' &&
            sanitizedEvent.type === 'game_event' &&
            isCustomPeriodsActive
          ) {
            await handleNewEventWithCustomPeriods(
              customPeriods,
              +savedEvent.id
            );
          }

          if (isGameDetailsFeatureFlag && props.panelMode === 'EDIT') {
            if (
              customPeriodDurationFF &&
              sanitizedEvent.type === 'game_event' &&
              isCustomPeriodsActive
            ) {
              await handleCustomPeriodChanges(customPeriods, +savedEvent.id);
            } else {
              // Handles period changes if it is done the evenly split time between each period by default.
              await handleEvenSplitPeriodChanges(savedEvent);
            }
          }

          if (savedEvent?.attachments) {
            const unConfirmedFiles = savedEvent.attachments.filter(
              (fileObject) => fileObject.attachment.confirmed === false
            );
            if (unConfirmedFiles.length > 0) {
              await Promise.all(uploadFiles(unConfirmedFiles));
            }
          }

          if (!checkIsMounted()) return;
          setSaveRequestStatus('SUCCESS');
          setShouldShowSaveVerificationModal(false);
          props.onSaveEventSuccess?.(savedEvent);
          prepareAndTriggerTrackingEvent(savedEvent);
          props.onClose();
          if (props.redirectToEventOnClose) {
            const url = `/planning_hub/events/${savedEvent.id}`;
            if (
              ((window.getFlag('planning-tab-sessions') &&
                window.getFlag('selection-tab-displaying-in-session')) ||
                window.getFlag('duplicate-event-inside-an-event-nfl')) &&
              props.panelMode === 'DUPLICATE'
            ) {
              // locationAssign won’t work there as it uses React Router’s useNavigate
              // which doesn’t trigger full page reload and it cannot be configured to do so.
              window.location.assign(`${url}${DUPLICATED_EVENT_HASH}`);
              return;
            }
            locationAssign(url);
          }
        })
        .catch(() => {
          if (!checkIsMounted()) return;
          setSaveRequestStatus('FAILURE');
        });
    }
  };

  useEffect(() => {
    // This check is to validate missing fields required by the PML, this needs to be set before add game events.
    if (
      props.isOpen &&
      event.type === 'game_event' &&
      event.fas_game_key &&
      checkIsMounted()
    ) {
      const sanitizedEvent = sanitizeEvent(event);
      const result = getEventFormValidityResult(sanitizedEvent);

      if (result.validation) {
        setEventValidity(result.validation);
      }
      setIsValidEvent(result.isValid);
    }
  }, [props.isOpen, event]);

  const onUpdateEventStartTime: OnUpdateEventStartTime = (dateTime: string) => {
    if (!checkIsMounted()) return;

    const timeSource = moment.tz(dateTime, event.local_timezone);

    // Will already have a start time, keep its date and apply only time components of timeSource to it
    const startTimeWithTimezone = moment
      .tz(event.start_time, event.local_timezone)
      .set({
        hour: timeSource.get('hour'),
        minute: timeSource.get('minute'),
      });

    const startTimeOutput = startTimeWithTimezone.format(
      DateFormatter.dateTransferFormat
    );
    setEvent((previous: EventFormData): EventFormData => {
      const updatedEvent = sanitizeEvent({
        // $FlowIgnore[exponential-spread]
        ...previous,
        start_time: startTimeOutput,
        ...(previous.recurrence &&
          !!previous.recurrence.rule && {
            recurrence: {
              ...previous.recurrence,
              rule: regenerateRRuleWithUpdatedDateTime(
                previous.recurrence.rule,
                startTimeOutput
              ),
            },
          }),
      });
      props.onUpdatedEventTimeInfoCallback?.(updatedEvent);
      return updatedEvent;
    });
  };

  const onUpdateEventDuration: OnUpdateEventDuration = (
    duration: ?string | ?number
  ) => {
    if (!checkIsMounted()) return;

    let durationNumber: number;
    if (typeof duration === 'string' && !Number.isNaN(duration)) {
      durationNumber = parseInt(duration, 10);
    } else if (typeof duration === 'number') {
      durationNumber = duration;
    } else {
      // duration is invalid
      return;
    }
    setEvent((previous: EventFormData): EventFormData => {
      const updatedEvent = sanitizeEvent({
        ...previous,
        duration: durationNumber,
      });
      props.onUpdatedEventTimeInfoCallback?.(updatedEvent);
      return updatedEvent;
    });
  };

  const onUpdateEventDate: OnUpdateEventDate = (date: string) => {
    if (!checkIsMounted()) return;

    const startTimeWithTimezone = moment.tz(date, event.local_timezone);

    // Will already have an start time, so to update it apply only the time components to startTimeWithTimezone
    const timeSourceStartTime = moment.tz(
      event.start_time,
      event.local_timezone
    );
    startTimeWithTimezone.set({
      hour: timeSourceStartTime.get('hour'),
      minute: timeSourceStartTime.get('minute'),
      second: 0,
      millisecond: 0,
    });

    const startTimeOutput = startTimeWithTimezone.format(
      DateFormatter.dateTransferFormat
    );

    setEvent((previous: EventFormData): EventFormData => {
      const updatedEvent = sanitizeEvent({
        ...previous,
        start_time: startTimeOutput,
      });
      props.onUpdatedEventTimeInfoCallback?.(updatedEvent);
      return updatedEvent;
    });
  };

  const onUpdateEventTimezone: OnUpdateEventTimezone = (timezone: string) => {
    if (!checkIsMounted()) return;

    // We don't convert/offset the time to the new timezone
    // Instead if it was 3pm in original timezone, make the new start time 3pm in the new timezone

    // Will already have an start time and previous timezone
    const timeSourceStartTime = moment.tz(
      event.start_time,
      event.local_timezone
    );

    const startTimeWithTimezone = moment().tz(timezone);

    startTimeWithTimezone.set({
      year: timeSourceStartTime.get('year'),
      month: timeSourceStartTime.get('month'),
      date: timeSourceStartTime.get('date'),
      hour: timeSourceStartTime.get('hour'),
      minute: timeSourceStartTime.get('minute'),
      second: 0,
      millisecond: 0,
    });

    const startTimeOutput = startTimeWithTimezone.format(
      DateFormatter.dateTransferFormat
    );

    setEvent((previous: EventFormData): EventFormData => {
      const updatedEvent = sanitizeEvent({
        ...previous,
        local_timezone: timezone,
        start_time: startTimeOutput,
      });
      props.onUpdatedEventTimeInfoCallback?.(updatedEvent);
      return updatedEvent;
    });
  };

  const onUpdateEventTitle: OnUpdateEventTitle = (
    title: string,
    changeEvent: boolean
  ) => {
    if (!checkIsMounted()) return;
    setEvent((previous: EventFormData): EventFormData => {
      const updatedEvent = sanitizeEvent({ ...previous, title });
      props.onUpdatedEventTitleCallback?.(title, updatedEvent);
      if (changeEvent) {
        return updatedEvent;
      }
      return previous;
    });
  };

  const onUpdateNotificationChannels: OnUpdateEventNotificationChannels =
    useCallback(
      (notificationChannels: EventNotificationChannels | null) => {
        if (!checkIsMounted()) return;
        setEvent((previous: EventFormData): EventFormData => {
          const newEvent = { ...previous };

          if (notificationChannels) {
            newEvent.notification_channels = notificationChannels;
          } else {
            delete newEvent.notification_channels;
          }

          const updatedEvent = sanitizeEvent(newEvent);
          return updatedEvent;
        });
      },
      [checkIsMounted]
    );

  const showGameTab =
    props.panelMode === 'CREATE' ||
    (['EDIT', 'DUPLICATE'].includes(props.panelMode) &&
      eventType === creatableEventTypeEnumLike.Game);
  const showTrainingTab =
    props.panelMode === 'CREATE' ||
    (['EDIT', 'DUPLICATE'].includes(props.panelMode) &&
      eventType === creatableEventTypeEnumLike.Session);
  const showEventTab =
    window.featureFlags['custom-events'] &&
    (props.panelMode === 'CREATE' ||
      eventType === creatableEventTypeEnumLike.CustomEvent);

  const getTab = (shouldShow, value, name) => {
    return shouldShow
      ? {
          name,
          value,
        }
      : null;
  };

  const editGameText = isGameDetailsFeatureFlag
    ? props.t('Game Details')
    : props.t('Edit Game');
  const eventNames: EventNames = {
    game_event: {
      name: props.t('Game'),
      value: 'game',
      edit: isLeagueOps ? props.t('Game') : editGameText,
      duplicate: props.t('Duplicate Game'),
      create: props.t('New Game'),
      tab: getTab(showGameTab, 'game', props.t('Game')),
    },
    session_event: {
      name: props.t('Session'),
      value: 'session',
      edit: props.t('Edit Session'),
      duplicate: props.t('Duplicate Session'),
      create: props.t('New Session'),
      tab: getTab(showTrainingTab, 'training', props.t('Training')),
    },
    custom_event: {
      name: props.t('Event'),
      value: 'event',
      edit: props.t('Edit Event'),
      duplicate: props.t('Duplicate Event'),
      create: props.t('New Event'),
      tab: getTab(showEventTab, 'event', props.t('Event')),
    },
  };

  // header tabs postponed until custom events are ready
  // const showGameDetailsHeaderTabs =
  //   isGameDetailsFeatureFlag && props.panelMode === 'CREATE';
  const showGameDetailsHeaderTabs = false;

  const getTitle = (): string => {
    const mode = props.panelMode.toLowerCase();
    if (!eventType) {
      return eventNames.custom_event[mode];
    }
    if (showGameDetailsHeaderTabs) {
      return capitalize(eventNames[eventType].name);
    }
    return eventNames[eventType][mode];
  };

  const recurrenceChangeScope = isRepeatEvent
    ? recurrenceChangeScopeEnumLike.Next
    : undefined;

  const content = (
    <>
      <EventActionModal
        isOpen={shouldShowSaveVerificationModal}
        action={actionEnumLike.Edit}
        onClose={() => {
          if (!checkIsMounted()) return;
          setShouldShowSaveVerificationModal(false);
        }}
        onConfirm={attemptEventSave}
        shouldShowRepeatEventWarning={shouldShowRepeatEventWarning}
        shouldLimitScopeToNext={
          // This will only be rendered for custom_event or session_event
          // $FlowIgnore[prop-missing]
          !event.recurrence?.recurring_event_id
        }
        isSubmitting={saveRequestStatus === 'SUBMITTING'}
        eventType={eventType}
        // $FlowIgnore[incompatible-type] event.id will not be undefined at this point
        eventId={event.id}
        isRepeatEvent={getIsRepeatEvent(event)}
        shouldShowNotificationsModal={hasKeyFieldsChanged}
        isNotificationActionable={isNotificationActionable(
          notificationTriggers,
          event.notification_channels
        )}
      />
      {window.featureFlags['event-notifications'] && (
        <ConfirmationModal
          isModalOpen={
            shouldShowNotificationModal && !shouldShowSaveVerificationModal
          }
          isLoading={false}
          onConfirm={() => {
            if (!checkIsMounted()) return;
            attemptEventSave({
              recurrenceChangeScope,
              sendNotifications: true,
            });
            setShouldShowNotificationModal(false);
          }}
          onCancel={() => {
            if (!checkIsMounted()) return;
            attemptEventSave({
              recurrenceChangeScope,
              sendNotifications: false,
            });
            setShouldShowNotificationModal(false);
          }}
          onClose={() => setShouldShowNotificationModal(false)}
          translatedText={getNotificationsConfirmationModalTranslatedText()}
        />
      )}
      {showGameDetailsHeaderTabs && (
        <div css={style.segementedTitles}>
          <SegmentedControl
            width="full"
            buttons={compact([
              eventNames.custom_event.tab,
              eventNames.game_event.tab,
              eventNames.session_event.tab,
            ])}
            selectedButton={!eventType ? '' : eventNames[eventType].tab?.value}
            onClickButton={(value) => {
              if (!checkIsMounted()) return;

              if (value === eventNames.game_event.tab?.value) {
                setEventType(creatableEventTypeEnumLike.Game);
                return;
              }
              if (value === eventNames.session_event.tab?.value) {
                setEventType(creatableEventTypeEnumLike.Session);
                return;
              }
              if (value === eventNames.custom_event.tab?.value) {
                setEventType(creatableEventTypeEnumLike.CustomEvent);
              }
            }}
            minWidth={410}
          />
        </div>
      )}
      <EditEventPanelLayout
        event={event}
        panelMode={props.panelMode}
        isOpen={props.isOpen}
        eventValidity={eventValidity}
        canManageWorkload={props.canManageWorkload ?? false}
        onUpdateEventStartTime={onUpdateEventStartTime}
        onUpdateEventDuration={onUpdateEventDuration}
        onUpdateEventDate={onUpdateEventDate}
        onUpdateEventTimezone={onUpdateEventTimezone}
        onUpdateEventTitle={onUpdateEventTitle}
        onUpdateNotificationChannels={onUpdateNotificationChannels}
        onUpdateEventDetails={onUpdateEventDetails}
        onDataLoadingStatusChanged={onDataLoadingStatusChanged}
        isAttachmentsDisabled={props.isAttachmentsDisabled}
        setAdditionalMixpanelSessionData={setAdditionalMixpanelSessionData}
      />
      <div
        css={style.actionButtons}
        data-testid="PlanningEventSidePanel|ActionButtons"
      >
        <TextButton
          onClick={() => props.onClose(initialEvent.current)}
          text={props.t('Cancel')}
          type="secondary"
          kitmanDesignSystem
        />
        <TextButton
          onClick={() => {
            if (!checkIsMounted()) return;

            attemptEventSave({
              recurrenceChangeScope,
            });
          }}
          text={props.t('Save')}
          type="primary"
          isDisabled={shouldCheckEventValidity && !isValidEvent}
          kitmanDesignSystem
        />
      </div>

      {(initialDataRequestStatus === 'PENDING' ||
        saveRequestStatus === 'SUBMITTING' ||
        saveRequestStatus === 'FAILURE' ||
        dataLoadingHasErrored) && (
        <AppStatus
          status={
            saveRequestStatus === 'FAILURE' || dataLoadingHasErrored
              ? 'error'
              : 'loading'
          }
          message={
            initialDataRequestStatus === 'PENDING'
              ? `${props.t('Loading')}...`
              : null
          }
        />
      )}
    </>
  );

  return (
    <>
      {props.panelType === 'EXPANDING' && (
        <ExpandingPanel
          isOpen={props.isOpen && !shouldShowSaveVerificationModal}
          onClose={() => props.onClose(initialEvent.current)}
          title={getTitle()}
          animate
          width={460}
        >
          {content}
        </ExpandingPanel>
      )}
      {props.panelType === 'SLIDING' && (
        <SlidingPanelResponsive
          isOpen={props.isOpen && !shouldShowSaveVerificationModal}
          onClose={() => props.onClose(initialEvent.current)}
          title={getTitle()}
          width={460}
          intercomTarget="Add event - Sliding panel"
        >
          {content}
        </SlidingPanelResponsive>
      )}
    </>
  );
};

EditEventPanel.defaultProps = {
  panelType: 'SLIDING',
  defaultEventDuration: 60, // Minutes
};

export const EditEventPanelTranslated: ComponentType<Props> =
  withNamespaces()(EditEventPanel);
export default EditEventPanel;
