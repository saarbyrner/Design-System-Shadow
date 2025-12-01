// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Button } from '@kitman/playbook/components';
import useCreateFixture from '../../hooks/useCreateFixture';

const Actions = (props: I18nProps<{}>) => {
  const { handleOnToggle } = useCreateFixture();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Button color="secondary" onClick={() => handleOnToggle(false)}>
        {props.t('Cancel')}
      </Button>
      <Button onClick={() => {}}>{props.t('Save')}</Button>
    </Box>
  );
};

export default Actions;
export const ActionsTranslated = withNamespaces()(Actions);
