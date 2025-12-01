// @flow
import { withNamespaces } from 'react-i18next';
import type { Node } from 'react';
import { Button, Stack } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onClickNext: Function,
  onClickPrevious: Function,
  isNextDisabled: boolean,
  isPreviousDisabled: boolean,
};

const Footer = (props: I18nProps<Props>): Node => {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        onClick={props.onClickPrevious}
        disabled={props.isPreviousDisabled}
      >
        {props.t('Back')}
      </Button>

      <Button
        size="small"
        variant="contained"
        onClick={props.onClickNext}
        disabled={props.isNextDisabled}
      >
        {props.t('Next')}
      </Button>
    </Stack>
  );
};

export const FooterTranslated = withNamespaces()(Footer);
export default Footer;
