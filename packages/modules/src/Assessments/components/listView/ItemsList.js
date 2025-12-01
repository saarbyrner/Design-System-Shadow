// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
import { TextButton } from '@kitman/components';
import type { StatusVariable } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import { MetricTranslated as Metric } from './Metric';
import { StatusTranslated as Status } from './Status';
import { AssessmentHeaderTranslated as AssessmentHeader } from './AssessmentHeader';
import type { Assessment, AssessmentItem, User, ViewType } from '../../types';

type Props = {
  assessment: Assessment,
  selectedAthlete: number,
  users: Array<User>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  statusVariables: Array<StatusVariable>,
  trainingVariablesAlreadySelected: Array<number>,
  expandedAssessmentItems: Array<number>,
  showReordering: boolean,
  viewType: ViewType,
  onClickItemHeader: Function,
  deleteAssessmentItem: Function,
  saveAssessmentItem: Function,
  onClickCancelReordering: Function,
  onClickSaveReordering: Function,
};

const SortableItem = SortableElement(
  (props: { ...Props, assessmentItem: AssessmentItem }) => {
    let assessmentElement = null;

    switch (props.assessmentItem.item_type) {
      case 'AssessmentMetric': {
        assessmentElement = (
          <Metric
            assessmentId={props.assessment.id}
            selectedAthlete={props.selectedAthlete}
            metric={props.assessmentItem.item}
            isCurrentSquad={props.assessment.isCurrentSquad}
            users={props.users}
            organisationTrainingVariables={props.organisationTrainingVariables}
            showNotes={props.expandedAssessmentItems.includes(
              props.assessmentItem.id
            )}
            onClickDeleteMetric={() =>
              props.deleteAssessmentItem(
                props.assessment.id,
                props.assessmentItem.id
              )
            }
            onClickSaveMetric={(editedMetric) =>
              props.saveAssessmentItem(props.assessment.id, {
                id: props.assessmentItem.id,
                item_type: 'AssessmentMetric',
                item_attributes: editedMetric,
              })
            }
            onClickMetricHeader={() =>
              props.onClickItemHeader(props.assessmentItem.id)
            }
            trainingVariablesAlreadySelected={
              props.trainingVariablesAlreadySelected
            }
            showReordering={props.showReordering}
            key={props.assessmentItem.id}
          />
        );
        break;
      }
      case 'AssessmentHeader': {
        assessmentElement = (
          <AssessmentHeader
            assessmentHeader={props.assessmentItem.item}
            isCurrentSquad={props.assessment.isCurrentSquad}
            onClickDelete={() =>
              props.deleteAssessmentItem(
                props.assessment.id,
                props.assessmentItem.id
              )
            }
            onClickSave={(assessmentHeader) =>
              props.saveAssessmentItem(props.assessment.id, {
                id: props.assessmentItem.id,
                item_type: 'AssessmentHeader',
                item_attributes: assessmentHeader,
              })
            }
            showReordering={props.showReordering}
            key={props.assessmentItem.id}
          />
        );
        break;
      }
      case 'AssessmentStatus': {
        assessmentElement = (
          <Status
            assessmentId={props.assessment.id}
            selectedAthlete={props.selectedAthlete}
            isCurrentSquad={props.assessment.isCurrentSquad}
            status={props.assessmentItem.item}
            users={props.users}
            statusVariables={props.statusVariables}
            showNotes={props.expandedAssessmentItems.includes(
              props.assessmentItem.id
            )}
            onClickDeleteStatus={() =>
              props.deleteAssessmentItem(
                props.assessment.id,
                props.assessmentItem.id
              )
            }
            onClickSaveStatus={(editedStatus) =>
              props.saveAssessmentItem(props.assessment.id, {
                id: props.assessmentItem.id,
                item_type: 'AssessmentStatus',
                item_attributes: editedStatus,
              })
            }
            onClickStatusHeader={() =>
              props.onClickItemHeader(props.assessmentItem.id)
            }
            showReordering={props.showReordering}
            key={props.assessmentItem.id}
            viewType={props.viewType}
          />
        );
        break;
      }
      default:
        return null;
    }

    return <div>{assessmentElement}</div>;
  }
);

const SortableList = SortableContainer(
  (props: { ...Props, sortedAssessmentItems: Array<AssessmentItem> }) => {
    return (
      <div>
        {props.sortedAssessmentItems.map((assessmentItem, index) => (
          <SortableItem
            {...props}
            assessmentItem={assessmentItem}
            index={index}
            key={assessmentItem.id}
          />
        ))}
      </div>
    );
  }
);

const ItemsList = (props: I18nProps<Props>) => {
  const [sortedAssessmentItems, setSortedAssessmentItems] = useState(
    props.assessment.items
  );

  useEffect(
    () => setSortedAssessmentItems(props.assessment.items),
    [props.assessment.items]
  );

  return (
    <>
      <SortableList
        {...props}
        sortedAssessmentItems={sortedAssessmentItems}
        onSortEnd={({ oldIndex, newIndex }) => {
          setSortedAssessmentItems(
            arrayMove(sortedAssessmentItems, oldIndex, newIndex)
          );
        }}
        helperContainer={document.getElementsByClassName('assessments')[0]}
        useDragHandle
      />
      {props.showReordering && (
        <footer className="assessmentItemReorderingFooter">
          <TextButton
            onClick={() => {
              setSortedAssessmentItems(props.assessment.items);
              props.onClickCancelReordering();
            }}
            text={props.t('Cancel')}
            type="secondary"
          />
          <TextButton
            onClick={() =>
              props.onClickSaveReordering(
                sortedAssessmentItems.map((item) => item.id)
              )
            }
            text={props.t('Save')}
            type="primary"
          />
        </footer>
      )}
    </>
  );
};

export default ItemsList;
export const ItemsListTranslated = withNamespaces()(ItemsList);
