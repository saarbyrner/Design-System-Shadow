// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
} from '@kitman/playbook/components';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import { colors } from '@kitman/common/src/variables';
import { GroupingModuleTranslated as GroupingModule } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/components/DataSourceSidePanel/components/GroupingModule';
import {
  type TableWidgetFormulaInput,
  type InheritGroupings,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { INHERIT_GROUPING } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { updateInheritGroupings } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  DataSourceFormState,
  AddDataSourceGrouping,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';
import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';

const headingStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: colors.grey_100,
  margin: 0,
};

const styles = {
  grouping: {
    flex: 1,
  },
  heading: {
    fontWeight: '600',
    color: colors.grey_300,
    lineHeight: '22px',
    m: '0 0 12px 20px',
  },
  label: {
    '& .MuiFormControlLabel-label': headingStyle,
  },
};

export type FormulaGroupingProps = {
  canGoPrevious?: boolean,
  widgetId: number,
  input: TableWidgetFormulaInput,
  formattedData: DataSourceFormState,
  addDataSourceGrouping: (param: AddDataSourceGrouping) => void,
  seriesType: CoreChartType,
  inheritGroupings: InheritGroupings,
};

function FormulaGroupingSection({
  canGoPrevious,
  widgetId,
  input,
  formattedData,
  addDataSourceGrouping,
  seriesType,
  inheritGroupings,
  t,
}: I18nProps<FormulaGroupingProps>) {
  const dispatch = useDispatch();
  const { dataSource, element_config: config } = input;

  const radioOptions = [
    { value: INHERIT_GROUPING.yes, label: t('Yes') },
    { value: INHERIT_GROUPING.no, label: t('No') },
  ];

  const handleRadioChange = (event) => {
    const value = event.target.value;
    dispatch(updateInheritGroupings(value));
  };

  const inheritGroupingSwitch = (
    <Panel.Field>
      <FormControl>
        <FormLabel sx={headingStyle}>
          {t('Inherit grouping from value')}
        </FormLabel>
        <RadioGroup row onChange={handleRadioChange} value={inheritGroupings}>
          {radioOptions.map((option) => (
            <FormControlLabel
              value={option.value}
              label={option.label}
              key={`${option.label}_label`}
              sx={styles.label}
              control={<Radio size="small" />}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Panel.Field>
  );

  const renderOption = useMemo(() => {
    // render grouping switch for seconds step
    if (canGoPrevious) {
      return inheritGroupingSwitch;
    }

    // render grouping module for first step
    return (
      <GroupingModule
        key={dataSource?.type}
        seriesType={seriesType}
        dataSourceFormState={formattedData}
        dataSourceType={dataSource?.type || ''}
        widgetId={widgetId}
        customStyles={styles.grouping}
        primaryGrouping={config?.groupings?.[0] || ''}
        addDataSourceGrouping={addDataSourceGrouping}
        // Primary grouping is required and cannot be deleted.
        // Secondary grouping is not yet supported on the BE.
        deleteDataSourceGrouping={() => {}}
      />
    );
  }, [canGoPrevious, dataSource?.type, config?.groupings, inheritGroupings]);

  return (
    <>
      <Panel.Divider />
      <Typography sx={styles.heading} variant="body1">
        {t('Groupings')}
      </Typography>
      {renderOption}
    </>
  );
}

export const FormulaGroupingSectionTranslated = withNamespaces()(
  FormulaGroupingSection
);
export default FormulaGroupingSection;
