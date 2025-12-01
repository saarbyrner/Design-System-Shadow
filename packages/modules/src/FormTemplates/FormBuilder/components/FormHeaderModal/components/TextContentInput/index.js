// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import {
  FormControl,
  FormControlLabel,
  TextField,
  Switch,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  text: { content: string, hidden: boolean },
  handleChange: ({
    content?: string,
    hidden?: boolean,
    color?: string,
  }) => void,
};

const TextContentInput = ({ t, text, handleChange }: I18nProps<Props>) => {
  return (
    <FormControl sx={{ display: 'flex', flexDirection: 'row', my: 2 }}>
      <TextField
        id="org-name-text-field"
        label={t('Text')}
        value={text.content}
        onChange={(e) => handleChange({ content: e.target.value })}
        sx={{ mr: 2 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={text.hidden}
            onChange={() => handleChange({ hidden: !text.hidden })}
            inputProps={{ 'aria-label': 'hidden-text' }}
          />
        }
        label={t('Hide')}
      />
    </FormControl>
  );
};

export const TextContentInputTranslated: ComponentType<Props> =
  withNamespaces()(TextContentInput);
export default TextContentInput;
