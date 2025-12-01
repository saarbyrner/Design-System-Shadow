// @flow
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { Grid, SelectWrapper } from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import { dateTimeQuestionTypeOptions } from '@kitman/modules/src/FormTemplates/shared/consts';

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const DateTime = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { type = 'date' } = questionElement.config;

  return (
    <Grid sx={{ pb: 2 }} container spacing={3}>
      <Grid item>
        <SelectWrapper
          label={t('Type')}
          onChange={(e) => {
            updateQuestionElement(
              {
                questionIndex,
                field: 'config',
                value: {
                  ...questionElement.config,
                  type: e.target.value,
                },
              },
              dispatch,
              isChildOfGroup,
              groupIndex
            );
          }}
          options={dateTimeQuestionTypeOptions}
          value={type}
        />
      </Grid>
    </Grid>
  );
};

export const DateTimeQuestionTranslated: ComponentType<Props> =
  withNamespaces()(DateTime);
export default DateTime;
