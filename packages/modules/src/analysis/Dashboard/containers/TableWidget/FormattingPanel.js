import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import _find from 'lodash/find';
import { FormattingPanelTranslated as TableFormattingPanelComponent } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel';
import {
  addFormattingRule,
  removeFormattingRule,
  saveComparisonTableFormatting,
  saveScorecardTableFormatting,
  toggleTableFormattingPanel,
  updateFormattingRuleType,
  updateFormattingRuleCondition,
  updateFormattingRuleValue,
  updateFormattingRuleColor,
} from '../../redux/actions/tableWidget';
import {
  isInjuryRiskMetricsLoading,
  hasInjuryRiskMetricsErrored,
  getThresholdByMetricFactory,
} from '../../redux/selectors/injuryRiskMetrics';
import { fetchInjuryriskMetrics } from '../../redux/actions/injuryRiskMetrics';

const emptyColumn = {
  config: {
    conditional_formatting: [],
    summary_calculation: '',
  },
  id: 0,
  table_element: {
    data_source: {
      key_name: '',
      unit: '',
    },
  },
  name: '',
  summary: '',
  time_scope: {
    time_period: '',
  },
};

export default (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.canViewMetrics) {
      dispatch(fetchInjuryriskMetrics());
    }
  }, []);

  const isTableFormattingPanelOpen = useSelector(
    (state) => state.dashboard.isTableFormattingPanelOpen
  );
  const appliedFormat = useSelector(
    (state) => state.tableWidget.formattingPanel.appliedFormat
  );
  const panelName = useSelector(
    (state) => state.tableWidget.formattingPanel.panelName
  );
  const ruleUnit = useSelector(
    (state) => state.tableWidget.formattingPanel.ruleUnit
  );
  const tableType = useSelector((state) => state.tableWidget.tableType);

  const appliedColumn = useSelector((state) => {
    const id = state.tableWidget.formattingPanel.formattableId;
    const appliedColumns = state.tableWidget.appliedColumns;
    const column = _find(appliedColumns, { id });

    return column || emptyColumn;
  });

  const { source, variable } = appliedColumn.table_element?.data_source || {};
  const keyName = `${source}|${variable}`;

  const suggestedThreshold = useSelector(getThresholdByMetricFactory(keyName));
  const isSuggestedThresholdLoading = useSelector(isInjuryRiskMetricsLoading);
  const hasSuggestedThresholdErrored = useSelector(hasInjuryRiskMetricsErrored);
  const hasSuggestedThreshold = keyName.indexOf('injury_risk') > -1;

  return (
    <ErrorBoundary>
      <TableFormattingPanelComponent
        isSuggestedThresholdLoading={isSuggestedThresholdLoading}
        hasSuggestedThresholdErrored={hasSuggestedThresholdErrored}
        suggestedThreshold={suggestedThreshold}
        hasSuggestedThreshold={hasSuggestedThreshold}
        appliedFormat={appliedFormat}
        panelName={panelName}
        ruleUnit={ruleUnit}
        isOpen={isTableFormattingPanelOpen}
        onAddFormattingRule={() => {
          dispatch(addFormattingRule());
        }}
        widgetType={tableType}
        onClickSave={() => {
          if (tableType === 'SCORECARD') {
            dispatch(saveScorecardTableFormatting());
          } else {
            dispatch(saveComparisonTableFormatting());
          }
        }}
        onRemoveFormattingRule={(index) => {
          dispatch(removeFormattingRule(index));
        }}
        onUpdateRuleType={(type, index) => {
          dispatch(updateFormattingRuleType(type, index));
        }}
        onUpdateRuleCondition={(condition, index) => {
          dispatch(updateFormattingRuleCondition(condition, index));
        }}
        onUpdateRuleValue={(value, index) => {
          dispatch(updateFormattingRuleValue(value, index));
        }}
        onUpdateRuleColor={(color, index) => {
          dispatch(updateFormattingRuleColor(color, index));
        }}
        togglePanel={() => dispatch(toggleTableFormattingPanel())}
        {...props}
      />
    </ErrorBoundary>
  );
};
