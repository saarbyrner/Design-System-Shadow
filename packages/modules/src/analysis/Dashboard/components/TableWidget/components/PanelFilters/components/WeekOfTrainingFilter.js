// @flow
import { useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isValidOptionLength } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { getWeekOfTrainingFilterOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

import Panel from '../../Panel';

type IconConfig = {
  iconName: string,
  onClick: Function,
};

type Props = {
  isPanelOpen: boolean,
  onSelectWeekOfTraining: Function,
  selectedWeekOfTraining: Array<number>,
  noChangeOnUnload?: boolean,
  includeIconConfig?: IconConfig,
};

function WeekOfTrainingFilter(props: I18nProps<Props>) {
  const options = getWeekOfTrainingFilterOptions();

  const selectedOptions = useMemo(() => {
    return [...props.selectedWeekOfTraining];
  }, [props.selectedWeekOfTraining]);

  const onChange = (values) => {
    props.onSelectWeekOfTraining(values);
  };

  const displaySelectors = isValidOptionLength(options);

  useEffect(() => {
    return () => {
      if (!props.noChangeOnUnload) {
        onChange([]);
      }
    };
  }, [props.noChangeOnUnload]);

  return (
    <Panel.Field>
      <Select
        label={props.t('Week of Training')}
        value={selectedOptions}
        options={options}
        onChange={onChange}
        menuPosition="fixed"
        minMenuHeight={300}
        inlineShownSelectionMaxWidth={380}
        inlineShownSelection
        isMulti
        appendToBody
        labelIcon={props.includeIconConfig?.iconName}
        onClickIcon={props.includeIconConfig?.onClick}
        allowClearAll={displaySelectors}
        allowSelectAll={displaySelectors}
        selectAllGroups
        hideOnSearch
      />
    </Panel.Field>
  );
}

export const WeekOfTrainingFilterTranslated =
  withNamespaces()(WeekOfTrainingFilter);
export default WeekOfTrainingFilter;
