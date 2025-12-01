// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import colors from '@kitman/common/src/variables/colors';
import { FormControlLabel, Switch } from '@kitman/playbook/components';
import { updateChartConfig } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { getChartConfig } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import type { ChartWidgetType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';

const style = {
  color: colors.grey_100,
  fontSize: '12px',
  fontWeight: 600,
};

type Props = {
  widget: ChartWidgetType,
  onUpdateChartWidget: Function,
};

function DataLabelSwitch({ t, widget, onUpdateChartWidget }: I18nProps<Props>) {
  const chartId = Number(widget.chart_id);
  const dispatch = useDispatch();
  const { show_labels: showLabels } = useSelector(getChartConfig(chartId));

  const displayLabels = showLabels ?? widget.config?.show_labels ?? false;

  const onSwitch = (checked: boolean) => {
    dispatch(
      updateChartConfig({
        chartId,
        partialConfig: {
          show_labels: checked,
        },
      })
    );
    onUpdateChartWidget({ show_labels: checked });
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={displayLabels}
          onChange={() => onSwitch(!displayLabels)}
        />
      }
      label={<span css={style}>{t('Data labels')}</span>}
      labelPlacement="start"
      sx={{
        mb: 0,
      }}
    />
  );
}

export const DataLabelSwitchTranslated: ComponentType<Props> =
  withNamespaces()(DataLabelSwitch);
export default DataLabelSwitch;
