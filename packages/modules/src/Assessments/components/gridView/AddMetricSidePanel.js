// @flow
import { useState, useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown, SlidingPanel, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import PermissionsContext from '../../contexts/PermissionsContext';

type Props = {
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  onSave: Function,
  onClose: Function,
};

const AddMetricSidePanel = (props: I18nProps<Props>) => {
  const [trainingVariableId, setTrainingVariableId] = useState(null);

  const permissions = useContext(PermissionsContext);

  const metrics = props.organisationTrainingVariables.map(
    (organisationTrainingVariable) =>
      organisationTrainingVariable.training_variable
  );

  const handleSaveClick = () => {
    if (!trainingVariableId) {
      return;
    }

    const item = {
      item_type: 'AssessmentMetric',
      item_attributes: {
        training_variable_id: trainingVariableId,
        answers: [],
      },
    };

    props.onSave(item);
    props.onClose();
  };

  const isCreatingMetricAvailable =
    props.organisationTrainingVariables.length > 0;

  return (
    <div className="assessmentsMetricSidePanel">
      <SlidingPanel
        isOpen
        title={props.t('Add metric')}
        togglePanel={() => props.onClose()}
      >
        <Dropdown
          label={props.t('Metric')}
          items={metrics}
          onChange={(value) => {
            setTrainingVariableId(value);
          }}
          value={trainingVariableId}
          name="metric_metric"
          disabled={!permissions.createAssessment || !isCreatingMetricAvailable}
          searchable
        />
        {!isCreatingMetricAvailable && (
          <p className="assessmentsMetricSidePanel__warningText">
            {props.t('All metrics are currently in use')}
          </p>
        )}
        <div className="slidingPanelActions">
          <div className="slidingPanelActions__apply">
            <TextButton
              onClick={handleSaveClick}
              type="primary"
              text={props.t('Save')}
              kitmanDesignSystem
            />
          </div>
        </div>
      </SlidingPanel>
    </div>
  );
};

export default AddMetricSidePanel;
export const AddMetricSidePanelTranslated =
  withNamespaces()(AddMetricSidePanel);
