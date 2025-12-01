// @flow
import { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { AppStatus, TextButton, TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { StatusVariable } from '@kitman/common/src/types';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import { getGameDayPlusMinusInfo } from '@kitman/common/src/utils/workload';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { HeaderFormTranslated as HeaderForm } from './HeaderForm';
import { TemplateFormTranslated as TemplateForm } from './TemplateForm';
import { IndividualAssessmentTranslated as IndividualAssessment } from './listView/IndividualAssessment';
import { GroupedAssessmentTranslated as GroupedAssessment } from './gridView/GroupedAssessment';
import { AddMetricSidePanelTranslated as AddMetricSidePanel } from './gridView/AddMetricSidePanel';
import { AddStatusSidePanelTranslated as AddStatusSidePanel } from './gridView/AddStatusSidePanel';
import { AddAthletesSidePanelTranslated as AddAthletesSidePanel } from './gridView/AddAthletesSidePanel';
import { CommentsSidePanelTranslated as CommentsSidePanel } from './gridView/CommentsSidePanel';
import { ReorderModalTranslated as ReorderModal } from './gridView/ReorderModal';
import PermissionsContext from '../contexts/PermissionsContext';
import type {
  Assessment as AssessmentType,
  AssessmentItem,
  User,
  AssessmentTemplate,
  ViewType,
  TableMode,
  Athlete,
  CommentsViewType,
  Comments,
  GridPanelsType,
} from '../types';

type Props = {
  viewType: ViewType,
  assessment: AssessmentType,
  selectedAthlete: number,
  onClickDeleteAssessment: Function,
  deleteAssessmentItem: Function,
  saveAssessmentItem: Function,
  saveAssessmentItemComments: Function,
  saveMetricScores: Function,
  onClickEditAssessment: Function,
  onClickSaveAthletes: Function,
  onClickSaveTemplate: Function,
  onClickUpdateTemplate: Function,
  onClickSaveReordering: Function,
  onErrorCalculatingStatusValues: Function,
  fetchItemAnswers: Function,
  users: Array<User>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  statusVariables: Array<StatusVariable>,
  assessmentTemplates: Array<AssessmentTemplate>,
  isFirstAssessment: boolean,
};

const AssessmentWidget = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [showReordering, setShowReordering] = useState(false);
  const [showNewMetricForm, setShowNewMetricForm] = useState(false);
  const [showNewStatusForm, setShowNewStatusForm] = useState(false);
  const [showNewHeaderForm, setShowNewHeaderForm] = useState(false);
  const [tableMode, setTableMode] = useState<TableMode>('VIEW');
  const [isAssessmentExpanded, setIsAssessmentExpanded] = useState(
    (props.isFirstAssessment || props.assessment.items.length === 0) &&
      props.viewType === 'LIST'
  );
  const [expandedItems, setExpandedItems] = useState([]);
  const [isMetricSidePanelOpen, setIsMetricSidePanelOpen] = useState(false);
  const [isStatusSidePanelOpen, setIsStatusSidePanelOpen] = useState(false);
  const [isAthletesSidePanelOpen, setIsAthletesSidePanelOpen] = useState(false);
  const [isCommentsSidePanelOpen, setIsCommentsSidePanelOpen] = useState(false);
  const [areAnswersLoading, setAreAnswersLoading] = useState(false);
  const [commentsSidePanelView, setCommentsSidePanelView] =
    useState<CommentsViewType>('PRESENTATION');
  const [athleteLinkedToComments, setAthleteLinkedToComments] =
    useState<Athlete>({});
  const [athleteComments, setAthleteComments] = useState<Comments>([]);

  /*
    When window.featureFlags['assessments-multiple-athletes'] is false, isCurrentSquad should be always false
    because when this FF is disabled, we consume the old endpoint: /ASSESSMENTS/SEARCH that does not retrieve
    the required squad data to compare with the current squad
  */
  const isCurrentSquad =
    !window.featureFlags['assessments-multiple-athletes'] ||
    (window.featureFlags['assessments-multiple-athletes'] &&
      props.assessment.isCurrentSquad);

  const isAssessmentExpandable =
    props.assessment.items.length > 0 || props.viewType === 'GRID';

  const hasAssessmentMetricItem = props.assessment.items.some(
    (item) => item.item_type === 'AssessmentMetric'
  );

  const hasAssessmentStatusItem = props.assessment.items.some(
    (item) => item.item_type === 'AssessmentStatus'
  );

  const trainingVariablesAlreadySelected = props.assessment.items
    .filter((item) => item.item_type === 'AssessmentMetric')
    // $FlowFixMe We are sure the item is of type Metric as we filter the list
    .map((metricItem) => metricItem.item.training_variable.id);

  const availableOrganisationTrainingVariables =
    props.organisationTrainingVariables.filter(
      (organisationTrainingVariable) =>
        !trainingVariablesAlreadySelected.includes(
          organisationTrainingVariable.training_variable.id
        )
    );

  const getAthleteComments = (athleteId: number) => {
    const comments = [];

    props.assessment.items.forEach((assessmentItem) => {
      if (
        assessmentItem.item_type === 'AssessmentMetric' &&
        !(!permissions.viewProtectedMetrics && assessmentItem.item.is_protected)
      ) {
        comments.push({
          assessmentItemId: assessmentItem.id,
          assessmentItemName: assessmentItem.item.training_variable.name,
          note:
            assessmentItem.item.answers.find(
              (answer) => answer.athlete_id === athleteId
            )?.note || null,
        });
      }

      if (
        assessmentItem.item_type === 'AssessmentStatus' &&
        !(!permissions.viewProtectedMetrics && assessmentItem.item.is_protected)
      ) {
        comments.push({
          assessmentItemId: assessmentItem.id,
          assessmentItemName: assessmentItem.item.variable,
          note:
            assessmentItem.item.notes.find(
              (answer) => answer.athlete_id === athleteId
            )?.note || null,
        });
      }
    });

    return comments;
  };

  const checkExistingAnswer = (currentItem: AssessmentItem) => {
    if (
      currentItem.item_type === 'AssessmentMetric' ||
      currentItem.item_type === 'AssessmentStatus'
    ) {
      return currentItem.item.answers || currentItem.item.notes;
    }

    return false;
  };

  const checkExistingAnswers = () => {
    if (
      props.assessment.items.some((currentItem) =>
        checkExistingAnswer(currentItem)
      )
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (isCommentsSidePanelOpen) {
      setAthleteComments(getAthleteComments(athleteLinkedToComments.id));
      setCommentsSidePanelView('PRESENTATION');
    }

    if (checkExistingAnswers()) {
      setAreAnswersLoading(false);
    }
  }, [props.assessment]);

  const allowFetchItemAnswers = () => {
    if (
      (hasAssessmentMetricItem || hasAssessmentStatusItem) &&
      !isAssessmentExpanded &&
      !checkExistingAnswers()
    ) {
      return true;
    }

    return false;
  };

  const handleExpandAssessment = (origin: Object = { fromHeader: false }) => {
    if (props.viewType === 'LIST' && isAssessmentExpandable) {
      setIsAssessmentExpanded((prevShowItemList) => !prevShowItemList);
    }

    if (props.viewType === 'GRID' && isAssessmentExpandable) {
      if (allowFetchItemAnswers()) {
        setAreAnswersLoading(true);
        props.fetchItemAnswers(props.assessment.id);
      }
      setIsAssessmentExpanded((prevShowItemList) =>
        origin.fromHeader ? !prevShowItemList : true
      );
    }
  };

  const handleOpenPanel = (panel: GridPanelsType) => {
    setIsMetricSidePanelOpen(panel === 'ADD_METRIC');
    setIsStatusSidePanelOpen(panel === 'ADD_STATUS');
    setIsAthletesSidePanelOpen(panel === 'ADD_ATHLETES');
    setIsCommentsSidePanelOpen(panel === 'COMMENTS');
  };

  const handleClickAddStatus = () => {
    if (props.viewType === 'LIST') {
      setShowNewMetricForm(false);
      setIsAssessmentExpanded(true);
      setShowNewStatusForm(true);
    } else {
      setIsStatusSidePanelOpen(true);
      handleExpandAssessment();
    }
  };

  const getMenuItems = () => {
    const expandCollapseAllItem = {
      description: props.t('Expand/collapse all'),
      onClick: () => {
        setIsAssessmentExpanded(true);

        if (expandedItems.length === 0) {
          setExpandedItems(props.assessment.items.map((item) => item.id));
        } else {
          setExpandedItems([]);
        }
      },
    };

    const addSectionItem = {
      description: props.t('Add section'),
      onClick: () => {
        setShowNewHeaderForm(true);
        TrackEvent('assessments', 'click', 'add section');
        if (props.viewType === 'LIST') {
          setIsAssessmentExpanded(true);
        } else {
          handleExpandAssessment();
        }
      },
      isDisabled: !permissions.createAssessment,
    };

    const addMetricItem = {
      description: props.t('Add metric'),
      onClick: () => {
        setShowNewStatusForm(false);
        setIsAssessmentExpanded(true);
        setShowNewMetricForm(true);
        TrackEvent('assessments', 'click', 'add metric');
      },
      isDisabled: !permissions.createAssessment,
    };

    const addStatusItem = {
      description: props.t('Add status'),
      onClick: () => {
        handleClickAddStatus();
        TrackEvent('assessments', 'click', 'add status');
      },
      isDisabled: !permissions.createAssessment,
    };

    const reorderItem = {
      description: props.t('Reorder'),
      onClick: () => {
        setShowReordering(true);
        TrackEvent('assessments', 'click', 'reorder');
        if (props.viewType === 'LIST') {
          setIsAssessmentExpanded(true);
        } else {
          handleExpandAssessment();
        }
      },
      isDisabled:
        !permissions.editAssessment || props.assessment.items.length < 2,
    };

    const editAthletesItem = {
      description: props.t('Edit athletes'),
      onClick: () => {
        handleOpenPanel('ADD_ATHLETES');
        handleExpandAssessment();
      },
      isDisabled: !permissions.editAssessment || !!props.assessment.event_type,
    };

    const editDetailsItem = {
      description: props.t('Edit details'),
      onClick: () => {
        props.onClickEditAssessment();
        TrackEvent('assessments', 'click', 'edit form');
      },
      isDisabled: !permissions.editAssessment,
    };

    const updateTemplateItem = {
      description: props.t('Update template'),
      onClick: () => {
        props.onClickUpdateTemplate(
          props.assessment.id,
          props.assessmentTemplates.find(
            (template) =>
              template.id === props.assessment.assessment_template?.id
          )
        );
        TrackEvent('assessments', 'click', 'update template');
      },
      isDisabled:
        !permissions.manageAssessmentTemplate ||
        !props.assessment.assessment_template,
    };

    const createTemplateItem = {
      description: props.t('Create template'),
      onClick: () => {
        setShowTemplateForm(true);
        TrackEvent('assessments', 'click', 'create template');
      },
      isDisabled: !permissions.manageAssessmentTemplate,
    };

    const deleteItem = {
      description: props.t('Delete assessment'),
      onClick: () => {
        setShowConfirmDeletion(true);
        TrackEvent('assessments', 'click', 'delete form');
      },
      isDestructive: true,
      isDisabled:
        !permissions.deleteAssessment ||
        (props.viewType === 'LIST' && !!props.assessment.event_type),
    };

    return props.viewType === 'GRID'
      ? [
          addSectionItem,
          addStatusItem,
          reorderItem,
          editAthletesItem,
          editDetailsItem,
          updateTemplateItem,
          createTemplateItem,
          deleteItem,
        ]
      : [
          expandCollapseAllItem,
          addSectionItem,
          addMetricItem,
          addStatusItem,
          reorderItem,
          editDetailsItem,
          updateTemplateItem,
          createTemplateItem,
          deleteItem,
        ];
  };

  const getEventName = () => {
    const eventDateMoment = moment(
      window.featureFlags['assessments-multiple-athletes']
        ? props.assessment.assessment_group_date
        : props.assessment.assessment_date
    );

    const eventDate = window.featureFlags['standard-date-formatting']
      ? DateFormatter.formatStandard({ date: eventDateMoment })
      : eventDateMoment.format('D MMM YYYY');

    // When event_type does not exist, the assessment is associated to a Date
    if (
      !window.featureFlags['game-ts-assessment-area'] ||
      !props.assessment.event_type
    ) {
      return eventDate;
    }

    if (props.assessment.event_type === 'TrainingSession') {
      // $FlowFixMe session_type_name alway exists for training sessions
      const plusMinusInfo = getGameDayPlusMinusInfo(props.assessment.event);
      // $FlowFixMe session_type_name alway exists for training sessions
      const trainingSessionName = `${eventDate} - ${props.assessment.event?.session_type_name}`;

      return plusMinusInfo
        ? `${trainingSessionName} - ${getGameDayPlusMinusInfo(
            // $FlowFixMe session_type_name alway exists for training sessions
            props.assessment.event
          )}`
        : trainingSessionName;
    }

    if (props.assessment.event_type === 'Game') {
      return `${eventDate} - ${props.assessment.event.opponent_team_name}`;
    }

    return null;
  };

  const showCommentsSidePanel = (
    viewType: CommentsViewType,
    athlete: Athlete
  ) => {
    setCommentsSidePanelView(viewType);
    setAthleteLinkedToComments(athlete);
    handleOpenPanel('COMMENTS');
  };

  const areNoItemShowed =
    props.assessment.items.length === 0 &&
    props.viewType === 'LIST' &&
    !showNewMetricForm &&
    !showNewStatusForm &&
    isCurrentSquad;

  const areEditValuesAllowed =
    permissions.answerAssessment &&
    hasAssessmentMetricItem &&
    isAssessmentExpanded &&
    !areAnswersLoading &&
    props.assessment.athletes?.length > 0 &&
    isCurrentSquad;

  return (
    <div className="assessmentWidget">
      <header
        className={classnames('assessmentWidget__header', {
          'assessmentWidget__header--expandable': isAssessmentExpandable,
        })}
      >
        <div
          className="assessmentWidget__headerInfos"
          onClick={() => handleExpandAssessment({ fromHeader: true })}
        >
          <h2 className="assessmentWidget__name">{props.assessment.name}</h2>
          <div className="assessmentWidget__subtitle">
            {getEventName()}
            {props.assessment.assessment_template &&
              ` | ${props.assessment.assessment_template.name}`}
          </div>
        </div>

        {props.viewType === 'GRID' && isCurrentSquad && (
          <div className="assessmentWidget__headerBtns">
            <TextButton
              text={props.t('Edit values')}
              type="secondary"
              onClick={() => setTableMode('EDIT')}
              isDisabled={!areEditValuesAllowed}
              kitmanDesignSystem
            />
            <TextButton
              text={props.t('Add metric')}
              type="secondary"
              onClick={() => {
                handleOpenPanel('ADD_METRIC');
                handleExpandAssessment();
                TrackEvent('assessments', 'click', 'add metric');
              }}
              isDisabled={!permissions.createAssessment}
              kitmanDesignSystem
            />
          </div>
        )}

        {isCurrentSquad && (
          <TooltipMenu
            placement="bottom-start"
            offset={[0, 0]}
            menuItems={getMenuItems()}
            tooltipTriggerElement={
              <button
                type="button"
                className={classnames('assessmentWidget__dropdownMenuBtn', {
                  'assessmentWidget__dropdownMenuBtn--disabled': showReordering,
                })}
              >
                <i className="icon-more" />
              </button>
            }
            disabled={showReordering}
            kitmanDesignSystem
          />
        )}
      </header>
      {isAssessmentExpanded &&
        props.viewType === 'LIST' &&
        props.selectedAthlete != null && (
          <IndividualAssessment
            assessment={props.assessment}
            selectedAthlete={props.selectedAthlete}
            users={props.users}
            availableOrganisationTrainingVariables={
              availableOrganisationTrainingVariables
            }
            organisationTrainingVariables={props.organisationTrainingVariables}
            trainingVariablesAlreadySelected={trainingVariablesAlreadySelected}
            statusVariables={props.statusVariables}
            expandedItems={expandedItems}
            onClickSaveMetric={(assessmentId, item) => {
              setShowNewMetricForm(false);
              props.saveAssessmentItem(assessmentId, item);
            }}
            onClickSaveStatus={(assessmentId, item) => {
              setShowNewStatusForm(false);
              props.saveAssessmentItem(assessmentId, item);
            }}
            onClickCloseMetricForm={() => setShowNewMetricForm(false)}
            onClickCloseStatusForm={() => setShowNewStatusForm(false)}
            onClickCancelReordering={() => setShowReordering(false)}
            onClickSaveReordering={(assessmentId, orderedItemIds) => {
              setShowReordering(false);
              props.onClickSaveReordering(assessmentId, orderedItemIds);
            }}
            onClickItemHeader={(assessmentItemId) => {
              setExpandedItems((prevExpandedItems) => {
                if (prevExpandedItems.includes(assessmentItemId)) {
                  return prevExpandedItems.filter(
                    (itemId) => itemId !== assessmentItemId
                  );
                }
                return [...prevExpandedItems, assessmentItemId];
              });
            }}
            deleteAssessmentItem={props.deleteAssessmentItem}
            saveAssessmentItem={props.saveAssessmentItem}
            showNewMetricForm={showNewMetricForm}
            showNewStatusForm={showNewStatusForm}
            showReordering={showReordering}
            viewType="LIST"
          />
        )}

      {isAssessmentExpanded && props.viewType === 'GRID' && (
        <GroupedAssessment
          onClickViewComments={(athlete: Athlete) => {
            setAthleteComments(getAthleteComments(athlete.id));
            showCommentsSidePanel('PRESENTATION', athlete);
          }}
          assessment={props.assessment}
          organisationTrainingVariables={props.organisationTrainingVariables}
          tableMode={tableMode}
          onChangeTableMode={(currentTableMode) =>
            setTableMode(currentTableMode)
          }
          onClickAddSectionName={() => setShowNewHeaderForm(true)}
          onClickAddMetric={() => handleOpenPanel('ADD_METRIC')}
          onClickAddStatus={() => handleOpenPanel('ADD_STATUS')}
          onDeleteAssessmentItem={props.deleteAssessmentItem}
          onClickAddAthletes={() => handleOpenPanel('ADD_ATHLETES')}
          onSaveEditedScores={(scores) =>
            props.saveMetricScores(props.assessment.id, scores)
          }
          onErrorCalculatingStatusValues={props.onErrorCalculatingStatusValues}
          selectedAthleteId={athleteLinkedToComments.id}
          isCommentsSidePanelOpen={isCommentsSidePanelOpen}
          areAnswersLoading={areAnswersLoading}
          hasAssessmentStatusItem={hasAssessmentStatusItem}
        />
      )}

      {showNewHeaderForm && (
        <HeaderForm
          onClickSave={(sectionName) => {
            setShowNewHeaderForm(false);
            props.saveAssessmentItem(props.assessment.id, {
              item_type: 'AssessmentHeader',
              item_attributes: { name: sectionName },
            });
          }}
          onClickCloseModal={() => {
            setShowNewHeaderForm(false);
          }}
        />
      )}
      {areNoItemShowed && (
        <div className="assessmentWidget__noItem">
          <button
            type="button"
            className={classnames('assessmentWidget__addMetricBtn', {
              'assessmentWidget__addMetricBtn--disabled':
                !permissions.createAssessment,
            })}
            onClick={() => {
              if (!permissions.createAssessment) {
                return;
              }

              setIsAssessmentExpanded(true);
              setShowNewMetricForm(true);
              TrackEvent('assessments', 'click', 'add metric');
            }}
          >
            <i className="icon-add" />
            <div>{props.t('Add metric')}</div>
          </button>

          <button
            type="button"
            className={classnames('assessmentWidget__addStatusBtn', {
              'assessmentWidget__addStatusBtn--disabled':
                !permissions.createAssessment,
            })}
            onClick={() => {
              if (!permissions.createAssessment) {
                return;
              }

              setIsAssessmentExpanded(true);
              setShowNewStatusForm(true);
              TrackEvent('assessments', 'click', 'add status');
            }}
          >
            <i className="icon-add" />
            <div>{props.t('Add status')}</div>
          </button>

          <button
            type="button"
            className={classnames('assessmentWidget__addHeaderBtn', {
              'assessmentWidget__addHeaderBtn--disabled':
                !permissions.createAssessment,
            })}
            onClick={() => {
              if (!permissions.createAssessment) {
                return;
              }
              setIsAssessmentExpanded(true);
              setShowNewHeaderForm(true);
              TrackEvent('assessments', 'click', 'add section');
            }}
          >
            <i className="icon-widget-header" />
            <div>{props.t('Add section')}</div>
          </button>
        </div>
      )}
      {showConfirmDeletion && (
        <AppStatus
          status="warning"
          message={props.t('Delete form?')}
          secondaryMessage={props.t(
            'Deleting this form will delete all associated metrics, notes and scores.'
          )}
          deleteAllButtonText={props.t('Delete')}
          hideConfirmation={() => {
            setShowConfirmDeletion(false);
          }}
          confirmAction={() => {
            setShowConfirmDeletion(false);
            props.onClickDeleteAssessment(props.assessment.id);
          }}
        />
      )}
      {showTemplateForm && (
        <TemplateForm
          assessment={props.assessment}
          viewType={props.viewType}
          onClickClose={() => setShowTemplateForm(false)}
          onClickSubmit={(template) => {
            setShowTemplateForm(false);
            props.onClickSaveTemplate(template);
          }}
        />
      )}
      {isAthletesSidePanelOpen && (
        <AddAthletesSidePanel
          selectedAthleteIds={props.assessment.athletes.map(
            (athlete) => athlete.id
          )}
          onSave={(athletes) =>
            props.onClickSaveAthletes(props.assessment.id, athletes)
          }
          onClose={() => setIsAthletesSidePanelOpen(false)}
        />
      )}
      {isMetricSidePanelOpen && (
        <AddMetricSidePanel
          onSave={(item) => props.saveAssessmentItem(props.assessment.id, item)}
          onClose={() => setIsMetricSidePanelOpen(false)}
          organisationTrainingVariables={availableOrganisationTrainingVariables}
        />
      )}
      {isStatusSidePanelOpen && (
        <AddStatusSidePanel
          onSave={(item) => props.saveAssessmentItem(props.assessment.id, item)}
          onClose={() => setIsStatusSidePanelOpen(false)}
          statusVariables={props.statusVariables}
        />
      )}
      {isCommentsSidePanelOpen && (
        <CommentsSidePanel
          onSave={(comments) =>
            props.saveAssessmentItemComments(props.assessment.id, comments)
          }
          onClose={() => setIsCommentsSidePanelOpen(false)}
          viewType={commentsSidePanelView}
          selectedAthlete={athleteLinkedToComments}
          athletes={props.assessment.athletes}
          isCurrentSquad={isCurrentSquad}
          comments={athleteComments}
          onChangeSelectedAthlete={(selectedAthleteIndex: number) => {
            const currentAthlete =
              props.assessment.athletes[selectedAthleteIndex];

            setAthleteLinkedToComments(currentAthlete);
            setAthleteComments(getAthleteComments(currentAthlete.id));
          }}
          onChangeViewType={(viewType: CommentsViewType) =>
            setCommentsSidePanelView(viewType)
          }
        />
      )}
      {showReordering && props.viewType === 'GRID' && (
        <ReorderModal
          onSave={(orderedItemIds) =>
            props.onClickSaveReordering(props.assessment.id, orderedItemIds)
          }
          onClose={() => setShowReordering(false)}
          assessmentItems={props.assessment.items}
        />
      )}
    </div>
  );
};

export default AssessmentWidget;
export const AssessmentWidgetTranslated = withNamespaces()(AssessmentWidget);
