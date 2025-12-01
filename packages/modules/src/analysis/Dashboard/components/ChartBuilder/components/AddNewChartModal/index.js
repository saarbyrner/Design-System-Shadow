// @flow
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@kitman/playbook/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isChartBuilderOpen } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  closeNewChartModal,
  beginWidgetEditMode,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { useAddChartWidgetMutation } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import { saveWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import { getDashboardLayout } from '@kitman/modules/src/analysis/Dashboard/redux/actions/dashboard';
import { getWidgets } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/dashboard';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getChartType } from '@kitman/common/src/utils/TrackingData/src/data/analysis/getChartEventData';

import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { getCoreChartTypes } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

const AVAILABLE_TYPES = ['value', 'xy', 'pie'];

const isTypeAvailable = (type) => AVAILABLE_TYPES.includes(type);

const styles = {
  chartTypeOption: {
    display: 'flex',
    gap: '8px',
  },
  chartTypeIcon: {
    fontSize: '33px',
    opacity: 0.7,
  },
};

function AddNewChartModal(props: I18nProps<{}>) {
  const dispatch = useDispatch();
  const isOpen = useSelector(isChartBuilderOpen);
  const widgets = useSelector(getWidgets);

  const chartTypes = getCoreChartTypes();
  const [chartType, setChartType] = useState<CoreChartType>('value');
  const { containerType, containerId } = useSelector((state) => ({
    containerType: state.staticData.containerType,
    containerId: state.dashboard.activeDashboard.id,
  }));
  const [addChartWidget, { isLoading, isSuccess, reset, data }] =
    useAddChartWidgetMutation();
  const { trackEvent } = useEventTracking();

  const addChart = () => {
    const name =
      chartTypes.find(({ type }) => type === chartType)?.name ||
      props.t('New Chart');
    trackEvent(reportingEventNames.addChart, getChartType({ chartType }));

    addChartWidget({
      containerType,
      containerId,
      widget: {
        type: 'chart',
        name,
        chart_type: chartType,
      },
    });
  };

  const closeBuilder = () => {
    dispatch(closeNewChartModal());
  };

  useEffect(() => {
    if (isSuccess && data) {
      reset();
      closeBuilder();
      dispatch(beginWidgetEditMode(data?.container_widget));
      dispatch(saveWidgetSuccess(data?.container_widget));
      dispatch(getDashboardLayout([...widgets, data?.container_widget]));
    }
  }, [isSuccess, data]);

  return (
    <Dialog open={isOpen} onClose={closeBuilder} fullWidth>
      <DialogTitle>
        {props.t('Select a chart type to begin with...')}
      </DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            name="radio-buttons-group"
          >
            {chartTypes.map(({ type, name, icon, muiIcon, description }) => (
              <FormControlLabel
                key={type}
                value={type}
                sx={{
                  alignItems: 'flex-start',
                }}
                control={<Radio />}
                disabled={!isTypeAvailable(type)}
                name={name}
                label={
                  <div css={styles.chartTypeOption}>
                    {icon && <i css={styles.chartTypeIcon} className={icon} />}
                    {muiIcon && (
                      <KitmanIcon name={muiIcon} sx={styles.chartTypeIcon} />
                    )}
                    <div>
                      <div>{name}</div>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        {description}
                      </Typography>
                    </div>
                  </div>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeBuilder} color="secondary" disabled={isLoading}>
          {props.t('Cancel')}
        </Button>
        <Button onClick={addChart} disabled={isLoading}>
          {props.t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const AddNewChartModalTranslated = withNamespaces()(AddNewChartModal);
export default AddNewChartModal;
