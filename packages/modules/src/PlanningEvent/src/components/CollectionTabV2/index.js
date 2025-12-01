// @flow
/* eslint-disable max-depth */
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

import i18n from '@kitman/common/src/utils/i18n';
import { type Turnaround } from '@kitman/common/src/types/Turnaround';
import { type Event } from '@kitman/common/src/types/Event';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { AppStatus, TextButton } from '@kitman/components';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import { type StatusVariable } from '@kitman/common/src/types';
import { type ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import { validateRpe } from '@kitman/common/src/utils/planningEvent';
import { type ToastDispatch } from '@kitman/components/src/types';
import { type ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import performanceAndCoachingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceAndCoaching';

import saveAssessmentDetails from '../../services/assessments';
import fetchAssessmentTrainingVariables from '../../services/fetchAssessmentTrainingVariables';
import {
  fetchNotifications,
  sendNotification,
} from '../../services/athleteNotifications';
import {
  AthleteFiltersTranslated as AthleteFilters,
  INITIAL_ATHLETE_FILTER,
} from '../AthleteFilters';
import { CollectionsTabHeaderTranslated as CollectionsTabHeader } from './CollectionsTabHeader';
import { CollectionsTabGridTranslated as CollectionsTabGrid } from './CollectionsTabGrid';
import { AddStatusSidePanelTranslated as AddStatusSidePanel } from '../GridComponents/AddStatusSidePanel';
import { AssessmentsColumnsPanelTranslated as AssessmentsColumnsPanel } from '../GridComponents/AssessmentsColumnsPanel';
import { CommentsSidePanelTranslated as CommentsSidePanel } from '../GridComponents/CommentsSidePanel';
import { ReorderColumnModalTranslated as ReorderColumnModal } from '../GridComponents/ReorderColumnModal';
import { CollectionChannelsFormTranslated as CollectionChannelsFormV1 } from './CollectionChannelsForm';
import { CollectionChannelsFormTranslated as CollectionChannelsFormV2 } from './CollectionChannelsFormV2';
import { CollectionsSidePanelTranslated as CollectionsSidePanel } from './CollectionsSidePanel';
import { SessionEvaluationTranslated as SessionEvaluation } from './SessionEvaluation';
import { SessionObjectivesTranslated as SessionObjectives } from './SessionObjectives';
import updateAttributes from '../../services/updateAttributes';
import saveGridReordering from '../../services/saveReordering';
import updateAssessmentFields from '../../services/updateAssessmentFields';
import type {
  Athlete,
  CollectionsGridData,
  Comments,
  CommentsViewType,
  SelectedGridDetails,
  AssessmentTemplate,
  AssessmentGroup,
} from '../../../types';

type Props = {
  assessmentGroups: Array<AssessmentGroup>,
  assessmentTemplates: Array<AssessmentTemplate>,
  athleteComments: Comments,
  athleteLinkedToComments: Athlete,
  canAnswerAssessment: boolean,
  canCreateAssessmentFromTemplate: boolean,
  canCreateAsssessment: boolean,
  canEditEvent: boolean,
  canViewAsssessments: boolean,
  canViewAvailabilities: boolean,
  canViewProtectedMetrics: boolean,
  clearUpdatedGridRows: Function,
  commentsPanelViewType: CommentsViewType,
  deleteColumn: Function,
  event: Event,
  fetchAssessmentGrid: Function,
  fetchAssessmentGroups: Function,
  fetchWorkloadGrid: Function,
  grid: CollectionsGridData,
  isCommentsSidePanelOpen: boolean,
  onSaveAssessmentGridAttributes: Function,
  onSaveAthleteComments: Function,
  onSaveWorkloadGridAttributes: Function,
  onSetAthleteComments: Function,
  onSetAthleteLinkedToComments: Function,
  onSetCommentsPanelViewType: Function,
  onSetIsCommentsSidePanelOpen: Function,
  onSetRequestStatus: Function,
  onSetSelectedGridDetails: Function,
  onUpdateGrid: Function,
  onUpdateGridRow: Function,
  orgTimezone: string,
  participationLevels: Array<ParticipationLevel>,
  reloadGrid: boolean,
  requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS',
  saveAssessment: Function,
  saveAssessmentColumn: Function,
  saveColumn: Function,
  selectedGridDetails: SelectedGridDetails,
  statusVariables: Array<StatusVariable>,
  toastAction: ToastDispatch<ToastAction>,
  turnaroundList: Array<Turnaround>,
  updateAssessment: Function,
};

const appHeaderHeightInPx = 50;
const planningSectionHeaderInPx = 133.5;
const tabsBarInPx = 39;
const contentMargin = 130;
const mainContentTopOffset =
  appHeaderHeightInPx + planningSectionHeaderInPx + tabsBarInPx + contentMargin;

const sidePanelWidth = '344px';
const distanceFromSidePanelTopToScreenTop = '224px';
const tabPanelMarginLeft = '20px';

const styles = {
  tableTop: {
    padding: '24px 24px 0px 24px',
  },
  tableBottom: {
    padding: '0 24px 24px 24px',
  },
  mainContentWrapper: {
    height: `calc(100vh - ${mainContentTopOffset}px)`,
    overflowY: 'scroll',
  },
  openPlanningEventGridTab: {
    marginLeft: `calc(${sidePanelWidth} - ${tabPanelMarginLeft} + 1rem) !important`,
  },
  collectionsSidePanel: {
    '.slidingPanel': {
      height: `calc(100vh - ${distanceFromSidePanelTopToScreenTop}) !important`,
    },
  },
};

// Provisional assessment groups recurrent request time
const ASSESSMENT_GROUPS_RECURRENT_REQUEST_TIME = 5000;

const CollectionTab = (props: Props) => {
  const { trackEvent } = useEventTracking();

  const [athleteFilter, setAthleteFilter] = useState(INITIAL_ATHLETE_FILTER);
  const [disableSave, setDisableSave] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [gridEdited, setGridEdited] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [rowErrors, setRowErrors] = useState([]);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [isStatusSidePanelOpen, setIsStatusSidePanelOpen] = useState(false);
  const [currentEventData, setCurrentEventData] = useState<Event>(props.event);
  // Provisional condition to open the collections panel directly
  const [isCollectionsPanelOpen, setIsCollectionsPanelOpen] = useState(
    window.getFlag('collections-side-panel')
  );
  // Provisional state to show the loader on the collections panel
  const [isCollectionsPanelLoading, setIsCollectionsPanelLoading] =
    useState(true);
  const [isReorderColumnModalOpen, setIsReorderColumnModalOpen] =
    useState(false);
  const [isCollectionChannelsPanelOpen, setIsCollectionChannelsPanelOpen] =
    useState(false);
  const [isAssessmentsColumnsPanelOpen, setIsAssessmentsColumnsPanelOpen] =
    useState(false);
  const [isSessionEvaluation, setIsSessionEvaluation] = useState(true);
  const [isSessionObjectives, setIsSessionObjectives] =
    useState<boolean>(false);
  const checkIsMounted = useIsMountedCheck();
  const [showForbiddenError, setShowForbiddenError] = useState(false);

  const isWorkloadCollectionSelected = [
    isSessionEvaluation,
    isSessionObjectives,
  ].every((condition) => !condition);

  const [organisationTrainingVariables, setOrganisationTrainingVariables] =
    useState([]);

  // Provisional assessments groups recurrent request timer
  const assessmentsGroupRecurrentRequestTimer = useRef(null);

  const getGridAthletes = () => {
    return props.grid.rows.map(({ athlete, rpe, minutes }) => {
      return {
        id: athlete?.id,
        fullname: athlete?.fullname,
        avatar_url: athlete?.avatar_url,
        rpe,
        minutes,
      };
    });
  };

  const handleRpeValidation = (rowId, rowKey, cellValue) => {
    if (props.selectedGridDetails.type !== 'DEFAULT') {
      setDisableSave(false);
    } else {
      const { error, isValid } = validateRpe(cellValue);
      const invalidRows = rowErrors.slice();
      const hasError = invalidRows.find((row) => row.id === rowId);

      // already has an error
      if (rowKey === 'rpe') {
        if (hasError) {
          // and is now valid - remove from array
          if (isValid) {
            const index = invalidRows.findIndex((row) => row.id === rowId);
            invalidRows.splice(index, 1);
          }
        }

        // does not have an error already
        if (!hasError) {
          // and not valid - add to array
          if (!isValid) {
            invalidRows.push({
              id: rowId,
              rowKey,
              message: error,
            });
          }
        }
      }

      if (invalidRows.length > 0) {
        setDisableSave(true);
      } else {
        setDisableSave(false);
      }
      setRowErrors(invalidRows);
    }
  };

  const updateRow = (attributes, rowId) => {
    setGridEdited(true);
    props.onUpdateGridRow(attributes, rowId);
  };

  const getNextAthletes = (reset = false) => {
    props.onSetRequestStatus('LOADING');
    const nextId = reset ? null : props.grid.nextId;

    if (props.selectedGridDetails.type === 'DEFAULT') {
      props.fetchWorkloadGrid(props.event.id, reset, nextId, athleteFilter);
    } else {
      props.fetchAssessmentGrid(props.event.id, reset, nextId, athleteFilter);
    }
  };

  const resetGrid = () => getNextAthletes(true);

  const getNotifications = () => {
    fetchNotifications({ eventId: props.event.id }).then(
      (data) => setNotifications(data),
      () => props.onSetRequestStatus('FAILURE')
    );
  };

  const cancelUpdate = () => {
    props.clearUpdatedGridRows();
    setEditMode(false);
    setGridEdited(false);
    resetGrid();
  };

  const updateAttributesForAllAthletes = (attributes) => {
    setEditMode(false);

    if (props.selectedGridDetails.type === 'ASSESSMENT') {
      updateAssessmentFields({
        assessmentGroupId: props.selectedGridDetails.id,
        assessmentItemId: Object.keys(attributes)[0],
        answerValue: Object.values(attributes)[0],
        filters: athleteFilter,
      }).then(
        () => {
          resetGrid();
        },
        () => props.onSetRequestStatus('FAILURE')
      );
    } else {
      updateAttributes({
        eventId: props.event.id,
        attributes,
        filters: athleteFilter,
        tab: 'collections_tab',
      }).then(
        (grid) => {
          props.onUpdateGrid(grid);
        },
        () => props.onSetRequestStatus('FAILURE')
      );
    }
  };

  const updateAttributesForSelectedAthletes = () => {
    setEditMode(false);
    if (props.selectedGridDetails.type === 'ASSESSMENT') {
      props.onSaveAssessmentGridAttributes(props.event.id);
    } else {
      props.onSaveWorkloadGridAttributes(props.event.id, 'collections_tab');
    }
    props.clearUpdatedGridRows();
    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Collection tab — ${
        isWorkloadCollectionSelected
          ? 'Workload'
          : props.selectedGridDetails.name
      } — Save`
    );
  };

  const getOrganisationTrainingVariables = () =>
    fetchAssessmentTrainingVariables().then(
      (res) => setOrganisationTrainingVariables(res),
      () => props.onSetRequestStatus('FAILURE')
    );

  const pushNotifications = () => {
    setSendingNotification(true);
    sendNotification({ eventId: props.event.id }).then(
      () => getNotifications(),
      () => props.onSetRequestStatus('FAILURE')
    );
    setSendingNotification(false);
  };

  const onFetchAssessmentGroups = () => {
    clearTimeout(assessmentsGroupRecurrentRequestTimer.current);

    props
      .fetchAssessmentGroups(props.event.id)
      .then((shouldFetchAssessmentGroups) => {
        if (shouldFetchAssessmentGroups) {
          assessmentsGroupRecurrentRequestTimer.current = setTimeout(() => {
            onFetchAssessmentGroups();
          }, ASSESSMENT_GROUPS_RECURRENT_REQUEST_TIME);
        } else {
          setIsCollectionsPanelLoading(false);
        }
      });
  };

  useEffect(() => {
    if (props.isCommentsSidePanelOpen) {
      props.onSetAthleteComments(props.athleteLinkedToComments.id);
      props.onSetCommentsPanelViewType('VIEW');
    } else {
      const gridAthletes = getGridAthletes();
      if (
        gridAthletes.length &&
        props.selectedGridDetails.type === 'ASSESSMENT'
      ) {
        props.onSetAthleteLinkedToComments(gridAthletes[0]);
      }
    }
  }, [props.grid, props.isCommentsSidePanelOpen]);

  useEffect(
    useDebouncedCallback(() => {
      if (athleteFilter !== INITIAL_ATHLETE_FILTER && checkIsMounted()) {
        resetGrid();
      }
    }, 400),
    [athleteFilter, props.event]
  );

  useEffect(
    useDebouncedCallback(() => {
      getNotifications();
      if (props.canViewAsssessments) {
        onFetchAssessmentGroups();
      } else {
        setIsCollectionsPanelLoading(false);
      }
      getOrganisationTrainingVariables();
    }, 100),
    []
  );

  useEffect(() => {
    if (props.reloadGrid && checkIsMounted()) {
      resetGrid();
    }
  }, [props.reloadGrid]);

  const planningEventGridTabClasses = classNames('planningEventGridTab', {
    'planningEventGridTab--collectionsPanelOpen': isCollectionsPanelOpen,
  });

  const getGridContent = () => {
    switch (props.requestStatus) {
      case 'FAILURE':
        return <AppStatus status="error" />;
      case 'LOADING':
      case 'SUCCESS':
        return (
          <CollectionsTabGrid
            event={currentEventData}
            collectionsGrid={props.grid}
            fetchMoreData={getNextAthletes}
            onAttributesUpdate={(attributes, athleteId) => {
              updateRow(attributes, athleteId);
            }}
            onAttributesBulkUpdate={(attributes) =>
              updateAttributesForAllAthletes(attributes)
            }
            onClickDeleteColumn={(columnId) =>
              props.deleteColumn(columnId, 'collections_tab', resetGrid, () =>
                props.onSetRequestStatus('FAILURE')
              )
            }
            onValidateCell={(rowId, rowKey, cellValue) => {
              handleRpeValidation(rowId, rowKey, cellValue);
            }}
            canViewProtectedMetrics={props.canViewProtectedMetrics}
            editMode={editMode}
            isLoading={props.requestStatus === 'LOADING'}
            isCommentsSidePanelOpen={props.isCommentsSidePanelOpen}
            rowErrors={rowErrors}
            selectedCollection={props.selectedGridDetails}
            selectedRowId={props.athleteLinkedToComments.id}
            organisationTrainingVariables={organisationTrainingVariables}
            canViewAvailabilities={props.canViewAvailabilities}
          />
        );
      default:
        return null;
    }
  };

  const getForbiddenContent = () => {
    return (
      <div className="planningEventCollectionTab__forbiddenContent">
        <div className="planningEventCollectionTab__forbiddenContentMessage">
          <span className="planningEventCollectionTab__forbiddenContentMessage--title">
            {i18n.t('Permission Required')}
          </span>
          <p className="planningEventCollectionTab__forbiddenContentMessage--description">
            {i18n.t(
              'View assessments permission is required. Please contact your administrator for permission.'
            )}
          </p>
        </div>
        <img
          className="planningEventCollectionTab__forbiddenContentMessage--image"
          src="/img/access_denied.png"
          alt="Access Denied"
        />
      </div>
    );
  };

  const shouldDisableSave = () =>
    (props.selectedGridDetails.type !== 'ASSESSMENT' && disableSave) ||
    (props.selectedGridDetails.type === 'ASSESSMENT' && !gridEdited);

  const getOrgTrainingVariables = () => {
    const columnKeys = props.grid.columns.map((column) => column.row_key);
    return organisationTrainingVariables.filter(
      (orgTrainingVar) =>
        !columnKeys.includes(orgTrainingVar.training_variable.perma_id)
    );
  };

  const displayMainContent = () => {
    if (showForbiddenError) {
      return getForbiddenContent();
    }
    if (isSessionEvaluation) {
      return (
        <SessionEvaluation
          event={props.event}
          toastAction={props.toastAction}
        />
      );
    }
    if (isSessionObjectives) {
      return (
        <SessionObjectives
          event={props.event}
          toastAction={props.toastAction}
        />
      );
    }

    return getGridContent();
  };

  const CollectionChannelsForm = window.getFlag(
    'pac-sessions-games-workload-collection-channels-rpe-option-updates'
  )
    ? CollectionChannelsFormV2
    : CollectionChannelsFormV1;

  return (
    <>
      {window.getFlag('collections-side-panel') && !isCollectionsPanelOpen && (
        <div className="collectionPanelBtn">
          <TextButton
            text="Collections"
            iconAfter="icon-next-right"
            onClick={() => setIsCollectionsPanelOpen(true)}
            type="secondary"
            kitmanDesignSystem
          />
        </div>
      )}
      <div
        className={planningEventGridTabClasses}
        css={isCollectionsPanelOpen && styles.openPlanningEventGridTab}
      >
        <>
          <div css={isWorkloadCollectionSelected && styles.tableTop}>
            {!showForbiddenError && isWorkloadCollectionSelected && (
              <CollectionsTabHeader
                event={currentEventData}
                bulkUpdateAttributes={updateAttributesForSelectedAthletes}
                cancelUpdate={cancelUpdate}
                canEditEvent={props.canEditEvent}
                canAnswerAssessment={props.canAnswerAssessment}
                disableSave={shouldDisableSave()}
                editMode={editMode}
                isGridLoading={props.requestStatus === 'LOADING'}
                onClickAddStatus={() => setIsStatusSidePanelOpen(true)}
                onClickAddAssessmentColumns={() =>
                  setIsAssessmentsColumnsPanelOpen(true)
                }
                canCreateAssessment={props.canCreateAsssessment}
                canCreateAssessmentFromTemplate={
                  props.canCreateAssessmentFromTemplate
                }
                onClickComments={() => {
                  props.onSetIsCommentsSidePanelOpen(true);
                }}
                onClickOpenCollectionChannels={() =>
                  setIsCollectionChannelsPanelOpen(true)
                }
                onClickOpenReorderColumnModal={() =>
                  setIsReorderColumnModalOpen(true)
                }
                onUpdateAssessmentGridName={(name) => {
                  saveAssessmentDetails(props.selectedGridDetails.id, name);
                }}
                setEditMode={setEditMode}
                selectedCollection={props.selectedGridDetails}
                showComments={
                  props.canViewAsssessments &&
                  props.grid.columns.filter(
                    (column) => column.default === false
                  ).length > 0
                }
                orgTimezone={props.orgTimezone}
                turnaroundList={props.turnaroundList}
                assessmentTemplates={props.assessmentTemplates}
                participationLevels={props.participationLevels}
                updateAssessment={props.updateAssessment}
                assessmentGroups={props.assessmentGroups}
                onSetSelectedGridDetails={props.onSetSelectedGridDetails}
              />
            )}
            {isWorkloadCollectionSelected && (
              <AthleteFilters
                eventType={props.event.type}
                athleteFilter={athleteFilter}
                onFilterChange={(newFilter) =>
                  setAthleteFilter((prevFilter) => ({
                    ...prevFilter,
                    ...newFilter,
                  }))
                }
                participationLevels={props.participationLevels}
                showNoneParticipationLevels
                showParticipationLevels
              />
            )}
          </div>
          <div css={styles.mainContentWrapper}>{displayMainContent()}</div>
          <div css={styles.tableBottom}>
            <div css={styles.collectionsSidePanel}>
              <CollectionsSidePanel
                assessmentGroups={props.assessmentGroups}
                setIsSessionEvaluation={setIsSessionEvaluation}
                setIsSessionObjectives={setIsSessionObjectives}
                setShowForbiddenError={setShowForbiddenError}
                event={currentEventData}
                isOpen={isCollectionsPanelOpen}
                isLoading={isCollectionsPanelLoading}
                orgTimezone={props.orgTimezone}
                setIsCollectionsPanelOpen={setIsCollectionsPanelOpen}
                canViewAssessments={props.canViewAsssessments}
                canCreateAssessment={props.canCreateAsssessment}
                canCreateAssessmentFromTemplate={
                  props.canCreateAssessmentFromTemplate
                }
                onSetSelectedGridDetails={props.onSetSelectedGridDetails}
                fetchWorkloadGrid={props.fetchWorkloadGrid}
                fetchAssessmentGrid={props.fetchAssessmentGrid}
                saveAssessment={props.saveAssessment}
                turnaroundList={props.turnaroundList}
                assessmentTemplates={props.assessmentTemplates}
                participationLevels={props.participationLevels}
                t={i18n}
              />
            </div>
            <AddStatusSidePanel
              event={currentEventData}
              isOpen={isStatusSidePanelOpen}
              onSave={(item) => {
                props.saveColumn(item, 'collections_tab', resetGrid, () =>
                  props.onSetRequestStatus('FAILURE')
                );
              }}
              onClose={() => setIsStatusSidePanelOpen(false)}
              statusVariables={props.statusVariables}
              columns={props.grid.columns}
              tab="#collection"
            />
            <CommentsSidePanel
              viewType={props.commentsPanelViewType}
              isCurrentSquad
              isOpen={props.isCommentsSidePanelOpen}
              canAnswerAssessment={props.canAnswerAssessment}
              athletes={getGridAthletes()}
              selectedAthlete={props.athleteLinkedToComments}
              comments={props.athleteComments}
              onSave={(comments) => {
                props.onSaveAthleteComments(comments);
              }}
              onClose={() => props.onSetIsCommentsSidePanelOpen(false)}
              onChangeViewType={(viewType: CommentsViewType) =>
                props.onSetCommentsPanelViewType(viewType)
              }
              onChangeSelectedAthlete={(selectedAthleteIndex: number) => {
                const currentAthlete = getGridAthletes()[selectedAthleteIndex];
                props.onSetAthleteComments(currentAthlete.id);
                props.onSetAthleteLinkedToComments(currentAthlete);
              }}
            />
            <CollectionChannelsForm
              event={currentEventData}
              isOpen={isCollectionChannelsPanelOpen}
              onClose={() => setIsCollectionChannelsPanelOpen(false)}
              notifications={notifications}
              sendNotifications={() => pushNotifications()}
              updateEventData={(eventData) => setCurrentEventData(eventData)}
              sendingNotification={sendingNotification}
            />
            <AssessmentsColumnsPanel
              isOpen={isAssessmentsColumnsPanelOpen}
              onClose={() => setIsAssessmentsColumnsPanelOpen(false)}
              onSave={(item) =>
                props.saveAssessmentColumn(
                  props.selectedGridDetails.id,
                  item,
                  'collections_tab_assessment',
                  resetGrid,
                  () => props.onSetRequestStatus('FAILURE')
                )
              }
              organisationTrainingVariables={getOrgTrainingVariables()}
              statusVariables={props.statusVariables}
            />
            {isReorderColumnModalOpen && (
              <ReorderColumnModal
                columnItems={props.grid.columns.map((column) => {
                  return { id: column.id, name: column.name };
                })}
                isOpen={isReorderColumnModalOpen}
                onSave={(orderedItemIds) => {
                  saveGridReordering(
                    props.event.id,
                    props.selectedGridDetails.id,
                    props.selectedGridDetails.id === 'default'
                      ? 'collections_tab'
                      : 'collections_tab_assessment',
                    orderedItemIds
                  ).then(
                    () => {
                      trackEvent(
                        performanceAndCoachingEventNames.columnReorderedCollectionTab
                      );
                      resetGrid();
                    },
                    () => props.onSetRequestStatus('FAILURE')
                  );
                }}
                setIsModalOpen={(isOpen) => setIsReorderColumnModalOpen(isOpen)}
              />
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default CollectionTab;
