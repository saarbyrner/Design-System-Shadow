// @flow
import { type ComponentType, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { FormattingPanelTranslated as FormattingPanel } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel';
import {
  isInjuryRiskMetricsLoading,
  hasInjuryRiskMetricsErrored,
  getThresholdByMetricFactory,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/injuryRiskMetrics';
import { fetchInjuryriskMetrics } from '@kitman/modules/src/analysis/Dashboard/redux/actions/injuryRiskMetrics';
import {
  getWidgetIdFromSidePanel,
  getChartTypeByWidgetId,
  getFormattingPanelAppliedFormat,
  getChartElementName,
  getDataSourceFormState,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  addFormattingOption,
  addFormattingRule,
  removeFormattingRule,
  addRenderOptions,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { RULE_CONFIG } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel/constants';

type Props = {
  isOpen: boolean,
  canViewMetrics: boolean,
  togglePanel: () => void,
};

const ChartFormattingPanel = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.canViewMetrics) {
      dispatch(fetchInjuryriskMetrics());
    }
  }, []);

  const appliedFormat = useSelector(getFormattingPanelAppliedFormat);
  const dataSourceFormState = useSelector(getDataSourceFormState);

  const { source, variable } = dataSourceFormState?.input_params || {};
  const keyName = `${source}|${variable}`;

  const widgetId = useSelector(getWidgetIdFromSidePanel);
  const chartType = useSelector(getChartTypeByWidgetId(widgetId));
  const chartElementName = useSelector(getChartElementName);

  const suggestedThreshold = useSelector(getThresholdByMetricFactory(keyName));
  const isSuggestedThresholdLoading = useSelector(isInjuryRiskMetricsLoading);
  const hasSuggestedThresholdErrored = useSelector(hasInjuryRiskMetricsErrored);
  const hasSuggestedThreshold = keyName.indexOf('injury_risk') > -1;

  return (
    <ErrorBoundary>
      <FormattingPanel
        isSuggestedThresholdLoading={isSuggestedThresholdLoading}
        hasSuggestedThresholdErrored={hasSuggestedThresholdErrored}
        suggestedThreshold={suggestedThreshold}
        hasSuggestedThreshold={hasSuggestedThreshold}
        appliedFormat={appliedFormat}
        panelName={chartElementName}
        ruleUnit={props.t('Value')}
        isOpen={props.isOpen}
        onAddFormattingRule={() => {
          dispatch(addFormattingRule());
        }}
        onClickSave={() => {
          dispatch(
            addRenderOptions({
              key: 'conditional_formatting',
              value: appliedFormat,
            })
          );
          props.togglePanel();
        }}
        onRemoveFormattingRule={(index) => {
          dispatch(removeFormattingRule({ index }));
        }}
        onUpdateRuleType={(value, index) => {
          dispatch(
            addFormattingOption({ key: RULE_CONFIG.type, value, index })
          );
        }}
        onUpdateRuleCondition={(value, index) => {
          dispatch(
            addFormattingOption({ key: RULE_CONFIG.condition, value, index })
          );
        }}
        onUpdateRuleValue={(value, index) => {
          dispatch(
            addFormattingOption({ key: RULE_CONFIG.value, value, index })
          );
        }}
        onUpdateRuleToFrom={(label, value, index) => {
          dispatch(addFormattingOption({ key: label, value, index }));
        }}
        onUpdateRuleColor={(value, index) => {
          dispatch(
            addFormattingOption({ key: RULE_CONFIG.color, value, index })
          );
        }}
        togglePanel={props.togglePanel}
        widgetType={chartType}
        showTextDisplay
        onUpdateTextDisplay={(value, index) => {
          dispatch(
            addFormattingOption({
              key: RULE_CONFIG.textDisplay,
              value,
              index,
            })
          );
        }}
      />
    </ErrorBoundary>
  );
};

export const ChartFormattingPanelTranslated: ComponentType<Props> =
  withNamespaces()(ChartFormattingPanel);
export default ChartFormattingPanel;
