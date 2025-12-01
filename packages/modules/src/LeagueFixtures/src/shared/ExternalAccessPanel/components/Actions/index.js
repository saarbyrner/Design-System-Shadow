// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Button } from '@kitman/playbook/components';
import useExternalAccess from '../../hooks/useExternalAccess';

type Props = {
  onSubmit: () => void
};

const Actions = (props: I18nProps<Props>) => {
  const { handleOnToggle } = useExternalAccess();
  const boxStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  };

  return (
    <Box sx={boxStyle}>
      <Button onClick={() => handleOnToggle(false)} color="secondary">
        {props.t('Cancel')}
      </Button>
      <Button onClick={() => props.onSubmit()}>{props.t('Request')}</Button>
    </Box>
  );
};

export default Actions;
export const ActionsTranslated = withNamespaces()(Actions);
