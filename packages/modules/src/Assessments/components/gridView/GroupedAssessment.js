// @flow

import { useState, useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import $ from 'jquery';
import { isColourDark } from '@kitman/common/src/utils';
import type { DataGridCell as Cell } from '@kitman/components/src/types';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DataGrid, TextButton, TooltipMenu } from '@kitman/components';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import EditableScore from '../EditableScore';
import { ColumnHeaderMenuTranslated as ColumnHeaderMenu } from './ColumnHeaderMenu';
import BulkEditTooltip from './BulkEditTooltip';
import AthleteAvatar from './AthleteAvatar';
import PermissionsContext from '../../contexts/PermissionsContext';
import type {
  Assessment,
  StatusValues,
  TableMode,
  EditedScores,
} from '../../types';

type Props = {
  assessment: Assessment,
  onClickAddSectionName: Function,
  onClickAddMetric: Function,
  onClickAddStatus: Function,
  onDeleteAssessmentItem: Function,
  onClickViewComments: Function,
  onClickAddAthletes: Function,
  onSaveEditedScores: Function,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  tableMode: TableMode,
  onChangeTableMode: Function,
  selectedAthleteId: number,
  isCommentsSidePanelOpen: boolean,
  areAnswersLoading: boolean,
  hasAssessmentStatusItem: boolean,
  onErrorCalculatingStatusValues: Function,
};

const getShowedValue = (value?: ?number) => {
  let showedValue = '';

  if (value) {
    showedValue = value;
  } else if (value === null) {
    showedValue = '-';
  }

  return showedValue;
};

