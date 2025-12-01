// @flow
import { withNamespaces } from 'react-i18next';
import _cloneDeep from 'lodash/cloneDeep';
import { type ComponentType } from 'react';

import type {
  Condition,
  ElementTypes,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import { Autocomplete, TextField } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  condition?: Condition,
  initialQuestion?: HumanInputFormElement,
  index: number,
  subIndex: number,
  elementType: ElementTypes,
  setFollowUpQuestionsModal: Function,
};

const ConditionTypeSelector = ({
  t,
  condition,
  subIndex,
  setFollowUpQuestionsModal,
  elementType,
  index,
}: I18nProps<Props>) => {
  const getConditionTypesByElementType = () => {
    switch (elementType) {
      case INPUT_ELEMENTS.Number:
        return {
          '==': t('Equals to'),
          '!=': t('Not equals'),
          '<=': t('Less than or equals'),
          '<': t('Less than'),
          '>': t('Greater than'),
          '>=': t('Greater than or equals'),
        };
      case INPUT_ELEMENTS.MultipleChoice: {
        return { in: t('Equals to'), '!=': t('Not equals') };
      }
      default:
        return {
          '==': t('Equals to'),
          '!=': t('Not equals'),
        };
    }
  };

  const conditionTypeOptions = Object.entries(
    getConditionTypesByElementType()
  ).map(([key, label]) => ({
    id: key,
    label,
  }));

  return (
    <Autocomplete
      fullWidth
      size="small"
      disablePortal
      disableClearable
      value={conditionTypeOptions.find((option) => {
        return option.id === condition?.type;
      })}
      onChange={(e, value) => {
        setFollowUpQuestionsModal((prevState) => {
          const updatedQuestions = _cloneDeep(prevState);
          const targetCondition =
            subIndex !== null
              ? updatedQuestions[index]?.condition?.conditions[subIndex]
              : updatedQuestions[index]?.condition;

          targetCondition.type = value.id;

          return updatedQuestions;
        });
      }}
      options={conditionTypeOptions}
      renderInput={(params) => <TextField {...params} label={t('Answer')} />}
    />
  );
};

export const ConditionTypeSelectorTranslated: ComponentType<Props> =
  withNamespaces()(ConditionTypeSelector);
export default ConditionTypeSelector;
