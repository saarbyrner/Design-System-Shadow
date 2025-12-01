// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Typography } from '@kitman/playbook/components';
import { SlidingPanelResponsive as SlidingPanel } from '@kitman/components';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import {
  getWidgetIdFromSidePanel,
  getDataSourceFormState,
  getChartElementType,
  getChartElementAxisConfig,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { colors } from '@kitman/common/src/variables';
import getFormulaPanel from '@kitman/modules/src/analysis/Dashboard/redux/selectors/formulaPanel';
import { SidePanelButtonsTranslated as SidePanelButtons } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/components/DataSourceSidePanel/components/SidePanelButtons';
import { FormulaInputPanelTranslated as FormulaInputPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnFormulaPanel/components/FormulaInputPanel';
import {
  copyPrimaryGrouping,
  prepareChartFormulaSubmissionData,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import {
  reset as resetColumnFormulaPanel,
  setLoading,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import { toggleTableColumnFormulaPanel } from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { SeriesVisualisationModuleTranslated as SeriesVisualisationModule } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/components/DataSourceSidePanel/components/SeriesVisualisationModule';
import { type UpdateFormulaInputElementConfig } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  INHERIT_GROUPING,
  FORMULA_CONFIG_KEYS,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import getFormulaDataSources from '@kitman/common/src/utils/TrackingData/src/data/analysis/getFormulaEventData';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

// Types
import type { Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormulaDetails } from '@kitman/modules/src/analysis/shared/types';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import type { BaseFormulaInputsProps } from '../FormulaInputPanel';

import { FormulaGroupingSectionTranslated as FormulaGroupingSection } from './FormulaGroupingSection';

const styles = {
  content: {
    padding: '0 15px 0 0',
  },
  buttons: {
    paddingLeft: '20px',
  },
  actions: {
    padding: '12px',
  },
  heading: {
    fontWeight: '600',
    color: colors.grey_300,
    lineHeight: '22px',
    m: '0 0 12px 20px',
  },
  field: { margin: '0 0 27px' },
};

export type FormulaInputProps = {
  ...BaseFormulaInputsProps,

  isOpen: boolean,
  isEditMode: boolean,
  isStepValid: boolean,
  canGoPrevious: boolean,
  columnName: ?string,
  activeSourceModule: Node,

  onSetColumnName: (name: string) => void,
  onNext: () => void,
  onPrevious: () => void,
  onSubmit: () => void,

  codingSystemKey: CodingSystemKey,
  activeFormula: ?FormulaDetails,
  widgetType: CoreChartType,
  updateFormulaInputElementConfig: (
    param: UpdateFormulaInputElementConfig
  ) => void,
};

function FormulaChartInputPanel({
  t,
  input,
  inputConfig,
  formulaInputId,
  updateFormulaInput,
  codingSystemKey,
  activeFormula,
  widgetType,
  updateFormulaInputElementConfig,
  ...props
}: I18nProps<FormulaInputProps>) {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();
  const widgetId = useSelector(getWidgetIdFromSidePanel);
  const formulaPanel = useSelector(getFormulaPanel);
  const { id } = useSelector(getDataSourceFormState);
  const seriesType = useSelector(getChartElementType);
  const axisConfig = useSelector(getChartElementAxisConfig);

  const isXYType = widgetType === CHART_TYPE.xy;
  const shouldInheritGroupings =
    formulaPanel?.inheritGroupings === INHERIT_GROUPING.yes;

  const formattedData = prepareChartFormulaSubmissionData({
    columnPanelDetails: {
      ...formulaPanel,
      ...(props.isFinalStep && {
        inputs: copyPrimaryGrouping(
          formulaPanel.inputs,
          shouldInheritGroupings
        ),
      }),
    },
    codingSystemKey,
    activeFormula,
    id,
    seriesType,
    axisConfig,
  });

  const onSucces = () => {
    dispatch(toggleTableColumnFormulaPanel());
    dispatch(resetColumnFormulaPanel());

    trackEvent(
      reportingEventNames.applyFormula,
      getFormulaDataSources(formattedData.input_params)
    );
  };

  const onLoading = (isLoading: boolean) => {
    dispatch(setLoading(isLoading));
  };

  const addDataSourceGrouping = ({ index, grouping }) => {
    updateFormulaInputElementConfig({
      formulaInputId,
      configKey: FORMULA_CONFIG_KEYS.groupings,
      properties: {
        index,
        grouping,
      },
    });
  };

  const groupingSection = () => {
    if (isXYType && !props.isFinalStep) {
      return (
        <FormulaGroupingSection
          widgetId={widgetId}
          input={input}
          formattedData={formattedData}
          canGoPrevious={props.canGoPrevious}
          addDataSourceGrouping={addDataSourceGrouping}
          inheritGroupings={formulaPanel?.inheritGroupings}
          elementConfig={input.element_config}
        />
      );
    }
    return null;
  };

  const visualisationModule = () => {
    if (isXYType && props.isFinalStep) {
      return (
        <Panel.Field styles={styles.field}>
          <Typography sx={styles.heading} variant="body1">
            {t('Visualisation')}
          </Typography>
          <SeriesVisualisationModule widgetId="1" />
        </Panel.Field>
      );
    }
    return null;
  };

  const actionButtons = (
    <>
      {props.canGoPrevious && (
        <div css={styles.buttons}>
          <Button
            content="Back"
            color="secondary"
            size="medium"
            disabled={props.isLoading}
            onClick={props.onPrevious}
          >
            {t('Back')}
          </Button>
        </div>
      )}
      {!props.isFinalStep && (
        <div css={styles.buttons}>
          <Button
            content="Next"
            color="primary"
            size="medium"
            disabled={
              props.isLoading || props.isFinalStep || !props.isStepValid
            }
            onClick={props.onNext}
          >
            {t('Next')}
          </Button>
        </div>
      )}
    </>
  );

  const actionsModule = (
    <SidePanelButtons
      widgetId={widgetId}
      chartType={widgetType}
      disableSyncGroupings
      dataSourceFormState={formattedData}
      hideSubmitButton={!props.isFinalStep}
      actionButtons={actionButtons}
      isButtonDisabled={!props.isStepValid || !props.isFinalStep}
      onSuccess={onSucces}
      onLoading={onLoading}
    />
  );

  const finalStepSection = (
    <>
      <SlidingPanel.Content styles={styles.content}>
        {visualisationModule()}
        <Panel.Field>
          <TextField
            variant="filled"
            label={t('Label name')}
            value={props.columnName || ''}
            onChange={(event) => props.onSetColumnName(event.target.value)}
            fullWidth
          />
        </Panel.Field>
        <Panel.Loading isLoading={props.isLoading} />
      </SlidingPanel.Content>
      <SlidingPanel.Actions styles={styles.actions}>
        {actionsModule}
      </SlidingPanel.Actions>
    </>
  );

  return (
    <FormulaInputPanel
      {...props}
      input={input}
      inputConfig={inputConfig}
      formulaInputId={formulaInputId}
      updateFormulaInput={updateFormulaInput}
      customStyles={styles.actions}
      actionsModule={actionsModule}
      finalStepSection={finalStepSection}
      groupingSection={groupingSection()}
    />
  );
}

export const FormulaChartInputPanelTranslated = withNamespaces()(
  FormulaChartInputPanel
);
export default FormulaChartInputPanel;
