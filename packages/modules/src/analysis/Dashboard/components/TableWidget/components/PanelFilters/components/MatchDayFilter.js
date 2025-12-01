// @flow
import { useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isValidOptionLength } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import { Select } from '@kitman/components';
import Panel from '../../Panel';
import { GAMEDAY_FILTER_OPTIONS } from '../../../consts';

type IconConfig = {
  iconName: string,
  onClick: Function,
};

type Props = {
  onSelectMatchDays: Function,
  selectedMatchDays: Array<string>,
  includeIconConfig?: IconConfig,
};

function MatchDayFilter(props: I18nProps<Props>) {
  const onChange = useCallback(
    (values) => {
      props.onSelectMatchDays(values);
    },
    [props.onSelectMatchDays]
  );

  const displaySelectors = isValidOptionLength(GAMEDAY_FILTER_OPTIONS);

  return (
    <Panel.Field data-testid="MatchDayFilter|PanelField">
      <Select
        data-testid="MatchDayFilter|MatchDaySelect"
        label={props.t('Game Day +/-')}
        value={props.selectedMatchDays}
        options={GAMEDAY_FILTER_OPTIONS}
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
        customSelectStyles={fullWidthMenuCustomStyles}
      />
    </Panel.Field>
  );
}

export const MatchDayFilterTranslated = withNamespaces()(MatchDayFilter);
export default MatchDayFilter;
