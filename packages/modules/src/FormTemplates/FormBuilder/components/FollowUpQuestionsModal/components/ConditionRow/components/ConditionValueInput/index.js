// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import _cloneDeep from 'lodash/cloneDeep';
import type {
  Condition,
  ElementTypes,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import {
  Autocomplete,
  TextField,
  MenuItem,
  Select,
} from '@kitman/playbook/components';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  condition?: Condition,
  initialQuestion?: HumanInputFormElement,
  elementType: ElementTypes,
  index: number,
  subIndex: number,
  setFollowUpQuestionsModal: Function,
};

const ConditionValueInput = ({
  t,
  condition,
  subIndex,
  setFollowUpQuestionsModal,
  elementType,
  index,
  initialQuestion,
}: I18nProps<Props>) => {
  const getValueType = () => {
    if (initialQuestion?.element_type === INPUT_ELEMENTS.Boolean) {
      return 'boolean';
    }
    if (initialQuestion?.element_type === INPUT_ELEMENTS.Number) {
      return 'number';
    }
    return 'string';
  };

  const updateValue = (newValue) => {
    setFollowUpQuestionsModal((prevState) => {
      const updatedQuestions = _cloneDeep(prevState);
      const targetCondition =
        subIndex !== null
          ? updatedQuestions[index].condition.conditions[subIndex]
          : updatedQuestions[index].condition;

      targetCondition.value = newValue;
      targetCondition.value_type = getValueType();

      return updatedQuestions;
    });
  };

  const conditionValue = condition?.value;

  switch (elementType) {
    case INPUT_ELEMENTS.Text:
    case INPUT_ELEMENTS.Number:
    case INPUT_ELEMENTS.Range:
    case INPUT_ELEMENTS.DateTime:
      return (
        <TextField
          id="outlined-basic"
          value={conditionValue || ''}
          label={t('Value')}
          onChange={(e) => updateValue(e.target.value)}
        />
      );

    case INPUT_ELEMENTS.Boolean:
      return (
        <Select
          fullWidth
          labelId="boolean-answer-select-label"
          id="boolean-answer-select"
          value={conditionValue}
          label={t('Value')}
          onChange={(e) => updateValue(e.target.value)}
          MenuProps={{
            disablePortal: true,
          }}
        >
          <MenuItem value>{t('Yes')}</MenuItem>
          <MenuItem value={false}>{t('No')}</MenuItem>
        </Select>
      );

    case INPUT_ELEMENTS.SingleChoice:
    case INPUT_ELEMENTS.MultipleChoice:
      // eslint-disable-next-line no-case-declarations
      const conditionValueOptions =
        initialQuestion?.config?.items?.map(({ value, label }) => ({
          id: value,
          label,
        })) || [];

      return (
        <Autocomplete
          fullWidth
          disablePortal
          value={conditionValueOptions.find((option) => {
            return option.id === conditionValue;
          })}
          onChange={(e, value) => updateValue(value.id)}
          options={conditionValueOptions}
          isOptionEqualToValue={(option, value) => option.id === value}
          renderInput={(params) =>
            renderInput({
              params,
              label: t('Value'),
            })
          }
        />
      );

    default:
      return null;
  }
};

export const ConditionValueInputTranslated: ComponentType<Props> =
  withNamespaces()(ConditionValueInput);
export default ConditionValueInput;
