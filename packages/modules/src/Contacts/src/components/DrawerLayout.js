// @flow
import { Divider, Stack, Button, Drawer } from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useTheme } from '@kitman/playbook/hooks';

type Props = {
  onClose: () => void,
  onSave: () => void,
  isOpen: boolean,
  isSaving: boolean,
  children: any,
};

const DrawerLayout = ({
  onClose,
  onSave,
  isOpen,
  isSaving,
  children,
  t,
}: I18nProps<Props>) => {
  const theme = useTheme();

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={onClose}
      sx={drawerMixin({ theme, isOpen, drawerWidth: 460 })}
    >
      {children}

      <Divider />

      <Stack
        px={3}
        py={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button variant="secondary" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? t('Saving...') : t('Save')}
        </Button>
      </Stack>
    </Drawer>
  );
};

export default withNamespaces()(DrawerLayout);
