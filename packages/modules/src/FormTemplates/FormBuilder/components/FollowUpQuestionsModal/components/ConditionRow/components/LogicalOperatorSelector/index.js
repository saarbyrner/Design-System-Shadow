// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import type { ElementTypes } from '@kitman/modules/src/HumanInput/types/forms';
import { Select, MenuItem } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  value: string,
  onChange: Function,
  elementType: ElementTypes,
};

const LogicalOperatorSelector = ({
  value,
  onChange,
  t,
  elementType,
}: I18nProps<Props>) => (
  <Select value={value} onChange={onChange} MenuProps={{ disablePortal: true }}>
    {/* "AND" operator only for multiple choice questions,
     * as it would not make sense to have it with questions that have a single value.  */}
    {elementType === INPUT_ELEMENTS.MultipleChoice && (
      <MenuItem value="and">{t('AND')}</MenuItem>
    )}
    <MenuItem value="or">{t('OR')}</MenuItem>
  </Select>
);

export const LogicalOperatorSelectorTranslated: ComponentType<Props> =
  withNamespaces()(LogicalOperatorSelector);
export default LogicalOperatorSelector;
