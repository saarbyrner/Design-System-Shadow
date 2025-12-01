// @flow
import { withNamespaces } from 'react-i18next';
import {
  GroupedDropdown,
  TextButton,
  IconButton,
  InfoTooltip,
} from '@kitman/components';
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import VariableForm from '../../containers/VariableForm';
import VariableVisualisation from '../../containers/VariableVisualisation';

type Props = {
  variableOptions: Array<GroupedDropdownItem>,
  selectedDataSources: Array<string>,
  dataSources: { [string]: string },
  isVariableSaved: boolean,
  isVariablePresent: boolean,
  injuriesPresent: boolean,
  isMetricBeingCreated: boolean,
  canCreateMetric: boolean,
  canViewMetrics: boolean,
  turnaroundList: Array<Turnaround>,
  currentVariable: InjuryVariable,
  onSelectInjuryVariable: Function,
  onAddNewInjuryVariable: Function,
  onCancelEditInjuryVariable: Function,
  onSaveVariable: Function,
  buildVariableGraphs: Function,
};

const InjuryRiskMetricsTab = (props: I18nProps<Props>) => {
  return (
    <div className="riskAdvisor__content">
      {!props.canViewMetrics ? (
        <div className="riskAdvisor__noPermission">
          <p>{props.t("You don't have permission to view this page.")}</p>
        </div>
      ) : (
        <>
          <div className="riskAdvisor__sideBar">
            <div className="riskAdvisor__variablePicker">
              <GroupedDropdown
                label={props.t('Injury risk metrics')}
                options={props.variableOptions}
                onChange={(variable) =>
                  props.onSelectInjuryVariable(variable.id)
                }
                type="use_id"
                value={props.currentVariable.id}
                isDisabled={!props.isVariableSaved && props.isVariablePresent}
              />
              <IconButton
                icon="icon-add"
                onClick={() => {
                  props.onAddNewInjuryVariable();
                  props.buildVariableGraphs();
                }}
                isDisabled={
                  !props.canCreateMetric ||
                  props.isMetricBeingCreated ||
                  (!props.isVariableSaved && props.isVariablePresent)
                }
              />
            </div>
            <VariableForm
              turnaroundList={props.turnaroundList}
              isVariableSaved={props.isVariableSaved}
              selectedDataSources={props.selectedDataSources}
              dataSources={props.dataSources}
            />
          </div>
          <div className="riskAdvisor__visualisationContainer">
            <VariableVisualisation
              isVariablePresent={props.isVariablePresent}
              isVariableSaved={props.isVariableSaved}
            />
            <div className="riskAdvisor__footer">
              <TextButton
                text={props.t('Cancel')}
                type="secondary"
                onClick={() => props.onCancelEditInjuryVariable()}
                isDisabled={!props.isVariablePresent || props.isVariableSaved}
              />
              {!props.injuriesPresent ? (
                <InfoTooltip
                  placement="top-start"
                  content={props.t(
                    'You cannot save the metric without injuries present.'
                  )}
                >
                  <div>
                    <TextButton
                      text={props.t('Save')}
                      type="primary"
                      onClick={() => props.onSaveVariable()}
                      isSubmit
                      isDisabled
                    />
                  </div>
                </InfoTooltip>
              ) : (
                <TextButton
                  text={props.t('Generate')}
                  type="primary"
                  onClick={() => props.onSaveVariable()}
                  isSubmit
                  isDisabled={
                    !props.isVariablePresent ||
                    props.isVariableSaved ||
                    !props.injuriesPresent
                  }
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const InjuryRiskMetricsTabTranslated =
  withNamespaces()(InjuryRiskMetricsTab);
export default InjuryRiskMetricsTab;
