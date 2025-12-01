// @flow
import { type ComponentType, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RowGroupingParams } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  EDIT_GROUPING_KEY,
  NO_GROUPING,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';

import Panel from '../../Panel';

type Props = {
  options: Array<{ label: string, value: string }>,
  selectedGrouping?: string,
  onSelectGroupings: (params: RowGroupingParams) => void,
  isLoading: boolean,
  isHistoric?: boolean,
};

const GroupingSelector = ({
  options,
  selectedGrouping,
  onSelectGroupings,
  isLoading,
  isHistoric = false,
  t,
}: I18nProps<Props>) => {
  const onChange = (group: string) => {
    onSelectGroupings({ [EDIT_GROUPING_KEY]: group });
  };

  useEffect(() => {
    if (isHistoric && selectedGrouping !== NO_GROUPING) {
      onChange(NO_GROUPING);
    }
  }, [isHistoric]);

  return (
    <>
      <Panel.Divider />
      <Panel.Field>
        <Select
          label={t('Group by')}
          value={selectedGrouping}
          options={options}
          onChange={onChange}
          isLoading={isLoading}
          isDisabled={isHistoric}
        />
      </Panel.Field>
    </>
  );
};

export const GroupingSelectorTranslated: ComponentType<Props> =
  withNamespaces()(GroupingSelector);
export default GroupingSelector;
