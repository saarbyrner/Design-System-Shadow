// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState } from 'react';

import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import { colors, breakPoints } from '@kitman/common/src/variables';
import type {
  Event,
  EventActivity,
  EventActivityAthlete,
  EventActivityDrill,
} from '@kitman/common/src/types/Event';
import { AppStatus, Toast } from '@kitman/components';
import type { ToastItem } from '@kitman/components/src/types';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import getActivityTypes from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import type { ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import type { PrincipleId } from '@kitman/common/src/types/Principles';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { transformFilesForUpload } from '@kitman/common/src/utils/fileHelper';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { SessionPlanningTabHeaderTranslated as SessionPlanningTabHeader } from './SessionPlanningTabHeader';
import { SessionPlanningTabGridTranslated as SessionPlanningTabGrid } from './SessionPlanningTabGrid';
import {
  ActivityPrinciplesPanelTranslated as ActivityPrinciplesPanel,
  ActivityPrinciplesMobilePanelTranslated as ActivityPrinciplesMobilePanel,
  useActivityPrinciples,
} from '../ActivityPrinciplesPanel';
import { AthleteParticipationTranslated as AthleteParticipation } from './AthleteParticipation';
import { ActivityDrillPanelTranslated as ActivityDrillPanel } from './ActivityDrillPanel';
import createEventSessionActivity from '../../services/createEventSessionActivity';
import deleteEventSessionActivity from '../../services/deleteEventSessionActivity';
import updateEventSessionActivity from '../../services/updateEventSessionActivity';
import { startFileUpload, finishFileUpload } from '../../services/fileUpload';
import updateActivityDrill from '../../services/updateActivityDrill';
import deleteActivityDrill from '../../services/deleteActivityDrill';
import {
  getPrincipleIds,
  buildActivityAttributes,
  updateActivityForAthletes,
} from './utils';
import type { PrinciplesAction, PrincipleIds } from './utils';
import type { RequestStatus, EventActivityAttributes } from '../../../types';

import PlanningTab from '../PlanningTabLayout';
import reOrderSessionActivities from '../../services/reOrderSessionActivities';

type Props = {
  event: Event,
  canEditEvent: boolean,
  canViewAvailabilities: boolean,
  participationLevels: Array<ParticipationLevel>,
  reloadData: boolean,
  areCoachingPrinciplesEnabled: boolean,
  withMetaInformation: boolean,
  onPrintSummaryOpen: Function,
  fetchEventSessionActivities: Function,
  eventSessionActivities: Array<EventActivity>,
  updateEventSessionActivities: Function,
};

const SessionPlanningTab = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('SUCCESS');
  const [selectedEventSessionActivity, setSelectedEventSessionActivity] =
    useState<EventActivity | null>(null);
  const [activityTypes, setActivityTypes] =
    useState<Array<ActivityType> | null>(null);
  const [isPrinciplesPanelOpen, setIsPrinciplesPanelOpen] = useState(false);
  const [isAthleteParticipationOpen, setIsAthleteParticipationOpen] =
    useState(false);
  const [isActivityDrillPanelOpen, setIsActivityDrillPanelOpen] =
    useState(false);
  const [editedActivity, setEditedActivity] = useState<EventActivity | null>(
    null
  );
  const [updatedActivityId, setUpdatedActivityId] = useState<number | null>(
    null
  );
  const [toastItems, setToastItems] = useState<Array<ToastItem>>([]);
  const checkIsMounted = useIsMountedCheck();

  const {
    principlesRequestStatus,
    principles,
    hasInitialPrinciples,
    hasPrincipleWithCategory,
    categories,
    hasPrincipleWithPhase,
    phases,
    types,
    draggedPrinciple,
    fetchPrinciples,
    onDragPrinciple,
    onDropPrinciple,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
    resetPrinciplesFilters,
  } = useActivityPrinciples();

  const style = {
    wrapper: {
      background: isAthleteParticipationOpen && colors.p06,
      transition: '0.2s ease-in-out',
      transitionProperty: 'margin-left',

      [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
        marginRight: isPrinciplesPanelOpen && '460px',
      },

      [`@media only screen and (max-width: ${breakPoints.tablet})`]: {
        padding: 0,
      },
    },

    desktopPrinciples: {
      [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
        display: 'none',
      },
    },

    mobilePrinciples: {
      [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
        display: 'none',
      },
    },
  };

  const setFailedStatus = () => setRequestStatus('FAILURE');

  useEffect(() => {
    getActivityTypes({ onlyForCurrentSquad: true }).then(
      (fetchedActivityTypes) => {
        setActivityTypes(fetchedActivityTypes);
      },
      () => setFailedStatus()
    );
  }, []);

  useEffect(() => {
    if (props.reloadData && checkIsMounted()) {
      setIsAthleteParticipationOpen(false);
      props.fetchEventSessionActivities();
    }
  }, [props.reloadData]);

  const onAddEventSessionActivity = () => {
    setRequestStatus('LOADING');
    setUpdatedActivityId(0); // setting the updated activity as 0 when adding a new activity
    createEventSessionActivity(props.event.id).then(
      (activity: EventActivity) => {
        setRequestStatus('SUCCESS');
        setUpdatedActivityId(null);

        props.updateEventSessionActivities([
          ...props.eventSessionActivities,
          activity,
        ]);
      },
      () => setFailedStatus()
    );
  };

  const onUpdateEventSessionActivity = (
    activityId: number,
    activityAttributes: EventActivityAttributes
  ) => {
    setRequestStatus('LOADING');
    setUpdatedActivityId(activityId);
    updateEventSessionActivity(
      props.event.id,
      activityId,
      activityAttributes
    ).then(
      (updatedActivity: EventActivity) => {
        setRequestStatus('SUCCESS');
        setUpdatedActivityId(null);
        props.updateEventSessionActivities(
          props.eventSessionActivities.map((activity) =>
            activity.id === updatedActivity.id ? updatedActivity : activity
          )
        );
      },
      () => setFailedStatus()
    );
  };

  const onReOrderSessionActivities = (
    eventId: number,
    prevSessionActivities: Array<EventActivity>,
    nextSessionActivities: Array<EventActivity>
  ) => {
    const orderedActivities = nextSessionActivities.map((i, index) => ({
      event_activity_id: i.id,
      order: index + 1,
    }));
    props.updateEventSessionActivities(nextSessionActivities);

    reOrderSessionActivities(eventId, orderedActivities).catch(() =>
      props.updateEventSessionActivities(prevSessionActivities)
    );
  };

  const confirmFileUpload = ({
    attachmentId,
    activityId,
    drill,
  }: {
    attachmentId: number,
    activityId: number,
    drill: EventActivityDrill,
  }) => {
    finishFileUpload(attachmentId).then(
      () => {
        props.updateEventSessionActivities(
          props.eventSessionActivities.map((activity) =>
            activity.id === activityId
              ? { ...activity, event_activity_drill: drill }
              : activity
          )
        );
        // the attachment ID is used as item ID when the toast item is created
        const newToastItems = [...toastItems];
        for (let index = 0; index < newToastItems.length; index++) {
          if (index === attachmentId) {
            newToastItems[index].status = 'SUCCESS';
            break;
          }
        }
        setToastItems(newToastItems);
      },
      () => {
        const newToastItems = [...toastItems];
        for (let index = 0; index < newToastItems.length; index++) {
          if (index === attachmentId) {
            newToastItems[index].status = 'ERROR';
            break;
          }
        }
        setToastItems(newToastItems);
      }
    );
  };

  const triggerFileUpload = ({
    nonUploadedFile,
    attachmentId,
    presignedPost,
    activityId,
    drill,
  }: {
    nonUploadedFile: AttachedFile,
    attachmentId: number,
    presignedPost: Object,
    activityId: number,
    drill: EventActivityDrill,
  }) => {
    startFileUpload(nonUploadedFile.file, attachmentId, presignedPost).then(
      () => {
        confirmFileUpload({ attachmentId, activityId, drill });
      },
      () => {
        const newToastItems = [...toastItems];
        for (let index = 0; index < newToastItems.length; index++) {
          if (index === attachmentId) {
            newToastItems[index].status = 'ERROR';
            break;
          }
        }
        setToastItems(newToastItems);
      }
    );
  };

  const onUpdateActivityDrill = (
    drill: EventActivityDrill,
    nonUploadedFile: ?AttachedFile,
    nonUploadedMultiFiles: Array<AttachedFile>
  ) => {
    if (!editedActivity) {
      return;
    }

    setIsActivityDrillPanelOpen(false);
    setRequestStatus('LOADING');
    setUpdatedActivityId(editedActivity.id);

    let newAttachment = [null];
    if (nonUploadedFile) {
      const attachments: Array<AttachedFile> = [nonUploadedFile];
      newAttachment = transformFilesForUpload(attachments);
    }

    const newAttachments = transformFilesForUpload(nonUploadedMultiFiles);
    const drillForRequest = {
      ...drill,
      diagram: newAttachment[0] || drill.diagram,
      attachments_attributes: [...drill.attachments, ...newAttachments],
      event_activity_drill_label_ids: drill.event_activity_drill_labels
        ? drill.event_activity_drill_labels.map((label) => label.id)
        : [],
    };

    updateActivityDrill(
      props.event.id,
      editedActivity.id,
      drillForRequest
    ).then(
      (responseDrill) => {
        let newToastItem;
        let newToastItems = [];
        const nonUploadedMultiAttachments = responseDrill.attachments.filter(
          (attachment) => attachment.confirmed === false
        );

        setRequestStatus('SUCCESS');
        setEditedActivity(null);
        setUpdatedActivityId(null);

        if (nonUploadedFile) {
          // we only allow one diagram attachment per drill
          newToastItem = {
            // $FlowFixMe the response contains the prop
            text: responseDrill.diagram.filename,
            // $FlowFixMe attachment must exist here
            subText: fileSizeLabel(responseDrill.diagram.filesize, true),
            status: 'PROGRESS',
            // $FlowFixMe the response contains the prop
            id: responseDrill.diagram.id,
          };

          setToastItems([newToastItem]);

          triggerFileUpload({
            nonUploadedFile,
            // $FlowFixMe the drill and attachment must exist at this point
            attachmentId: responseDrill.diagram.id,
            // $FlowFixMe the drill and attachment must exist at this point
            presignedPost: responseDrill.diagram.presigned_post,
            activityId: editedActivity.id,
            drill: responseDrill,
          });

          return;
        }

        if (nonUploadedMultiAttachments.length > 0) {
          // these are attachments other than the diagram (main image for drill)
          if (newToastItem) {
            newToastItems.push(newToastItem);
          }
          newToastItems = newToastItems.concat(
            responseDrill.attachments.map((file, index) => ({
              // $FlowFixMe the response contains the prop
              text: responseDrill.attachments[index].filename,
              subText: fileSizeLabel(
                responseDrill.attachments[index].filesize,
                true
              ),
              status: 'PROGRESS',
              id: responseDrill.attachments[index].id,
            }))
          );

          // $FlowIgnore items of newToastItems all have `id` field at this point.
          setToastItems(newToastItems);

          nonUploadedMultiAttachments.forEach((attachment, index) => {
            triggerFileUpload({
              nonUploadedFile: nonUploadedMultiFiles[index],
              // $FlowFixMe the drill and attachment must exist at this point
              attachmentId: attachment.id,
              presignedPost: attachment.presigned_post,
              activityId: editedActivity.id,
              drill: responseDrill,
            });
          });

          return;
        }

        props.updateEventSessionActivities(
          props.eventSessionActivities.map((activity) =>
            activity.id === editedActivity.id
              ? { ...activity, event_activity_drill: responseDrill }
              : activity
          )
        );
      },
      () => setFailedStatus()
    );
  };

  const onDeleteActivityDrill = (activityId: number) => {
    setRequestStatus('LOADING');
    setUpdatedActivityId(activityId);

    deleteActivityDrill(props.event.id, activityId).then(
      () => {
        setRequestStatus('SUCCESS');
        setUpdatedActivityId(null);
        props.updateEventSessionActivities(
          props.eventSessionActivities.map((activity) =>
            activity.id === activityId
              ? { ...activity, event_activity_drill: null }
              : activity
          )
        );
      },
      () => setFailedStatus()
    );
  };

  const onDeleteEventSessionActivity = (activityId: number) => {
    setRequestStatus('LOADING');
    setUpdatedActivityId(activityId);

    deleteEventSessionActivity(props.event.id, activityId).then(
      () => {
        setRequestStatus('SUCCESS');
        setUpdatedActivityId(null);
        props.updateEventSessionActivities(
          props.eventSessionActivities.filter(
            (activity) => activity.id !== activityId
          )
        );
      },
      () => setFailedStatus()
    );
  };

  const onUpdateActivityParticipants = (
    isSelected: boolean,
    activityId: number,
    participantId: number
  ) => {
    const activityAttributes = buildActivityAttributes(
      activityId,
      props.eventSessionActivities
    );

    if (!activityAttributes) {
      return;
    }

    const newActivityAttributes: EventActivityAttributes = {
      ...activityAttributes,
      athlete_ids: isSelected
        ? [...activityAttributes.athlete_ids, participantId]
        : activityAttributes.athlete_ids.filter(
            (athleteId) => athleteId !== participantId
          ),
    };

    onUpdateEventSessionActivity(activityId, newActivityAttributes);
  };

  const onUpdateActivityDuration = (activityId: number, duration: string) => {
    const activityAttributes = buildActivityAttributes(
      activityId,
      props.eventSessionActivities
    );

    if (!activityAttributes) {
      return;
    }

    const newActivityAttributes: EventActivityAttributes = {
      ...activityAttributes,
      duration: parseInt(duration, 10),
    };

    onUpdateEventSessionActivity(activityId, newActivityAttributes);
  };

  const updateActivityType = (activityId: number, activityTypeId: number) => {
    const activityAttributes = buildActivityAttributes(
      activityId,
      props.eventSessionActivities
    );

    if (!activityAttributes) {
      return;
    }

    const newActivityAttributes: EventActivityAttributes = {
      ...activityAttributes,
      event_activity_type_id: activityTypeId,
    };

    onUpdateEventSessionActivity(activityId, newActivityAttributes);
  };

  const onSelectAllActivityParticipants = (
    isSelected: boolean,
    activityId: number,
    participantAthletes: Array<EventActivityAthlete>,
    currentActivity: EventActivity
  ) => {
    const activityAttributes = buildActivityAttributes(
      activityId,
      props.eventSessionActivities
    );

    if (!activityAttributes) {
      return;
    }

    const updatedActivityAthleteIds = updateActivityForAthletes({
      isSelected,
      currentActivityAthletes: currentActivity.athletes,
      participantAthletes,
    });

    const newActivityAttributes: EventActivityAttributes = {
      ...activityAttributes,
      athlete_ids: updatedActivityAthleteIds,
    };

    onUpdateEventSessionActivity(activityId, newActivityAttributes);
  };

  const onUpdateActivityPrinciples = ({
    activityId,
    principleIds,
    action,
  }: {
    activityId: number,
    principleIds: PrincipleIds,
    action: PrinciplesAction,
  }) => {
    const activityAttributes = buildActivityAttributes(
      activityId,
      props.eventSessionActivities
    );

    if (
      !activityAttributes ||
      (action === 'ADD' &&
        activityAttributes.principle_ids.includes(principleIds[0]))
    ) {
      return;
    }

    const newActivityAttributes: EventActivityAttributes = {
      ...activityAttributes,
      principle_ids: getPrincipleIds({
        action,
        activityAttributes,
        principleIds,
      }),
    };

    onUpdateEventSessionActivity(activityId, newActivityAttributes);
  };

  const onShowPrinciplesPanel = (activityId = null) => {
    if (activityId) {
      const selectedActivity = props.eventSessionActivities.find(
        (eventSessionActivity) => eventSessionActivity.id === activityId
      );

      setSelectedEventSessionActivity(selectedActivity || null);
    }

    setIsPrinciplesPanelOpen(true);

    if (principlesRequestStatus === 'LOADING') {
      fetchPrinciples();
    }
  };

  const onClickAthleteParticipation = () => {
    setIsPrinciplesPanelOpen(false);
    setIsAthleteParticipationOpen(true);
  };

  const onOpenActivityDrillForm = (activity: EventActivity) => {
    setIsPrinciplesPanelOpen(false);
    setEditedActivity(activity);
    setIsActivityDrillPanelOpen(true);
  };

  const getTotalDuration = () => {
    let totalDuration = 0;
    if (props.eventSessionActivities.length > 0) {
      props.eventSessionActivities.forEach((activity) => {
        if (activity.duration !== null) {
          // $FlowFixMe duration cannot be null here
          totalDuration += activity.duration;
        }
      });
    }
    return totalDuration;
  };

  const renderContent = () => {
    if (isAthleteParticipationOpen) {
      return (
        <AthleteParticipation
          isLoading={requestStatus === 'LOADING'}
          eventId={props.event.id}
          eventType={props.event.type}
          onClose={() => setIsAthleteParticipationOpen(false)}
          participationLevels={props.participationLevels}
          canViewAvailabilities={props.canViewAvailabilities}
          activities={props.eventSessionActivities}
          onSelectParticipant={onUpdateActivityParticipants}
          onSelectAllParticipants={onSelectAllActivityParticipants}
        />
      );
    }

    return (
      <>
        <PlanningTab>
          <PlanningTab.TabHeader>
            <PlanningTab.TabTitle>
              <p>{props.t('Session planning')}</p>
              <PlanningTab.TabSubTitle>
                <span>
                  {props.t('Total duration - {{duration}} minutes', {
                    duration: getTotalDuration(),
                  })}
                </span>
              </PlanningTab.TabSubTitle>
            </PlanningTab.TabTitle>
            <PlanningTab.TabActions>
              <SessionPlanningTabHeader
                isLoading={requestStatus === 'LOADING'}
                eventId={props.event.id}
                onAddActivity={onAddEventSessionActivity}
                canEditEvent={props.canEditEvent}
                showPrinciplesPanel={onShowPrinciplesPanel}
                onClickAthleteParticipation={onClickAthleteParticipation}
                onPrintSummaryOpen={props.onPrintSummaryOpen}
                eventType={props.event.type}
              />
            </PlanningTab.TabActions>
          </PlanningTab.TabHeader>
          <PlanningTab.TabContent>
            {props.eventSessionActivities && (
              <SessionPlanningTabGrid
                eventId={props.event.id}
                isLoading={requestStatus === 'LOADING'}
                isActivityPresent={props.eventSessionActivities.length > 0}
                isDrillPanelOpen={isActivityDrillPanelOpen}
                onClickAddActivityDrill={onOpenActivityDrillForm}
                updatedActivityId={updatedActivityId}
                eventSessionActivities={props.eventSessionActivities}
                draggedPrinciple={draggedPrinciple}
                activityTypes={activityTypes}
                onClickDeleteActivity={onDeleteEventSessionActivity}
                onUpdateActivityType={updateActivityType}
                showPrinciplesPanel={onShowPrinciplesPanel}
                onUpdateActivityDuration={onUpdateActivityDuration}
                areCoachingPrinciplesEnabled={
                  props.areCoachingPrinciplesEnabled
                }
                onDropPrinciple={(
                  activityId: number,
                  principleId: PrincipleId
                ) =>
                  onUpdateActivityPrinciples({
                    activityId,
                    principleIds: [principleId],
                    action: 'ADD',
                  })
                }
                onDeletePrinciple={(
                  activityId: number,
                  principleId: PrincipleId
                ) =>
                  onUpdateActivityPrinciples({
                    activityId,
                    principleIds: [principleId],
                    action: 'DELETE',
                  })
                }
                onEditActivityDrill={onOpenActivityDrillForm}
                onDeleteActivityDrill={onDeleteActivityDrill}
                onReOrderSessionActivities={onReOrderSessionActivities}
                onClickAthleteParticipation={onClickAthleteParticipation}
              />
            )}
          </PlanningTab.TabContent>
        </PlanningTab>

        <>
          <div
            css={style.desktopPrinciples}
            className="planningEventSessionPlanningTab__principles--desktop"
          >
            <ActivityPrinciplesPanel
              isOpen={isPrinciplesPanelOpen}
              requestStatus={principlesRequestStatus}
              categories={categories}
              types={types}
              phases={phases}
              principles={principles}
              hasInitialPrinciples={hasInitialPrinciples}
              hasPrincipleWithCategory={hasPrincipleWithCategory}
              hasPrincipleWithPhase={hasPrincipleWithPhase}
              onClose={() => setIsPrinciplesPanelOpen(false)}
              onFilterPrinciplesByItem={filterPrinciplesByItem}
              onFilterPrinciplesBySearch={filterPrinciplesBySearch}
              searchPrinciplesFilterChars={searchFilterChars}
              onDragPrinciple={onDragPrinciple}
              onDropPrinciple={onDropPrinciple}
              withMetaInformation={props.withMetaInformation}
            />
          </div>
          <div
            css={style.mobilePrinciples}
            className="planningEventSessionPlanningTab__principles--mobile"
          >
            {isPrinciplesPanelOpen && selectedEventSessionActivity && (
              <ActivityPrinciplesMobilePanel
                requestStatus={principlesRequestStatus}
                categories={categories}
                types={types}
                phases={phases}
                principles={principles}
                hasInitialPrinciples={hasInitialPrinciples}
                hasPrincipleWithCategory={hasPrincipleWithCategory}
                hasPrincipleWithPhase={hasPrincipleWithPhase}
                eventSessionActivity={selectedEventSessionActivity}
                onFilterPrinciplesByItem={filterPrinciplesByItem}
                onFilterPrinciplesBySearch={filterPrinciplesBySearch}
                searchPrinciplesFilterChars={searchFilterChars}
                onSave={(principleIds) => {
                  resetPrinciplesFilters();
                  onUpdateActivityPrinciples({
                    activityId: selectedEventSessionActivity.id,
                    principleIds,
                    action: 'UPDATE',
                  });
                }}
                onClose={() => {
                  resetPrinciplesFilters();
                  setIsPrinciplesPanelOpen(false);
                }}
              />
            )}
          </div>
          <ActivityDrillPanel
            isOpen={isActivityDrillPanelOpen}
            activity={editedActivity}
            onClose={() => {
              setIsActivityDrillPanelOpen(false);
              setEditedActivity(null);
            }}
            onUpdateActivityDrill={onUpdateActivityDrill}
          />
        </>
        {requestStatus === 'FAILURE' && <AppStatus status="error" />}
      </>
    );
  };

  return (
    <div css={style.wrapper} data-testid="SessionPlanningTab|Wrapper">
      {renderContent()}
      <Toast items={toastItems} onClickClose={() => {}} />
    </div>
  );
};

export const SessionPlanningTabTranslated =
  withNamespaces()(SessionPlanningTab);
export default SessionPlanningTab;
