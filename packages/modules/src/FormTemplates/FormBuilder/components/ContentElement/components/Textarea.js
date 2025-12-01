// @flow

import { type ComponentType } from 'react';
import { TextField } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { useDispatch } from 'react-redux';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup?: boolean,
  groupIndex?: number,
};

const Textarea = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  return (
    <TextField
      multiline
      placeholder={t('Add a paragraph')}
      rows={6}
      sx={{ width: '70%', mb: 2 }}
      value={questionElement.config.text || ''}
      onChange={(e) =>
        updateQuestionElement(
          {
            questionIndex,
            field: 'config',
            value: {
              ...questionElement.config,
              text: e.target.value,
            },
          },
          dispatch,
          isChildOfGroup,
          groupIndex
        )
      }
    />
  );
};

export const TextareaTranslated: ComponentType<Props> =
  withNamespaces()(Textarea);
export default Textarea;
