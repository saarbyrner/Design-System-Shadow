// @flow
import { withNamespaces } from 'react-i18next';
import {
  RadioList,
  SlidingPanelResponsive as SlidingPanel,
} from '@kitman/components';
import { Typography, Box } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import { POPULATION_TYPES } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  TableWidgetFormulaInput,
  UpdateFormulaInput,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { FormulaInputConfig } from '@kitman/modules/src/analysis/shared/types';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

const styles = {
  content: {
    padding: '0 15px 0 0',
  },
  indented: {
    marginLeft: '20px',
    boxShadow: `inset 6px 0 0 0 ${colors.neutral_400}`,
    paddingBottom: '1px',
  },
  heading: {
    fontWeight: '600',
    color: colors.grey_300,
    lineHeight: '22px',
    mb: '12px',
  },
};

export type BaseFormulaInputsProps = {
  isLoading: boolean,
  canShowPopulationSelection: boolean,
  canShowInheritPopulation: boolean,
  isFinalStep: boolean,

  formulaInputId: string,
  input: TableWidgetFormulaInput,
  inputConfig: FormulaInputConfig,

  dateRangeModule: Node,
  dataTypeSelection: Node,
  populationUI: Node,
  finalStepSection: Node,
  panelFiltersUI: Node,
  panelFilterMedical: Node,

  updateFormulaInput: (param: UpdateFormulaInput) => void,
};

type FormulaInputProps = {
  ...BaseFormulaInputsProps,
  activeSourceModule: Node,
  actionsModule: Node,
  customStyles?: ObjectStyle,
  groupingSection: Node,
};

function FormulaInputPanel({
  t,
  input,
  inputConfig,
  formulaInputId,
  updateFormulaInput,
  ...props
}: I18nProps<FormulaInputProps>) {
  const renderSource = () => (
    <>
      <Panel.Divider />
      <Panel.Field>
        <Typography sx={styles.heading} variant="body1">
          {t('Series')}
        </Typography>
      </Panel.Field>
      {props.activeSourceModule}
    </>
  );

  const renderPopulationSelection = () => {
    if (!props.canShowPopulationSelection) {
      return null;
    }

    if (props.canShowInheritPopulation) {
      let radioValue = input.population_selection;
      if (!radioValue) {
        radioValue =
          inputConfig.population_config.default_value ===
          POPULATION_TYPES.inherit
            ? POPULATION_TYPES.inherit
            : 'select';
      }
      return (
        <>
          <Panel.Field>
            <RadioList
              radioName="population_selection"
              value={radioValue}
              change={(value) => {
                updateFormulaInput({
                  formulaInputId,
                  properties: {
                    population_selection: value,
                  },
                });
                if (value === POPULATION_TYPES.inherit)
                  updateFormulaInput({
                    formulaInputId,
                    properties: {
                      population: null,
                    },
                  });
              }}
              direction="vertical"
              options={[
                {
                  value: POPULATION_TYPES.inherit,
                  name: t('Inherit population from table'),
                },
                {
                  value: 'select',
                  name: t('Select specific population'),
                },
              ]}
              kitmanDesignSystem
            />
          </Panel.Field>
          {radioValue !== POPULATION_TYPES.inherit && (
            <Box sx={styles.indented}>{props.populationUI}</Box>
          )}
        </>
      );
    }

    return props.populationUI;
  };

  if (props.isFinalStep) {
    return props.finalStepSection;
  }

  return (
    <>
      <SlidingPanel.Content styles={styles.content}>
        <Panel.Field>
          <Typography sx={styles.heading} variant="body1">
            {t('Data type')}
          </Typography>
          {props.dataTypeSelection}
        </Panel.Field>
        {props.activeSourceModule && (
          <Box sx={styles.indented}>{renderSource()}</Box>
        )}
        <Panel.Field>
          <Typography sx={styles.heading} variant="body1">
            {t('Context')}
          </Typography>
        </Panel.Field>
        {renderPopulationSelection()}
        {props.dateRangeModule}
        {props.panelFilterMedical}
        {props.panelFiltersUI}
        {props.groupingSection}
      </SlidingPanel.Content>
      <Panel.Loading isLoading={props.isLoading} />
      <SlidingPanel.Actions styles={props.customStyles}>
        {props.actionsModule}
      </SlidingPanel.Actions>
    </>
  );
}

export const FormulaInputPanelTranslated = withNamespaces()(FormulaInputPanel);
export default FormulaInputPanel;
