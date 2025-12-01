// @flow
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import {
  Grid,
  FormControlLabel,
  Checkbox,
  SelectWrapper,
} from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { textStyleOptions } from '@kitman/modules/src/FormTemplates/shared/consts';
import { CountryCodeSelectorTranslated as CountryCodeSelector } from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput/components/PhoneSelector/CountryCodeSelector';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const TextQuestion = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { custom_params: customParams = {} } = questionElement.config;
  const { style = '', type = 'standard' } = customParams;

  return (
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
                    type: e.target.value,
                    unit: '',
                  },
                },
              },
              dispatch,
              isChildOfGroup,
              groupIndex
            );
          }}
          options={textStyleOptions}
          value={type}
        />
      </Grid>
      {type === 'standard' && (
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={style === 'multiline'}
                onChange={(e) => {
                  updateQuestionElement(
                    {
                      questionIndex,
                      field: 'config',
                      value: {
                        ...questionElement.config,
                        custom_params: {
                          ...questionElement.config.custom_params,
                          style: e.target.checked ? 'multiline' : null,
                        },
                      },
                    },
                    dispatch,
                    isChildOfGroup,
                    groupIndex
                  );
                }}
              />
            }
            label={t('Multiline')}
          />
        </Grid>
      )}
      {type === 'phone' && (
        <Grid item sx={{ width: '18rem' }}>
          <CountryCodeSelector
            label={t('Default country code')}
            countryISOCode=""
            onChange={(countryCode) => {
              updateQuestionElement(
                {
                  questionIndex,
                  field: 'config',
                  value: {
                    ...questionElement.config,
                    custom_params: {
                      ...questionElement.config.custom_params,
                      default_country_code: countryCode,
                    },
                  },
                },
                dispatch,
                isChildOfGroup,
                groupIndex
              );
            }}
            value={customParams.default_country_code || ''}
          />
        </Grid>
      )}
    </Grid>
  );
};

export const TextQuestionTranslated: ComponentType<Props> =
  withNamespaces()(TextQuestion);
export default TextQuestion;
