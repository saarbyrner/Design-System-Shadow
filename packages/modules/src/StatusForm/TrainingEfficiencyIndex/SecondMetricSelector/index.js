// @flow
import { withNamespaces } from 'react-i18next';
import { formatAvailableVariables } from '@kitman/common/src/utils/formatAvailableVariables';
import { Dropdown, RadioList } from '@kitman/components';
import type { StatusVariable } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onVariableChange: Function,
  onSettingsChange: Function,
  metricSourceKey: string,
  settings: Object,
  availableVariables: Array<StatusVariable>,
};

export const SecondMetricSelector = (props: I18nProps<Props>) => {
  const getSelectedVariable = (variableId): StatusVariable =>
    props.availableVariables.filter(
      (variable) => variable.source_key === variableId
    )[0];

  const secondVariableOptions = () => [
    { value: 'external', name: props.t('External load') },
    { value: 'internal', name: props.t('Internal load') },
  ];

  const handleSettingsChange = (value: string) => {
    const newSettings = Object.assign({}, props.settings, {
      second_variable: value,
    });

    props.onSettingsChange(newSettings);
  };

  return (
    <div className="statusForm__row row">
      <div className="col-sm-6">
        <Dropdown
          id="second_metric"
          onChange={(variableId) =>
            props.onVariableChange(getSelectedVariable(variableId))
          }
          label={props.t('Second Data Source')}
          items={formatAvailableVariables(props.availableVariables)}
          value={props.metricSourceKey}
          searchable
        />
      </div>

      <div className="col-sm-6 trainingEfficiencyIndexSecondMetricSelector__settings">
        <RadioList
          id="settings"
          radioName="second_variable"
          options={secondVariableOptions()}
          change={handleSettingsChange}
          value={props.settings.second_variable}
        />
      </div>
    </div>
  );
};

export const SecondMetricSelectorTranslated =
  withNamespaces()(SecondMetricSelector);
