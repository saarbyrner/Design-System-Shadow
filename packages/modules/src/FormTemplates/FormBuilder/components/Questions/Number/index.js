// @flow
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { Grid, TextField } from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const NumberQuestion = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { custom_params: customParams = {} } = questionElement.config;
  const { unit = '' } = customParams;
  const disabled = !!questionElement.config.variable;

  useEffect(() => {
    if (questionElement.config.type !== 'float') {
      updateQuestionElement(
        {
          questionIndex,
          field: 'config',
          value: {
            ...questionElement.config,
            type: 'float',
          },
        },
        dispatch,
        isChildOfGroup,
        groupIndex
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container sx={{ pb: 2 }} spacing={3}>
      <Grid item>
        <TextField
          label={t('Unit')}
          value={unit}
          disabled={disabled}
          onChange={(e) =>
            updateQuestionElement(
              {
                questionIndex,
                field: 'config',
                value: {
                  ...questionElement.config,
                  type: 'float',
                  custom_params: {
                    ...questionElement.config.custom_params,
                    unit: e.target.value,
                  },
                },
              },
              dispatch,
              isChildOfGroup,
              groupIndex
            )
          }
        />
      </Grid>
    </Grid>
  );
};

export const NumberQuestionTranslated: ComponentType<Props> =
  withNamespaces()(NumberQuestion);
export default NumberQuestion;
