// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useFetchShortRulesetsQuery } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';

import { Autocomplete } from '@kitman/playbook/components';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import type { ShortRuleset } from '@kitman/modules/src/ConditionalFields/shared/types';

type Props = {
  onChange: Function,
  selectedRulesets: Array<ShortRuleset>,
  isDisabled?: boolean,
};

const RulesetsSelect = ({
  t,
  onChange,
  selectedRulesets,
  isDisabled,
}: I18nProps<Props>) => {
  const {
    data: rulesets = [],
    isFetching,
    isError,
  } = useFetchShortRulesetsQuery();

  let options = [];
  if (Array.isArray(rulesets)) {
    options = rulesets;
  } else if (rulesets && Array.isArray(rulesets.data)) {
    options = rulesets.data;
  }

  return (
    <Autocomplete
      id="rulesets-select"
      multiple
      disableCloseOnSelect
      size="small"
      value={selectedRulesets}
      onChange={(_, value) => {
        onChange(value);
      }}
      options={options.map(({ id, name }) => ({
        id,
        label: name || `ruleset-${id}`,
      }))}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={isFetching || isError || isDisabled}
      renderOption={renderCheckboxes}
      renderInput={(params) => renderInput({ params, label: t('Rulesets') })}
    />
  );
};

export const RulesetsSelectTranslated: ComponentType<Props> =
  withNamespaces()(RulesetsSelect);
export default RulesetsSelect;
