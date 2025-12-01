// @flow
import { type ComponentType, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Chip, IconButton, Typography } from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import colors from '@kitman/common/src/variables/colors';
import { useGetAllGroupingsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import {
  addDataType,
  closeDataSourcePanel,
  editDataType,
  setAllGroupings,
  addRenderOptions,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { sortChartElements } from '@kitman/modules/src/analysis/Dashboard/components/Chart/utils';
import { CHART_ELEMENT_ERROR } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import { openTableColumnFormulaPanel } from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import { setupFormulaPanel } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import {
  getGroupings,
  getWidgetByIdFactory,
  getWidgetIdFromSidePanel,
  isDataSourcePanelOpen,
  getPreviewData,
  getWidgetDataWithPreviewData,
  getChartTypeByWidgetId,
  getChartElementsByWidgetIdFactory,
  getDataSourceFormState,
  getChartConfig,
  getSidePanelSource,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  type TableWidgetDataSource,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { INHERIT_GROUPING } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { getMatchingFormulaId } from '@kitman/modules/src/analysis/shared/utils';
import { dataSourceMenuItems } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/SourceSelector/constants';
import type { ChartElement } from '@kitman/modules/src/analysis/shared/types/charts';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import {
  getChartDataSource,
  getChartTypeLabel,
} from '@kitman/common/src/utils/TrackingData/src/data/analysis/getChartEventData';

import { SourceSelectorTranslated as SourceSelector } from '../TableWidget/components/SourceSelector';
import { ChartTranslated as Chart } from '../Chart';
import { DataSourceSidePanelTranslated as DataSourceSidePanel } from './components/DataSourceSidePanel';
import {
  formatFormulaDetails,
  getDefaultSeriesType,
  getPieDefaultSeriesType,
  isAddDataEnabled,
  synchronizeChartGrouping,
  getDefaultAxisConfig,
} from './utils';

const styles = {
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
  },
  chip: {
    padding: '5px 10px',
  },
  text: {
    margin: '10px 0 10px 10px',
    color: colors.grey_200,
    fontWeight: '600',
    fontSize: '14px',
  },
  addDataCta: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'fit-content',
    padding: '5px 10px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  icon: {
    color: colors.grey_200,
    fontSize: 'large',
    textAlign: 'center',
    padding: '2px',
    opacity: '0.75',
  },
  chipInvalid: {
    backgroundColor: colors.neutral_200,
    color: colors.grey_100_50,
  },
};

type Props = {
  widgetId: number,
};

function ChartBuilder({ widgetId, t }: I18nProps<Props>) {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const activeWidgetData = useSelector(getWidgetByIdFactory(widgetId));
  const previewData = useSelector(getPreviewData);
  const isSidePanelOpen = useSelector(isDataSourcePanelOpen);
  const editWidgetId = useSelector(getWidgetIdFromSidePanel);
  const groupings = useSelector(getGroupings);
  const chartType = useSelector(getChartTypeByWidgetId(widgetId));
  const chartElements = useSelector(
    getChartElementsByWidgetIdFactory(String(widgetId))
  );
  const isValueChart = chartType === CHART_TYPE.value;
  const sidePanelSource = useSelector(getSidePanelSource);

  const { invalid_chart_elements: invalidChartElementMap } = useSelector(
    getChartConfig(activeWidgetData?.widget.chart_id)
  );
  const dataSourceFormState = useSelector(getDataSourceFormState);

  const { data } = useGetAllGroupingsQuery(undefined, {
    skip: isValueChart,
  });

  useEffect(() => {
    if (data && !groupings) {
      dispatch(setAllGroupings(data));
    }
  }, [data, groupings]);

  const widgetWithPreviewData = useSelector(
    getWidgetDataWithPreviewData(editWidgetId)
  );

  const openFormulaSidePanel = (formulaElement) => {
    dispatch(setupFormulaPanel(formulaElement));
    dispatch(openTableColumnFormulaPanel());
  };

  const onAddDataType = (
    source: TableWidgetDataSource,
    sourceSubtypeId?: number
  ) => {
    dispatch(
      addDataType({
        source,
        widgetId: `${widgetId}`,
        chartId: activeWidgetData.widget.chart_id,
      })
    );

    if (source === TABLE_WIDGET_DATA_SOURCES.formula) {
      openFormulaSidePanel({
        formulaId: sourceSubtypeId,
        widgetId,
        widgetType: chartType,
        ...(chartType === CHART_TYPE.xy && {
          inheritGroupings: INHERIT_GROUPING.yes,
        }),
      });
    }

    if (chartType === CHART_TYPE.xy) {
      const defaultSeriesType = getDefaultSeriesType(chartElements);
      dispatch(addRenderOptions({ key: 'type', value: defaultSeriesType }));

      const defaultAxisConfig = getDefaultAxisConfig(chartElements);
      dispatch(
        addRenderOptions({ key: 'axis_config', value: defaultAxisConfig })
      );
    }

    if (chartType === CHART_TYPE.pie) {
      const defaultPieType = getPieDefaultSeriesType();
      dispatch(addRenderOptions({ key: 'type', value: defaultPieType }));
    }

    trackEvent(
      getChartTypeLabel({
        chartType,
      }),
      getChartDataSource({ source, sourceSubtypeId })
    );
  };

  const onEditDataType = (element: ChartElement) => {
    dispatch(
      editDataType({
        widgetId: `${widgetId}`,
        chartId: activeWidgetData.widget.chart_id,
        chart_element: element,
      })
    );

    if (element?.calculation === TABLE_WIDGET_DATA_SOURCES.formula) {
      const formulaId = getMatchingFormulaId(element.config?.formula);

      if (formulaId == null) {
        return;
      }

      const columnDetails = formatFormulaDetails(element);
      openFormulaSidePanel({
        formulaId,
        widgetId,
        widgetType: chartType,
        columnDetails,
        ...(chartType === CHART_TYPE.xy && {
          inheritGroupings: element?.config?.inherit_groupings,
        }),
      });
    }
  };

  const closeSidePanel = () => dispatch(closeDataSourcePanel());

  const isEmpty =
    !activeWidgetData.widget?.chart_elements ||
    activeWidgetData.widget.chart_elements.length === 0;

  const getChartData = () => {
    if (previewData && `${activeWidgetData.id}` === `${editWidgetId}`) {
      /**
       * To Preview, validate the chart elements
       */

      /*
      Synchronize chart grouping only if the primary grouping matches between preview data and form state
      to prevent re-rendering with outdated grouping.
    */
      const isPrimaryGroupingMatching =
        previewData.config?.groupings?.[0] ===
        dataSourceFormState.config?.groupings?.[0];

      if (!isValueChart && isPrimaryGroupingMatching) {
        widgetWithPreviewData.widget.chart_elements = synchronizeChartGrouping(
          widgetWithPreviewData,
          dataSourceFormState,
          invalidChartElementMap
        ).filter(
          (item) =>
            !invalidChartElementMap?.[item.id]?.includes(
              CHART_ELEMENT_ERROR.INVALID_GROUPING
            )
        );
      }

      return widgetWithPreviewData;
    }

    return activeWidgetData;
  };

  const isAddDataButtonEnabled = isAddDataEnabled(
    chartType,
    activeWidgetData.widget.chart_elements
  );

  return (
    <>
      <Box css={styles.buttonContainer}>
        {isAddDataButtonEnabled && (
          <SourceSelector
            data-testid="ComparisonTable|SourceSelector"
            menuItems={dataSourceMenuItems}
            placement="bottom-start"
            widgetType={chartType}
            onClickSourceItem={onAddDataType}
            triggerElement={
              <span css={styles.addDataCta}>
                <Typography css={styles.text}>{t('Add data')}</Typography>
                <IconButton fontSize="small" sx={styles.icon}>
                  <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.Add} />
                </IconButton>
              </span>
            }
            kitmanDesignSystem
          />
        )}
        {!isEmpty &&
          sortChartElements(activeWidgetData.widget.chart_elements).map(
            (element) => {
              return (
                <span key={element.id} css={styles.chip}>
                  <Chip
                    css={
                      activeWidgetData.widget.config?.invalid_chart_elements?.[
                        element.id
                      ]?.includes(CHART_ELEMENT_ERROR.INVALID_GROUPING) ||
                      (previewData &&
                        invalidChartElementMap?.[element.id]?.includes(
                          CHART_ELEMENT_ERROR.INVALID_GROUPING
                        ))
                        ? styles.chipInvalid
                        : ''
                    }
                    size="small"
                    label={element?.config?.render_options?.name}
                    color="secondary"
                    onClick={() => onEditDataType(element)}
                  />
                </span>
              );
            }
          )}
      </Box>
      {activeWidgetData && <Chart widgetData={getChartData()} pivotData={{}} />}
      {sidePanelSource !== TABLE_WIDGET_DATA_SOURCES.formula && (
        <DataSourceSidePanel
          isOpen={isSidePanelOpen}
          togglePanel={closeSidePanel}
        />
      )}
    </>
  );
}

export { AddNewChartModalTranslated as AddNewChartModal } from './components/AddNewChartModal';
export { BuilderActionButtonsTranslated as BuilderActionButtons } from './components/BuilderActionButtons';
export const ChartBuilderTranslated: ComponentType<Props> =
  withNamespaces()(ChartBuilder);
export default ChartBuilder;
