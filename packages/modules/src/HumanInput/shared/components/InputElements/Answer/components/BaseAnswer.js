// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { ListItemText } from '@kitman/playbook/components';
import { DEFAULT_EMPTY_ANSWER_VALUE } from '@kitman/modules/src/HumanInput/shared/constants';
import { RichTextDisplay } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  text?: string,
  value?: string | boolean,
};

const BaseAnswer = ({
  text,
  value = DEFAULT_EMPTY_ANSWER_VALUE,
  t,
}: I18nProps<Props>) => {
  const getValue = (inputValue): string => {
    switch (typeof inputValue) {
      case 'boolean':
        if (inputValue) {
          return t('Yes');
        }
        return t('No');

      default:
        return inputValue;
    }
  };

  return (
    <ListItemText
      primary={text}
      primaryTypographyProps={{
        color: 'text.primary',
        fontSize: '15px',
      }}
      secondary={
        <RichTextDisplay value={getValue(value)} isAbbreviated={false} />
      }
      secondaryTypographyProps={{ color: 'text.secondary' }}
    />
  );
};

export const BaseAnswerTranslated: ComponentType<Props> =
  withNamespaces()(BaseAnswer);
export default BaseAnswer;
