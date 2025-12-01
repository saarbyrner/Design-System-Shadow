// @flow
import { withNamespaces } from 'react-i18next';

import { colors } from '@kitman/common/src/variables';
import { Button, Stack, Typography } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  title: string,
  isSubmitDisabled: boolean,
  isSaveDisabled: boolean,
};

const Title = (props: I18nProps<Props>) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ color: colors.grey_400 }}>
        {props.title}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button size="small" disabled={props.isSaveDisabled}>
          {props.t('Save')}
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={props.isSubmitDisabled}
        >
          {props.t('Submit')}
        </Button>
      </Stack>
    </>
  );
};

export const TitleTranslated = withNamespaces()(Title);
export default Title;
