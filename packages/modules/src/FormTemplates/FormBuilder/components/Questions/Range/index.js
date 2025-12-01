// @flow
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import {
  Grid,
  TextField,
  SelectWrapper,
  FormHelperText,
} from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import {
  rangeQuestionTypeOptions,
  incrementOptions,
} from '@kitman/modules/src/FormTemplates/shared/consts';

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const RangeQuestion = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const {
    min = '',
    max = '',
    custom_params: customParams = {},
  } = questionElement.config;
  const { style = '', increment = 1 } = customParams;

  const disabled = !!questionElement.config.variable;

  const isRatingType = style === 'rating';
  const isMinNegative = isRatingType && parseInt(min, 10) < 0;
  const isMaxOver20 = isRatingType && parseInt(max, 10) > 20;

  return (
    <Grid sx={{ pl: 3, pt: 2 }} container direction="column" spacing={3}>
      <Grid sx={{ pb: 2 }} container spacing={3}>
        <Grid item>
          <TextField
            label={t('Min')}
            value={min}
            disabled={disabled}
            onChange={(e) => {
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    min: e.target.value,
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              );
            }}
            error={isMinNegative}
            aria-describedby="component-error-text"
          />
          {isMinNegative && (
            <FormHelperText error id="component-error-text">
              {t('Enter a positive number')}
            </FormHelperText>
          )}
        </Grid>
        <Grid item>
          <TextField
            label={t('Max')}
            value={max}
            disabled={disabled}
            onChange={(e) => {
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    max: e.target.value,
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              );
            }}
            error={isMaxOver20}
            aria-describedby="component-error-text-max"
          />
          {isMaxOver20 && (
            <FormHelperText error id="component-error-text-max">
              {t('Max value must be 20 or less')}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
      <Grid sx={{ pb: 2 }} container spacing={3}>
        <Grid item>
          <SelectWrapper
            minWidth={200}
            label={t('Type')}
            onChange={(e) => {
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    custom_params: {
                      ...questionElement.config.custom_params,
                      style: e.target.value,
                    },
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              );
            }}
            options={rangeQuestionTypeOptions}
            value={style}
          />
        </Grid>
        <Grid item>
          <SelectWrapper
            minWidth={200}
            label={t('Increment')}
            onChange={(e) => {
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    custom_params: {
                      ...questionElement.config.custom_params,
                      increment: e.target.value,
                    },
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              );
            }}
            options={incrementOptions}
            value={increment}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const RangeQuestionTranslated: ComponentType<Props> =
  withNamespaces()(RangeQuestion);
export default RangeQuestion;
