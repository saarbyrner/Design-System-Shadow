// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import { InputTextField, Select } from '@kitman/components';
import { useGetPreferencesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetActivitySourceOptionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { getCalculationDropdownOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';

import type { TableWidgetDataSource } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { isValidOptionLength } from '../utils';

type Props = {
  isPanelOpen: boolean,
  hideColumnTitle: boolean,
  calculation: string,
  columnTitle?: string,
  rowTitle?: string,
  selectedActivitySource: {
    ids: number[] | number,
    type: TableWidgetDataSource,
  },
  onSetActivitySource: Function,
  onSetCalculation: Function,
  onSetColumnTitle?: Function,
  panelType?: 'row' | 'column',
};

function ActivityModule(props: I18nProps<Props>) {
  const areCoachingPrinciplesEnabled = useSelector(
    (state) => state.coachingPrinciples.isEnabled
  );
  const { data, isFetching } = useGetActivitySourceOptionsQuery(
    areCoachingPrinciplesEnabled,
    { skip: !props.isPanelOpen }
  );

  const {
    data: { enable_activity_type_category: isActivityTypeCategoriesEnabled } = {
      enable_activity_type_category: false,
    },
  } = useGetPreferencesQuery();

  const isCategoryOptionsVisible = !!props.selectedActivitySource.type;

  const getActivitySourceKey = (sourceType: TableWidgetDataSource) => {
    switch (sourceType) {
      case 'Principle':
        return 'principles';

      case 'EventActivityType':
        return 'activityTypes';

      case 'PrincipleType':
        return 'principleTypes';

      case 'PrincipleCategory':
        return 'principleCategories';

      case 'PrinciplePhase':
        return 'phases';

      case 'EventActivityDrillLabel':
        return 'drillLabels';

      case 'EventActivityTypeCategory':
        return 'activityTypeCategories';

      default: {
        return '';
      }
    }
  };

  const activitySourceOptions = [
    {
      label: props.t('Principles'),
      value: 'Principle',
    },
    {
      label: props.t('Activity Types'),
      value: 'EventActivityType',
    },
    {
      label: props.t('Principle Types'),
      value: 'PrincipleType',
    },
    {
      label: props.t('Principle Categories'),
      value: 'PrincipleCategory',
    },
    {
      label: props.t('Principle Phases'),
      value: 'PrinciplePhase',
    },
    {
      label: props.t('Drill Label'),
      value: 'EventActivityDrillLabel',
    },
  ];

  const activitySourceCategoryOptions =
    data?.[`${getActivitySourceKey(props.selectedActivitySource.type)}`]?.map(
      ({ id, name }) => ({
        label: name,
        value: id,
      })
    ) || [];

  const configureMultiActivitySource = useMemo(() => {
    if (isActivityTypeCategoriesEnabled) {
      const updatedActivitySources = [
        ...activitySourceOptions,
        {
          label: props.t('Activity Type Category'),
          value: 'EventActivityTypeCategory',
        },
      ];
      return updatedActivitySources;
    }
    return activitySourceOptions;
  }, [isActivityTypeCategoriesEnabled, activitySourceOptions]);

  const displaySelector = isValidOptionLength(activitySourceCategoryOptions);

  return (
    <>
      <Panel.Field>
        <Select
          label={props.t('Activity Source')}
          data-testid="ActivityModule|ActivitySource"
          options={configureMultiActivitySource}
          onChange={(value) => {
            const selectedSource = configureMultiActivitySource.find(
              (option) => option.value === value
            );
            props.onSetActivitySource([], value, selectedSource?.label);
            if (!props.hideColumnTitle)
              props.onSetColumnTitle?.(selectedSource?.label);
          }}
          value={props.selectedActivitySource.type}
          isLoading={isFetching}
          searchable
        />
      </Panel.Field>
      {isCategoryOptionsVisible && (
        <Panel.Field>
          <Select
            label={
              configureMultiActivitySource.find(
                (source) => props.selectedActivitySource.type === source.value
              )?.label
            }
            data-testid="ActivityModule|ActivitySourceCategoryOptions"
            options={activitySourceCategoryOptions}
            onChange={(value) => {
              props.onSetActivitySource(
                value,
                props.selectedActivitySource.type,
                value.label
              );
            }}
            value={props.selectedActivitySource.ids}
            isLoading={isFetching}
            isMulti
            searchable
            selectAllGroups
            allowClearAll={displaySelector}
            allowSelectAll={displaySelector}
            customSelectStyles={fullWidthMenuCustomStyles}
          />
        </Panel.Field>
      )}
      <Panel.Field>
        <Select
          data-testid="ActivityModule|Calculation"
          label={props.t('Calculation')}
          value={props.calculation}
          options={getCalculationDropdownOptions().map(({ id, title }) => ({
            value: id,
            label: title,
          }))}
          onChange={(calc) => props.onSetCalculation(calc)}
          appendToBody
        />
      </Panel.Field>
      {!props.hideColumnTitle && (
        <Panel.Field>
          <InputTextField
            data-testid="ActivityModule|ColumnTitle"
            label={
              props.panelType === 'row'
                ? props.t('Row Title')
                : props.t('Column Title')
            }
            inputType="text"
            value={
              props.panelType === 'row'
                ? props.rowTitle || props.columnTitle || ''
                : props.columnTitle || props.rowTitle || ''
            }
            onChange={(e) => props.onSetColumnTitle?.(e.currentTarget.value)}
            kitmanDesignSystem
          />
        </Panel.Field>
      )}
    </>
  );
}

export const ActivityModuleTranslated = withNamespaces()(ActivityModule);
export default ActivityModule;
