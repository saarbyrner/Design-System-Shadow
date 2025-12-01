// @flow
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import type { ComponentType } from 'react';

import { Textarea } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OnUpdateEventDetails } from '../../types';

export type Props = {
  description: ?string,
  onUpdateEventDetails: OnUpdateEventDetails,
  maxLength: number,
};

const style = {
  description: css`
    .textarea__input--kitmanDesignSystem {
      min-height: 84px;
    }
  `,
  charactersRemaining: css`
    color: ${colors.grey_300_50};
    font-size: 12px;
    text-align: right;
  `,
};

const DescriptionField = (props: I18nProps<Props>) => {
  return (
    <div css={style.description}>
      <Textarea
        label={props.t('Description')}
        value={props.description || ''}
        onChange={(text) => {
          props.onUpdateEventDetails({
            description: text.slice(0, props.maxLength),
          });
        }}
        minLimit={0}
        maxLimit={props.maxLength}
        kitmanDesignSystem
        optionalText={props.t('Optional')}
      />
      <div css={style.charactersRemaining}>
        {props.t('{{remainingCharacters}} characters remaining', {
          remainingCharacters: props.description
            ? props.maxLength - props.description.length
            : props.maxLength,
        })}
      </div>
    </div>
  );
};

export const DescriptionFieldTranslated: ComponentType<Props> =
  withNamespaces()(DescriptionField);
export default DescriptionField;
