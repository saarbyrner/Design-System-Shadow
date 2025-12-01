// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import type {
  Condition,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import { Grid, Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { ConditionRowItemTranslated as ConditionRowItem } from './components/ConditionRowItem';
import useConditionHandlers from './hooks/useConditionHandlers';

type Props = {
  condition?: Condition,
  initialQuestion?: HumanInputFormElement,
  index: number,
  setFollowUpQuestionsModal: Function,
};

const ConditionRow = ({
  t,
  condition,
  initialQuestion = {},
  index,
  setFollowUpQuestionsModal,
}: I18nProps<Props>) => {
  const { addCondition, removeCondition, handleOperatorChange } =
    useConditionHandlers(setFollowUpQuestionsModal, index);

  return (
    <Grid container direction="column" spacing={3} sx={{ p: 2 }}>
      {Array.isArray(condition?.conditions) &&
      condition?.conditions?.length > 1 ? (
        (condition?.conditions || []).map(
          (subCondition: Condition, subIndex: number) => (
            <ConditionRowItem
              // eslint-disable-next-line react/no-array-index-key
              key={subIndex}
              condition={subCondition}
              subIndex={subIndex}
              elementType={initialQuestion?.element_type}
              initialQuestion={initialQuestion}
              setFollowUpQuestionsModal={setFollowUpQuestionsModal}
              index={index}
              onRemove={() => removeCondition(subIndex)}
              onOperatorChange={handleOperatorChange}
              showOperatorSelector={
                !!(
                  condition.conditions?.length &&
                  subIndex !== condition.conditions.length - 1
                )
              }
              logicalOperatorValue={condition.type}
            />
          )
        )
      ) : (
        <ConditionRowItem
          condition={condition}
          initialQuestion={initialQuestion}
          elementType={initialQuestion?.element_type}
          setFollowUpQuestionsModal={setFollowUpQuestionsModal}
          index={index}
        />
      )}
      <Grid item>
        <Button variant="text" onClick={addCondition}>
          {t('Add Condition')}
        </Button>
      </Grid>
    </Grid>
  );
};

export const ConditionRowTranslated: ComponentType<Props> =
  withNamespaces()(ConditionRow);
export default ConditionRow;
