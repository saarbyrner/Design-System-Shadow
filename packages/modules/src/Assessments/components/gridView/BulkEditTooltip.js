// @flow

import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { ActionTooltip } from '@kitman/components';
import type {
  OrganisationTrainingVariables,
  TrainingVariable,
} from '@kitman/common/src/types/Workload';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import EditableScore from '../EditableScore';

const BulkEditTooltip = (
  props: I18nProps<{
    organisationTrainingVariables: Array<OrganisationTrainingVariables>,
    trainingVariable: TrainingVariable,
    onApply: Function,
  }>
) => {
  const [score, setScore] = useState();

  return (
    <div className="groupedAssessment__bulkEditTooltip">
      <ActionTooltip
        placement="bottom-start"
        actionSettings={{
          text: props.t('Apply'),
          onCallAction: () => props.onApply(score),
        }}
        content={
          <div className="groupedAssessmentBulkScores">
            <div className="groupedAssessmentBulkScores__label">
              {props.t('Score all')}
            </div>
            <div className="groupedAssessmentBulkScores__dropdown">
              <EditableScore
                className="groupedAssessment__editableScore"
                organisationTrainingVariables={
                  props.organisationTrainingVariables
                }
                trainingVariableId={props.trainingVariable.id}
                onChangeScore={(newValue) => setScore(newValue)}
                score={score}
              />
            </div>
          </div>
        }
        triggerElement={`${props.trainingVariable.name} ▾`}
      />
    </div>
  );
};

export default withNamespaces()(BulkEditTooltip);
