// @flow
import { withNamespaces } from 'react-i18next';
import type { StatusVariable } from '@kitman/common/src/types';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { MetricFormTranslated as MetricForm } from './MetricForm';
import { StatusFormTranslated as StatusForm } from './StatusForm';
import { ItemsListTranslated as ItemsList } from './ItemsList';
import type { Assessment as AssessmentType, User, ViewType } from '../../types';

type Props = {
  assessment: AssessmentType,
  selectedAthlete: number,
  users: Array<User>,
  availableOrganisationTrainingVariables: Array<OrganisationTrainingVariables>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  statusVariables: Array<StatusVariable>,
  trainingVariablesAlreadySelected: Array<number>,
  showNewMetricForm: boolean,
  showNewStatusForm: boolean,
  showReordering: boolean,
  expandedItems: Array<number>,
  viewType: ViewType,
  onClickItemHeader: Function,
  onClickSaveMetric: Function,
  onClickCloseMetricForm: Function,
  onClickSaveStatus: Function,
  onClickCloseStatusForm: Function,
  onClickCancelReordering: Function,
  onClickSaveReordering: Function,
  deleteAssessmentItem: Function,
  saveAssessmentItem: Function,
};

const IndividualAssessment = (props: I18nProps<Props>) => {
  return (
    <div className="individualAssessment">
      <ItemsList
        assessment={props.assessment}
        selectedAthlete={props.selectedAthlete}
        organisationTrainingVariables={props.organisationTrainingVariables}
        statusVariables={props.statusVariables}
        users={props.users}
        trainingVariablesAlreadySelected={
          props.trainingVariablesAlreadySelected
        }
        expandedAssessmentItems={props.expandedItems}
        deleteAssessmentItem={props.deleteAssessmentItem}
        saveAssessmentItem={props.saveAssessmentItem}
        onClickItemHeader={(assessmentItemId) =>
          props.onClickItemHeader(assessmentItemId)
        }
        showReordering={props.showReordering}
        onClickCancelReordering={props.onClickCancelReordering}
        onClickSaveReordering={(orderedItemIds) =>
          props.onClickSaveReordering(props.assessment.id, orderedItemIds)
        }
        viewType={props.viewType}
      />

      {props.showNewMetricForm && (
        <>
          <header className="individualAssessment__addMetricHeader">
            {props.t('Add metric')}
          </header>
          <MetricForm
            assessmentId={props.assessment.id}
            selectedAthlete={props.selectedAthlete}
            onClickSaveMetric={(metric) => {
              props.onClickSaveMetric(props.assessment.id, {
                item_type: 'AssessmentMetric',
                item_attributes: metric,
              });
            }}
            onClickClose={() => props.onClickCloseMetricForm()}
            users={props.users}
            organisationTrainingVariables={
              props.availableOrganisationTrainingVariables
            }
          />
        </>
      )}
      {props.showNewStatusForm && (
        <>
          <header className="individualAssessment__addStatusHeader">
            {props.t('Add status')}
          </header>
          <StatusForm
            assessmentId={props.assessment.id}
            selectedAthlete={props.selectedAthlete}
            onClickSaveStatus={(status) => {
              props.onClickSaveStatus(props.assessment.id, {
                item_type: 'AssessmentStatus',
                item_attributes: status,
              });
            }}
            onClickClose={() => props.onClickCloseStatusForm()}
            users={props.users}
            statusVariables={props.statusVariables}
          />
        </>
      )}
    </div>
  );
};

export default IndividualAssessment;
export const IndividualAssessmentTranslated =
  withNamespaces()(IndividualAssessment);