const GroupedAssessment = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const [editedScores, setEditedScores] = useState<EditedScores>([]);
  const [statusValues, setStatusValues] = useState<StatusValues>({});
  const [requestStatusValues, setRequestStatusValues] = useState(null);

  const statusIds = props.assessment.items.reduce(
    (totalStatusIds, nextItem) => {
      if (nextItem.item_type === 'AssessmentStatus') {
        totalStatusIds.push(nextItem.item.id);
      }

      return totalStatusIds;
    },
    []
  );

  const isColumnHeaderMenuAllowed =
    props.tableMode === 'VIEW' &&
    permissions.editAssessment &&
    props.assessment.isCurrentSquad;

  useEffect(() => {
    if (props.hasAssessmentStatusItem) {
      setRequestStatusValues('PENDING');

      $.ajax({
        url: `/assessment_groups/${props.assessment.id}/statuses/calculate_values`,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
          ids: statusIds,
        }),
      })
        .done((data) => {
          setStatusValues(data.values);
        })
        .fail(() => {
          props.onErrorCalculatingStatusValues();
        })
        .always(() => {
          setRequestStatusValues(null);
        });
    }
  }, [props.hasAssessmentStatusItem]);

  const handleChangeScore = (
    assessmentItemId: number,
    athleteId: number,
    newValue: ?number
  ) => {
    const editedScore = {
      assessment_item_id: assessmentItemId,
      athlete_id: athleteId,
      value: newValue,
    };

    const indexScore = editedScores.findIndex(
      (score) =>
        score.assessment_item_id === assessmentItemId &&
        score.athlete_id === athleteId
    );

    if (indexScore >= 0) {
      setEditedScores((prevEditedScore) =>
        prevEditedScore.map((score, index) =>
          index === indexScore ? editedScore : score
        )
      );
    } else {
      setEditedScores((prevEditedScore) => [...prevEditedScore, editedScore]);
    }
  };

  const handleBulkEditScore = (assessmentItemId: number, newValue: ?number) => {
    const bulkEditedScores = props.assessment.athletes.map((athlete) => ({
      assessment_item_id: assessmentItemId,
      athlete_id: athlete.id,
      value: newValue,
    }));

    setEditedScores((prevEditedScore) => {
      // Remove existing score associated to this metric
      // and add the new score for this metric to all the athletes
      return [
        ...prevEditedScore.filter(
          (score) => score.assessment_item_id !== assessmentItemId
        ),
        ...bulkEditedScores,
      ];
    });
  };

  const getTableColumns = () => {
    const columns = [
      {
        id: 'AthleteNameHeaderCell',
        content: `${props.t('Athletes')} (${props.assessment.athletes.length})`,
        isHeader: true,
      },
    ];

    props.assessment.items.forEach((assessmentItem) => {
      let columnName;
      let isBolder;

      switch (assessmentItem.item_type) {
        case 'AssessmentHeader':
          columnName = assessmentItem.item.name;
          isBolder = true;
          break;
        case 'AssessmentMetric':
          columnName =
            props.tableMode === 'VIEW' ? (
              assessmentItem.item.training_variable.name
            ) : (
              <BulkEditTooltip
                organisationTrainingVariables={
                  props.organisationTrainingVariables
                }
                trainingVariable={assessmentItem.item.training_variable}
                onApply={(score) =>
                  handleBulkEditScore(assessmentItem.id, score)
                }
              />
            );
          break;
        case 'AssessmentStatus':
          columnName = assessmentItem.item.variable;
          break;
        default:
          columnName = '';
          break;
      }

      columns.push({
        id: assessmentItem.id,
        content: isColumnHeaderMenuAllowed ? (
          <ColumnHeaderMenu
            name={columnName}
            onDelete={() =>
              props.onDeleteAssessmentItem(
                props.assessment.id,
                assessmentItem.id
              )
            }
          />
        ) : (
          columnName
        ),
        isHeader: true,
        isBolder,
      });
    });

    const addItemColumn = {
      id: null,
      content: (
        <TooltipMenu
          placement="bottom-start"
          offset={[0, 0]}
          menuItems={[
            {
              description: props.t('Add section name'),
              onClick: props.onClickAddSectionName,
            },
            {
              description: props.t('Add metric'),
              onClick: props.onClickAddMetric,
            },
            {
              description: props.t('Add status'),
              onClick: props.onClickAddStatus,
            },
          ]}
          tooltipTriggerElement={
            <button
              type="button"
              className="groupedAssessment__interactiveCell"
            >
              <span className="groupedAssessment__addButtonText">+</span>
            </button>
          }
          disabled={!permissions.createAssessment}
          kitmanDesignSystem
        />
      ),
      isHeader: true,
    };

    if (props.assessment.isCurrentSquad) {
      columns.push(addItemColumn);
    }

    return columns;
  };

  const getAthleteCells = (athlete) => {
    const cells = [
      {
        id: 'athleteNameCell',
        content: (
          <AthleteAvatar
            imageUrl={athlete.avatar_url}
            name={athlete.fullname}
          />
        ),
      },
    ];

    props.assessment.items.forEach((assessmentItem) => {
      const cell: Cell = {
        id: assessmentItem.id,
        content: '',
      };

      switch (assessmentItem.item_type) {
        case 'AssessmentMetric': {
          const assessmentItemId = assessmentItem.id;

          const athleteAnswer =
            assessmentItem.item.answers?.find(
              (answer) => answer.athlete_id === athlete.id
            ) || {};

          const answerValue =
            !permissions.viewProtectedMetrics &&
            assessmentItem.item.is_protected
              ? ''
              : athleteAnswer?.value ?? '';

          const currentScore = editedScores.find(
            (editedScore) =>
              editedScore.assessment_item_id === assessmentItemId &&
              editedScore.athlete_id === athlete.id
          )?.value;

          const showedScore =
            currentScore !== undefined ? currentScore : athleteAnswer?.value;

          cell.content =
            props.tableMode === 'VIEW' ? (
              <TooltipMenu
                placement="bottom-start"
                offset={[0, 0]}
                disabled={
                  props.areAnswersLoading ||
                  (!permissions.viewProtectedMetrics &&
                    assessmentItem.item.is_protected)
                }
                menuItems={[
                  {
                    description: props.t('Edit value'),
                    onClick: () => props.onChangeTableMode('EDIT'),
                    isDisabled:
                      !permissions.answerAssessment ||
                      !props.assessment.isCurrentSquad,
                  },
                  {
                    description: props.t('View comments'),
                    onClick: () => {
                      props.onClickViewComments(athlete);
                    },
                  },
                ]}
                tooltipTriggerElement={
                  <button
                    type="button"
                    className="groupedAssessment__interactiveCell"
                  >
                    <div
                      className={classnames('groupedAssessment__metricScore', {
                        'groupedAssessment__metricScore--loading':
                          props.areAnswersLoading,
                      })}
                      style={
                        window.featureFlags['scales-colours']
                          ? {
                              backgroundColor: athleteAnswer?.colour || null,
                              color:
                                athleteAnswer?.colour &&
                                isColourDark(athleteAnswer?.colour)
                                  ? 'white'
                                  : null,
                            }
                          : {}
                      }
                    >
                      {`${answerValue}`}
                    </div>
                  </button>
                }
                kitmanDesignSystem
              />
            ) : (
              <EditableScore
                className="groupedAssessment__editableScore"
                organisationTrainingVariables={
                  props.organisationTrainingVariables
                }
                trainingVariableId={assessmentItem.item.training_variable.id}
                onChangeScore={(newValue) =>
                  handleChangeScore(assessmentItemId, athlete.id, newValue)
                }
                score={showedScore}
              />
            );
          cell.allowOverflow = props.tableMode === 'EDIT';

          break;
        }
        case 'AssessmentStatus': {
          const showedValue = getShowedValue(
            statusValues[assessmentItem.item.id]
          );

          cell.content =
            props.tableMode === 'VIEW' ? (
              <TooltipMenu
                placement="bottom-start"
                offset={[0, 0]}
                disabled={
                  props.areAnswersLoading ||
                  (!permissions.viewProtectedMetrics &&
                    assessmentItem.item.is_protected)
                }
                menuItems={[
                  {
                    description: props.t('View comments'),
                    onClick: () => {
                      props.onClickViewComments(athlete);
                    },
                  },
                ]}
                tooltipTriggerElement={
                  <button
                    type="button"
                    className="groupedAssessment__interactiveCell"
                  >
                    <div
                      className={classnames('groupedAssessment__statusValue', {
                        'groupedAssessment__statusValue--loading':
                          requestStatusValues === 'PENDING' ||
                          props.areAnswersLoading,
                      })}
                    >
                      {showedValue}
                    </div>
                  </button>
                }
                kitmanDesignSystem
              />
            ) : (
              showedValue
            );
          break;
        }
        default:
          cell.content = '';
          break;
      }

      cells.push(cell);
    });

    const addItemEmptyCell = {
      id: null,
      content: '',
    };

    cells.push(addItemEmptyCell);

    return cells;
  };

  const addAthletesCell = {
    id: null,
    content: (
      <div className="groupedAssessment__addAthletesCell">
        <TextButton
          onClick={props.onClickAddAthletes}
          type="link"
          text={props.t('Add athletes')}
          kitmanDesignSystem
          isDisabled={!permissions.editAssessment}
        />
      </div>
    ),
  };

  const getAthletesRows = () => {
    const rows =
      !props.assessment.event_type && props.assessment.athletes.length === 0
        ? [
            {
              id: null,
              cells: [addAthletesCell],
            },
          ]
        : props.assessment.athletes.map((athlete) => ({
            id: athlete.id,
            cells: getAthleteCells(athlete),
            classnames: {
              athlete__row: true,
              'athlete__row--selected':
                athlete.id === props.selectedAthleteId &&
                props.isCommentsSidePanelOpen,
              'athlete__row--notSelected':
                athlete.id !== props.selectedAthleteId &&
                props.isCommentsSidePanelOpen,
            },
          }));

    return rows;
  };

  const columns = getTableColumns();
  const rows = getAthletesRows();

  return (
    <div className="groupedAssessment">
      <DataGrid
        columns={columns}
        rows={rows}
        maxHeight="1200px"
        minHeight={
          props.tableMode === 'EDIT' ? convertPixelsToREM(300) : undefined
        }
      />

      {props.tableMode === 'EDIT' && (
        <div className="groupedAssessment__editFooter">
          <TextButton
            text={props.t('Cancel')}
            type="secondary"
            onClick={() => props.onChangeTableMode('VIEW')}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Save')}
            type="primary"
            isDisabled={editedScores.length === 0}
            onClick={() => {
              props.onChangeTableMode('VIEW');
              props.onSaveEditedScores(editedScores);
            }}
            kitmanDesignSystem
          />
        </div>
      )}
    </div>
  );
};

export default GroupedAssessment;
export const GroupedAssessmentTranslated = withNamespaces()(GroupedAssessment);
