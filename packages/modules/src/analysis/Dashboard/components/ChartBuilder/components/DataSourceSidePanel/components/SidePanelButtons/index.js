// @flow
import { type ComponentType, type Node } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { editWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import {
  applyChartElement,
  deleteChartElement,
  updateChartElement,
  updatePreviewChartData,
  updateChartName,
  refreshChartElements,
  updateChartConfig,
  refreshInvalidChartElementMap,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import {
  getChartBuilderMode,
  getChartId,
  getWidgetByIdFactory,
  getChartElementsByWidgetIdFactory,
  getChartName,
  getLoaderLevelByWidgetId,
  getChartConfig,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  useSaveChartElementMutation,
  useSaveUpdateChartElementMutation,
  useRemoveChartElementMutation,
  useUpdateChartWidgetMutation,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import { CHART_ELEMENT_ERROR } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import {
  formatChartElementServerResponse,
  getNewChartTitle,
  getNewChartTitleOnRemove,
  synchronizeChartGrouping,
  removeErrorState,
  getDefaultChartOptionsAsObject,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import { sanitizeChartTitle } from '@kitman/modules/src/analysis/Dashboard/utils';
import type { DataSourceFormState } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';

const styles = {
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '10px',
    height: '70px',
    width: '100%',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttons: {
    paddingLeft: '20px',
  },
  removeButton: {
    paddingLeft: '10px',
  },
};
type Props = {
  chartType: string,
  widgetId: number,
  dataSourceFormState: DataSourceFormState,
  disableSyncGroupings?: boolean,
  onSuccess?: () => void,
  onLoading?: (boolean) => void,
  hideSubmitButton?: boolean,
  actionButtons?: Node,
  isButtonDisabled: boolean,
};

const SidePanelButtons = ({
  chartType,
  widgetId,
  dataSourceFormState,
  disableSyncGroupings,
  onSuccess,
  onLoading,
  hideSubmitButton,
  actionButtons,
  isButtonDisabled,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const { containerType, containerId } = useSelector((state) => ({
    containerType: state.staticData.containerType,
    containerId: state.dashboard.activeDashboard.id,
  }));

  const enableSyncGroupings =
    !disableSyncGroupings && chartType === CHART_TYPE.xy;

  const activeWidgetData = useSelector(getWidgetByIdFactory(widgetId));

  const mode = useSelector(getChartBuilderMode);

  const chartElements = useSelector(
    getChartElementsByWidgetIdFactory(widgetId?.toString())
  );

  const chartName = useSelector(getChartName(widgetId));

  const chartId = useSelector(getChartId);

  const { invalid_chart_elements: invalidChartElementMap } = useSelector(
    getChartConfig(activeWidgetData?.widget.chart_id)
  );

  const { chartOptions: selectedChartOptions } = useSelector(
    getChartConfig(activeWidgetData?.widget.chart_id)
  );

  const loaderLevel: number = useSelector(getLoaderLevelByWidgetId(widgetId));

  const [saveChartElement] = useSaveChartElementMutation();

  const [saveUpdateChartElement] = useSaveUpdateChartElementMutation();

  const [removeChartElement] = useRemoveChartElementMutation();

  const [updateChartWidget] = useUpdateChartWidgetMutation();

  /**
   * Sync groupings on data sources that are valid (allow for the new grouping)
   * then update the chart element on the backend/store
   */
  const syncGroupings = async () => {
    const elements = synchronizeChartGrouping(
      activeWidgetData,
      dataSourceFormState,
      invalidChartElementMap
    );

    if (elements.length) {
      dispatch(refreshChartElements({ chartElements: elements }));
      elements
        .filter((ele) => ele.id !== dataSourceFormState.id)
        .forEach((ele) => {
          saveUpdateChartElement({
            chartId,
            chartElementId: ele.id,
            chartElement: ele,
          })
            .unwrap()
            .then(() => {
              dispatch(
                updateChartElement({
                  widgetId: `${widgetId}`,
                  formattedState: ele,
                })
              );
            });
        });
    }
  };

  const serializeChartUpdate = async (isRemove = false) => {
    let mapping = null;
    let title = '';
    if (isRemove) {
      title = getNewChartTitleOnRemove(
        chartElements,
        dataSourceFormState,
        chartType
      );
      mapping = removeErrorState(
        invalidChartElementMap,
        CHART_ELEMENT_ERROR.INVALID_GROUPING
      );
    } else {
      title = getNewChartTitle(dataSourceFormState, chartElements, chartName);
    }

    const name = sanitizeChartTitle(title);
    updateChartWidget({
      widgetId: activeWidgetData.id,
      containerType,
      containerId,
      widget: {
        ...activeWidgetData.widget,
        name,
        config: {
          ...activeWidgetData.widget?.config,
          invalid_chart_elements: mapping ?? invalidChartElementMap,
          ...(chartType === CHART_TYPE.pie && {
            chartOptions: {
              ...(selectedChartOptions ??
                getDefaultChartOptionsAsObject(chartType)),
            },
          }),
        },
      },
    })
      .unwrap()
      .then((response) => {
        dispatch(
          refreshInvalidChartElementMap({
            widgetId: activeWidgetData.id,
            invalidChartElementMap: mapping ?? invalidChartElementMap,
          })
        );
        dispatch(
          updateChartName({
            widgetId: `${activeWidgetData.id}`,
            name,
          })
        );
        if (chartType === CHART_TYPE.pie) {
          dispatch(
            updateChartConfig({
              chartId: activeWidgetData?.widget.chart_id,
              partialConfig: {
                chartOptions: {
                  ...response.container_widget?.widget?.config?.chartOptions,
                },
              },
            })
          );
        }
        dispatch(editWidgetSuccess(response.container_widget));
      });
  };

  const onPreview = () => {
    dispatch(updatePreviewChartData({ formattedState: dataSourceFormState }));
  };

  const onApply = () => {
    onLoading?.(true);

    serializeChartUpdate();

    saveChartElement({
      chartId,
      chartElement: dataSourceFormState,
    })
      .unwrap()
      .then((result) => {
        const data = formatChartElementServerResponse(result);
        dispatch(
          applyChartElement({
            data,
          })
        );

        onSuccess?.();

        if (enableSyncGroupings) {
          syncGroupings();
        }
      })
      .finally(() => {
        onLoading?.(false);
      });
  };

  const onUpdate = () => {
    onLoading?.(true);

    serializeChartUpdate();

    saveUpdateChartElement({
      chartId,
      chartElementId: dataSourceFormState.id,
      chartElement: dataSourceFormState,
    })
      .unwrap()
      .then(() => {
        dispatch(
          updateChartElement({
            widgetId: `${widgetId}`,
            formattedState: dataSourceFormState,
          })
        );

        if (enableSyncGroupings) {
          syncGroupings();
        }

        onSuccess?.();
      })
      .finally(() => {
        onLoading?.(false);
      });
  };

  const onRemove = async () => {
    onLoading?.(true);
    serializeChartUpdate(true);
    removeChartElement({
      chartId,
      chartElementId: dataSourceFormState.id,
    })
      .unwrap()
      .then(() => {
        dispatch(deleteChartElement());

        onSuccess?.();
      })
      .finally(() => {
        onLoading?.(false);
      });
  };

  // when a new data source is added, it is not yet persisted in the db to remove,
  // so disabling the remove button in create mode
  const isRemoveDisabled = mode === 'create';

  return (
    <span css={styles.buttonContainer}>
      <span css={styles.buttonWrapper}>
        <div css={styles.removeButton}>
          <Button
            content="remove"
            color="secondary"
            size="medium"
            disabled={isRemoveDisabled}
            onClick={onRemove}
          >
            {t('Remove')}
          </Button>
        </div>
      </span>
      <span css={styles.buttonWrapper}>
        <div css={styles.buttons}>
          <Button
            content="preview"
            color="secondary"
            size="medium"
            disabled={
              isButtonDisabled || loaderLevel === LOADING_LEVEL.INITIAL_LOAD
            }
            onClick={onPreview}
          >
            {loaderLevel === LOADING_LEVEL.INITIAL_LOAD
              ? t('Loading...')
              : t('Preview')}
          </Button>
        </div>
        {actionButtons}
        {!hideSubmitButton && (
          <div css={styles.buttons}>
            <Button
              content="apply"
              color="primary"
              size="medium"
              disabled={isButtonDisabled}
              onClick={() => (mode === 'create' ? onApply() : onUpdate())}
            >
              {t('Apply')}
            </Button>
          </div>
        )}
      </span>
    </span>
  );
};

export const SidePanelButtonsTranslated: ComponentType<Props> =
  withNamespaces()(SidePanelButtons);
export default SidePanelButtons;
