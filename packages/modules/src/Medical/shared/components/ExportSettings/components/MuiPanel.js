// @flow
import type { ComponentType, Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { Divider, Button, Drawer } from '@kitman/playbook/components';
import { useExportSettings } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Context';

type Props = {
  title: string,
  isOpen: boolean,
  children: Node,
  requiredKeys?: Array<string>,
  saveButtonTitle?: string,
};

export const MuiPanel = ({
  title,
  isOpen,
  children,
  requiredKeys,
  saveButtonTitle,
  t,
}: I18nProps<Props>) => {
  const theme = useTheme();

  const { onSave, onCancel, formState } = useExportSettings();

  const shouldDisableDownload = requiredKeys?.some((requiredKey) => {
    const formValue = formState[requiredKey];
    return (
      !formValue ||
      // population
      (Array.isArray(formValue) && formValue.length === 0) ||
      // date range
      (Array.isArray(formValue) && formValue.some((value) => !value))
    );
  });

  const renderContent = () => {
    return (
      <>
        <DrawerLayout.Title title={title} onClose={onCancel} />
        <Divider />
        <DrawerLayout.Content p={0}>{children}</DrawerLayout.Content>
        <Divider />
        <DrawerLayout.Actions>
          <Button color="secondary" onClick={onCancel}>
            {t('Cancel')}
          </Button>
          <Button onClick={onSave} disabled={shouldDisableDownload}>
            {saveButtonTitle || t('Download')}
          </Button>
        </DrawerLayout.Actions>
      </>
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      sx={drawerMixin({ theme, isOpen, drawerWidth: 475 })}
    >
      {renderContent()}
    </Drawer>
  );
};

export const MuiPanelTranslated: ComponentType<Props> =
  withNamespaces()(MuiPanel);
export default MuiPanel;
