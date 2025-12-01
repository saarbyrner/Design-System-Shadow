// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import colors from '@kitman/common/src/variables/colors';
import {
  List,
  ListItemButton,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@kitman/playbook/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import { addRenderOptions } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import {
  getChartElementsByWidgetIdFactory,
  getChartElementType,
  getChartTypeByWidgetId,
  getChartElementAxisConfig,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import { type VisualisationType } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';
import {
  getAvailableVisualisationOptions,
  getPieVisualisationOptions,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';

type Props = {
  widgetId: string,
};

const styles = {
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.neutral_200,
    borderRadius: '10px',
    height: '100%',
    justifyContent: 'space-around',
  },
  listButton: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
    borderRadius: '10px',
  },
  icon: {
    color: colors.grey_200,
    padding: 0,
    marginTop: '5px',
  },
  text: {
    color: colors.grey_200,
    fontWeight: '600',
    fontSize: '14px',
  },
  selectedIcon: {
    color: colors.white,
  },
  selectedListButton: {
    backgroundColor: colors.grey_200,
    color: colors.white,
  },
  rotate: {
    transform: 'rotate(90deg)',
  },
};

const SeriesVisualisationModule = ({ widgetId, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const chartType = useSelector(getChartTypeByWidgetId(parseInt(widgetId, 10)));
  const selectedType = useSelector(getChartElementType);
  const axisConfig = useSelector(getChartElementAxisConfig);
  const chartElements = useSelector(
    getChartElementsByWidgetIdFactory(widgetId)
  );

  const visualisationOptions =
    chartType === CHART_TYPE.pie
      ? getPieVisualisationOptions()
      : getAvailableVisualisationOptions(chartElements);

  const onSetType = (value: VisualisationType) => {
    dispatch(addRenderOptions({ key: 'type', value }));
  };

  const handleAxisChange = (event) => {
    const updatedAxisValue = event.target.value;
    dispatch(
      addRenderOptions({
        key: 'axis_config',
        value: updatedAxisValue,
      })
    );
  };

  return (
    <Panel.Field>
      <List sx={styles.listContainer} disablePadding>
        {visualisationOptions.map(
          ({ label, value, icon, customIcon, styling, isEnabled }) => {
            return (
              <ListItemButton
                key={value}
                onClick={() => onSetType(value)}
                sx={[
                  styles.listButton,
                  selectedType === value && styles.selectedListButton,
                ]}
                disabled={!isEnabled}
              >
                <IconButton
                  sx={[
                    styles.icon,
                    selectedType === value && styles.selectedIcon,
                    styling && styles[styling],
                  ]}
                >
                  {icon ? (
                    <KitmanIcon name={icon} />
                  ) : (
                    <KitmanIcon customIconName={customIcon} />
                  )}
                </IconButton>

                {label}
              </ListItemButton>
            );
          }
        )}
      </List>
      {window.getFlag('rep-charts-configure-axis') && (
        <FormControl
          sx={{
            mb: 0,
            pb: 0,
            pt: 1,
          }}
        >
          <RadioGroup
            row
            value={axisConfig}
            onChange={handleAxisChange}
            sx={{
              mb: '-16px', // counteract padding from other components
              '& .MuiFormGroup-root': {
                mb: 0,
                pb: 0,
              },
            }}
          >
            <FormControlLabel
              value="left"
              label={t('Left axis')}
              control={<Radio size="small" />}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '12px',
                  color: colors.grey_200,
                  fontWeight: 500,
                  mb: 0,
                  pb: 0,
                },
              }}
            />
            <FormControlLabel
              value="right"
              label={t('Right axis')}
              control={<Radio size="small" />}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '12px',
                  color: colors.grey_200,
                  fontWeight: 500,
                  mb: 0,
                  pb: 0,
                },
              }}
            />
          </RadioGroup>
        </FormControl>
      )}
    </Panel.Field>
  );
};

export const SeriesVisualisationModuleTranslated: ComponentType<Props> =
  withNamespaces()(SeriesVisualisationModule);

export default SeriesVisualisationModule;
