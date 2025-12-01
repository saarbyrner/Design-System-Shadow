// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import type {
  Condition,
  ElementTypes,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import { Typography, Grid, IconButton } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { ConditionTypeSelectorTranslated as ConditionTypeSelector } from '../ConditionTypeSelector';
import { ConditionValueInputTranslated as ConditionValueInput } from '../ConditionValueInput';
import { LogicalOperatorSelectorTranslated as LogicalOperatorSelector } from '../LogicalOperatorSelector';

type Props = {
  condition?: Condition,
  initialQuestion?: HumanInputFormElement,
  elementType: ElementTypes,
  index: number,
  subIndex?: number,
  logicalOperatorValue?: string,
  showOperatorSelector?: boolean,
  setFollowUpQuestionsModal: Function,
  onRemove?: (subIndex: number) => void,
  onOperatorChange?: (e: Object) => void,
};

const ConditionRowItem = ({
  t,
  condition,
  elementType,
  subIndex = null,
  initialQuestion,
  setFollowUpQuestionsModal,
  logicalOperatorValue,
  showOperatorSelector,
  index,
  onRemove,
  onOperatorChange,
}: I18nProps<Props>) => (
  <Grid
    container
    columns={8}
    direction="row"
    columnSpacing={2}
    sx={{ alignItems: 'center', p: 1 }}
  >
    <Grid item>
      <Typography>{t('If')}</Typography>
    </Grid>
    <Grid item xs={2}>
      <ConditionTypeSelector
        condition={condition}
        subIndex={subIndex}
        setFollowUpQuestionsModal={setFollowUpQuestionsModal}
        index={index}
        elementType={elementType}
      />
    </Grid>
    <Grid item xs={2}>
      <ConditionValueInput
        condition={condition}
        subIndex={subIndex}
        setFollowUpQuestionsModal={setFollowUpQuestionsModal}
        elementType={elementType}
        index={index}
        initialQuestion={initialQuestion}
      />
    </Grid>
    {showOperatorSelector && onOperatorChange && (
      <Grid item>
        <LogicalOperatorSelector
          value={logicalOperatorValue || 'or'}
          onChange={onOperatorChange}
          elementType={elementType}
        />
      </Grid>
    )}
    {onRemove && (
      <Grid item>
        <IconButton aria-label="delete" onClick={onRemove}>
          <KitmanIcon name={KITMAN_ICON_NAMES.RemoveCircle} />
        </IconButton>
      </Grid>
    )}
  </Grid>
);

export const ConditionRowItemTranslated: ComponentType<Props> =
  withNamespaces()(ConditionRowItem);
export default ConditionRowItem;
