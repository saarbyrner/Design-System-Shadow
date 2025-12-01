// @flow
import { withNamespaces } from 'react-i18next';
import { GroupedDropdown } from '@kitman/components';
import { formatAvailableVariablesForGroupedDropdown } from '@kitman/common/src/utils/formatAvailableVariables';
import type { StatusVariable } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onChange: Function,
  isDisabled?: boolean,
  value: ?string,
  availableVariables: Array<StatusVariable>,
};

export const MetricSelectorComponent = (props: I18nProps<Props>) => {
  const getSelectedVariable = (variableId): StatusVariable =>
    props.availableVariables.filter(
      (variable) => variable.source_key === variableId
    )[0];

  return (
    <div>
      <GroupedDropdown
        label={props.t('Data Source')}
        options={formatAvailableVariablesForGroupedDropdown(
          props.availableVariables
        )}
        onChange={(variable) =>
          props.onChange(getSelectedVariable(variable.key_name))
        }
        value={props.value}
        isDisabled={props.isDisabled}
        searchable
      />
    </div>
  );
};

export default withNamespaces()(MetricSelectorComponent);
