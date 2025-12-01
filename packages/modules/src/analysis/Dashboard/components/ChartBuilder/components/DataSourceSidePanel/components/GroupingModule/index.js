// @flow
import { type ComponentType, useEffect, useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Select } from '@kitman/components';
import {
  Button,
  IconButton,
  Typography,
  Switch,
  Alert,
  AlertTitle,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import colors from '@kitman/common/src/variables/colors';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  SERIES_TYPES,
  CHART_ELEMENT_ERROR,
} from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import {
  getGroupingsByDataSourceType,
  getIsChartElementStacked,
  getGroupings,
  getChartConfig,
  getWidgetByIdFactory,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  addRenderOptions,
  updateChartConfig,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import {
  orderGroupings,
  applyErrorState,
  removeErrorState,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import { GROUPING_OPTIONS } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';
import { FORMULA_INPUT_IDS } from '@kitman/modules/src/analysis/shared/constants';
import { DATA_SOURCE_TYPES } from '@kitman/modules/src/analysis/Dashboard/components/types';

import type { SeriesType } from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import type { TableWidgetDataSource } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type {
  DataSourceFormState,
  AddDataSourceGrouping,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';

type Props = {
  withSecondaryGrouping?: boolean,
  seriesType: SeriesType,
  label?: string,
  customStyles?: ObjectStyle,
  dataSourceType: TableWidgetDataSource,
  primaryGrouping: string,
  secondaryGrouping?: string,
  widgetId: number,
  dataSourceFormState: DataSourceFormState,
  addDataSourceGrouping: (param: AddDataSourceGrouping) => void,
  deleteDataSourceGrouping: () => void,
};

export const styles = {
  primaryGrouping: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
  },
  secondaryGrouping: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
  },
  button: {
    margin: '10px 0',
  },
  select: {
    width: '60%',
    margin: '5px 0',
  },
  text: {
    margin: '10px 0 10px 10px',
    color: `${colors.grey_100}`,
    fontWeight: '400',
    fontSize: '14px',
  },
  deleteIcon: {
    color: `${colors.grey_100}`,
    opacity: 0.7,
    padding: 0,
    margin: '10px 0 10px 10px',
  },
};

const GroupingModule = ({
  seriesType,
  withSecondaryGrouping,
  label,
  customStyles,
  dataSourceType,
  primaryGrouping,
  secondaryGrouping,
  widgetId,
  dataSourceFormState,
  addDataSourceGrouping,
  deleteDataSourceGrouping,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const groupingsByDataSourceType = useSelector(
    getGroupingsByDataSourceType(dataSourceType)
  );
  const allGroupings = useSelector(getGroupings);
  const isElementStacked = useSelector(getIsChartElementStacked);
  const activeWidgetData = useSelector(getWidgetByIdFactory(widgetId));

  const { invalid_chart_elements: invalidChartElementMap } = useSelector(
    getChartConfig(activeWidgetData?.widget.chart_id)
  );

  const availableGroupings = groupingsByDataSourceType.filter((grouping) => {
    // hiding defence grouping micro_cycle when FF is false
    return !window.getFlag('rep-defense-bmt-mvp')
      ? grouping.key !== GROUPING_OPTIONS.microCycle
      : grouping;
  });

  const [showSecondaryGrouping, setShowSecondaryGrouping] =
    useState<boolean>(false);
  const [primaryGroupingValue, setPrimaryGroupingValue] =
    useState<string>(primaryGrouping);
  const [groupingAlert, setGroupingAlert] = useState('');

  useEffect(() => {
    setShowSecondaryGrouping(!!secondaryGrouping);
  }, [secondaryGrouping]);

  useEffect(() => {
    // handles switching chart type from one that allows a second grouping (bar) to one that doesn't (line)
    // delete the second grouping from state
    if (!withSecondaryGrouping && secondaryGrouping) {
      deleteDataSourceGrouping();
    }
  }, [withSecondaryGrouping, secondaryGrouping]);

  const datasourceList = useMemo(() => {
    const elements = activeWidgetData?.widget.chart_elements;
    if (!elements) {
      return [];
    }
    const currentEdit = elements?.find(
      (ele) => ele.id === dataSourceFormState.id
    )
      ? {}
      : dataSourceFormState;

    // Collects all the Datasources available on the chart
    const res = [...elements, ...(currentEdit?.id ? [currentEdit] : [])];
    return res;
  }, [activeWidgetData?.widget.chart_elements, dataSourceFormState]);

  const isMultiDatasourceChart = datasourceList.length >= 2;

  const filterGroupingsByDatasourceType = (datasourceType: string) => {
    if (!datasourceType) {
      return [];
    }
    return (
      allGroupings?.find((item) => item.name === datasourceType)?.groupings ??
      []
    );
  };

  // Calculates Shared and Unique Groupings for the Datasources added
  const [sharedGroupings, uniqueGroupings] = useMemo(() => {
    if (!isMultiDatasourceChart) return [[], []];

    const shared = [];
    const unique = [];

    const combinedGroupings = datasourceList.reduce((acc, item) => {
      const dataSource =
        item.data_source_type === DATA_SOURCE_TYPES.formula
          ? item.input_params?.[FORMULA_INPUT_IDS.numerator]?.data_source_type
          : item.data_source_type;

      const filteredGroupings = filterGroupingsByDatasourceType(dataSource);
      acc.push(...filteredGroupings);
      return acc;
    }, []);

    const frequency = new Map<string, number>();

    combinedGroupings.forEach((item) => {
      frequency.set(item.key, (frequency.get(item.key) || 0) + 1);
    });

    availableGroupings.forEach((grouping) => {
      const freq = frequency.get(grouping.key) || 0;
      if (freq === datasourceList.length) {
        shared.push(grouping);
      } else {
        unique.push(grouping);
      }
    });
    return [shared, unique];
  }, [
    availableGroupings,
    allGroupings,
    datasourceList,
    isMultiDatasourceChart,
  ]);

  const displayCategorizedGroupings =
    isMultiDatasourceChart && uniqueGroupings.length;

  /**
   *  When second datasource is added, check if the grouping needs to be
   *  preselected based on the first datasource
   */
  useEffect(() => {
    setPrimaryGroupingValue(primaryGrouping);
    if (isMultiDatasourceChart) {
      if (activeWidgetData?.widget.chart_elements.length >= 1) {
        const savedGrouping =
          activeWidgetData?.widget.chart_elements[0]?.config.groupings[0];
        if (sharedGroupings.find(({ key }) => key === savedGrouping)) {
          setGroupingAlert('');
          setPrimaryGroupingValue(savedGrouping);
          addDataSourceGrouping({
            index: 0,
            grouping: savedGrouping,
          });
        } else {
          setGroupingAlert(t('Choose a grouping to view Chart'));
        }
      }
    } else {
      setGroupingAlert(t(''));
    }
  }, [isMultiDatasourceChart, sharedGroupings.length, dataSourceFormState.id]);

  /**
   * When user changes the grouping, recalculate if the
   * grouping is supported by the datasource.
   */
  const evaluateGroupingSupport = () => {
    if (!primaryGroupingValue || !isMultiDatasourceChart) {
      return;
    }
    if (
      displayCategorizedGroupings &&
      uniqueGroupings.find(({ key }) => key === primaryGroupingValue)
    ) {
      const invalidatedElements = datasourceList
        .filter((i) => i.data_source_type !== dataSourceType)
        .reduce((acc, item) => {
          const filteredGroupings = filterGroupingsByDatasourceType(
            item.data_source_type
          );
          if (
            !filteredGroupings.find(({ key }) => key === primaryGroupingValue)
          ) {
            acc.push(item);
          }
          return acc;
        }, []);

      // Get the display names and ids of the candidates to invalidate
      const invalidNames = invalidatedElements
        ?.map((item) => item?.config?.render_options?.name)
        .filter(Boolean)
        ?.join(' ');
      const invalidIds = invalidatedElements.map((item) => item?.id);
      const invalidMapping = applyErrorState(
        invalidIds,
        invalidChartElementMap,
        CHART_ELEMENT_ERROR.INVALID_GROUPING
      );
      dispatch(
        updateChartConfig({
          chartId: activeWidgetData?.widget.chart_id,
          partialConfig: {
            invalid_chart_elements: invalidMapping,
          },
        })
      );
      setGroupingAlert(
        t(
          'Selecting a grouping that is not common to all data sources will hide {{invalidNames}} from the chart.',
          {
            invalidNames,
          }
        )
      );
    } else {
      setGroupingAlert('');
      if (invalidChartElementMap) {
        const updatedMapping = removeErrorState(
          invalidChartElementMap,
          CHART_ELEMENT_ERROR.INVALID_GROUPING
        );
        dispatch(
          updateChartConfig({
            chartId: activeWidgetData?.widget.chart_id,
            partialConfig: {
              invalid_chart_elements: updatedMapping,
            },
          })
        );
      }
    }
  };

  const formatGroupingOptions = (options: Array<Object>) => {
    if (options.length < 1) {
      return [];
    }

    return orderGroupings(options).map((group) => {
      return {
        label: group.name,
        value: group.key,
      };
    });
  };

  const categorizedGroupingOptions = useMemo(() => {
    return [
      {
        label: t('Shared data groupings'),
        options: formatGroupingOptions(sharedGroupings),
      },
      {
        label: t('Unique data groupings'),
        options: formatGroupingOptions(uniqueGroupings),
      },
    ];
  }, [sharedGroupings, uniqueGroupings, t]);

  useEffect(() => {
    evaluateGroupingSupport();
  }, [primaryGroupingValue, datasourceList]);

  const renderSecondaryGroupingComponent = () => {
    if (!withSecondaryGrouping) {
      return null;
    }

    const secondGroupingOptions = availableGroupings.filter(
      (grouping) =>
        grouping.key !== primaryGrouping &&
        grouping.key !== GROUPING_OPTIONS.timestamp &&
        grouping.key !== GROUPING_OPTIONS.drill
    );

    return (
      <div css={styles.secondaryGrouping}>
        <div css={styles.select}>
          <Select
            label={t('and then')}
            options={formatGroupingOptions(secondGroupingOptions)}
            onChange={(value) => {
              addDataSourceGrouping({ index: 1, grouping: value });
            }}
            value={secondaryGrouping}
            searchable
          />
        </div>
        {seriesType === SERIES_TYPES.bar && (
          <>
            <Typography css={styles.text}>{t('stacked')}</Typography>
            <Switch
              checked={!!isElementStacked}
              onChange={() => {
                dispatch(
                  addRenderOptions({
                    key: 'stack_group_elements',
                    value: !isElementStacked,
                  })
                );
              }}
            />
          </>
        )}
        {secondaryGrouping && (
          <IconButton
            css={styles.deleteIcon}
            onClick={deleteDataSourceGrouping}
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
          </IconButton>
        )}
      </div>
    );
  };

  const renderAddButton = () => {
    if (!withSecondaryGrouping) {
      return null;
    }

    return (
      <div
        css={[
          styles.button,
          {
            visibility: showSecondaryGrouping && 'hidden',
          },
        ]}
      >
        <Button
          content="addGrouping"
          color="secondary"
          size="small"
          disabled={!primaryGrouping}
          onClick={() => {
            setShowSecondaryGrouping(true);
            // default secondGrouping to stack
            dispatch(
              addRenderOptions({
                key: 'stack_group_elements',
                value: true,
              })
            );
          }}
        >
          {t('Add')}
        </Button>
      </div>
    );
  };

  return (
    <Panel.Field>
      <div css={styles.primaryGrouping}>
        <div css={[styles.select, customStyles]}>
          <Select
            label={t('Group by')}
            options={
              displayCategorizedGroupings
                ? categorizedGroupingOptions
                : formatGroupingOptions(availableGroupings)
            }
            onChange={(value) => {
              setPrimaryGroupingValue(value);
              evaluateGroupingSupport();
              addDataSourceGrouping({ index: 0, grouping: value });
            }}
            value={primaryGroupingValue}
            searchable
          />
        </div>
        {label && <Typography css={styles.text}>{label}</Typography>}
      </div>
      {groupingAlert && (
        <Alert severity="warning">
          <AlertTitle>{t('Warning')}</AlertTitle> {groupingAlert}
        </Alert>
      )}
      {showSecondaryGrouping
        ? renderSecondaryGroupingComponent()
        : renderAddButton()}
    </Panel.Field>
  );
};

export const GroupingModuleTranslated: ComponentType<Props> =
  withNamespaces()(GroupingModule);

export default GroupingModule;
