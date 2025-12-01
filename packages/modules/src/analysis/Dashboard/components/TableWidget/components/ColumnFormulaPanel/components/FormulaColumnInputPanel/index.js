// @flow
import { withNamespaces } from 'react-i18next';
import {
  TextButton,
  SlidingPanelResponsive as SlidingPanel,
} from '@kitman/components';
import { TextField } from '@kitman/playbook/components';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';

// Types
import type { Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { BaseFormulaInputsProps } from '../FormulaInputPanel';
import { FormulaInputPanelTranslated as FormulaInputPanel } from '../FormulaInputPanel/index';

const styles = {
  content: {
    padding: '0 15px 0 0',
  },
};

export type FormulaColumnInputProps = {
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
};

function FormulaColumnInputPanel({
  t,
  input,
  inputConfig,
  formulaInputId,
  updateFormulaInput,
  ...props
}: I18nProps<FormulaColumnInputProps>) {
  const previousButton = (
    <TextButton
      onClick={props.onPrevious}
      type="secondary"
      text={t('Back')}
      kitmanDesignSystem
      isDisabled={props.isLoading}
    />
  );

  const actionsModule = (
    <>
      {props.canGoPrevious && previousButton}
      <TextButton
        onClick={props.onNext}
        isDisabled={props.isLoading || props.isFinalStep || !props.isStepValid}
        type="primary"
        text={t('Next')}
        kitmanDesignSystem
      />
    </>
  );

  const finalStepSection = (
    <>
      <SlidingPanel.Content styles={styles.content}>
        <Panel.Field>
          <TextField
            variant="filled"
            label={t('Column header title')}
            value={props.columnName || ''}
            onChange={(event) => props.onSetColumnName(event.target.value)}
            fullWidth
          />
        </Panel.Field>
        <Panel.Loading isLoading={props.isLoading} />
      </SlidingPanel.Content>
      <SlidingPanel.Actions>
        {props.canGoPrevious && previousButton}
        <TextButton
          onClick={props.onSubmit}
          isDisabled={!props.isStepValid || props.isLoading}
          type="primary"
          text={t('Apply')}
          kitmanDesignSystem
        />
      </SlidingPanel.Actions>
    </>
  );

  return (
    <FormulaInputPanel
      {...props}
      actionsModule={actionsModule}
      finalStepSection={finalStepSection}
      input={input}
      inputConfig={inputConfig}
      formulaInputId={formulaInputId}
      updateFormulaInput={updateFormulaInput}
    />
  );
}

export const FormulaColumnInputPanelTranslated = withNamespaces()(
  FormulaColumnInputPanel
);
export default FormulaColumnInputPanel;
