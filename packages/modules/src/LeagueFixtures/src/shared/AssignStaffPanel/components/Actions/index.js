// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Button } from '@kitman/playbook/components';
import useAssignStaffPanel from '../../hooks/useAssignStaffPanel';

type Props = {
  onSubmit: () => void,
  isDisabled?: boolean,
};

const Actions = (props: I18nProps<Props>) => {
  const { handleOnToggle } = useAssignStaffPanel();
  const boxStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  };

  return (
    <Box sx={boxStyle}>
      <Button onClick={() => handleOnToggle(null)} color="secondary">
        {props.t('Cancel')}
      </Button>
      <Button onClick={() => props.onSubmit()} disabled={props.isDisabled}>
        {props.t('Save')}
      </Button>
    </Box>
  );
};

export default Actions;
export const ActionsTranslated = withNamespaces()(Actions);
