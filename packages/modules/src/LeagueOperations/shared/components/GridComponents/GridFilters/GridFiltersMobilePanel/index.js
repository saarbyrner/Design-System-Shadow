// @flow
import { Box, Button, Drawer, Stack } from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import ManageSectionLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ManageSectionLayout';

type Props = {
  isOpen: boolean,
  children: React$Node,
  onClose: Function,
  onSave: Function,
  clearAll: Function,
};

export default function GridFiltersMobilePanel({
  isOpen,
  children,
  onClose,
  onSave,
  clearAll,
}: Props) {
  const theme = useTheme();
  const renderContent = () => {
    if (!isOpen) return null;

    return (
      <ManageSectionLayout sx={{ overflowY: 'visible' }}>
        <ManageSectionLayout.Title
          title={i18n.t('Filters')}
          onClose={onClose}
        />
        <ManageSectionLayout.Content sx={{ overflowY: 'visible' }}>
          <Box
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '1rem',
              paddingTop: '0.5rem',
              gap: 1,
            }}
          >
            {children}
            <Button sx={{ width: '100%' }} onClick={clearAll}>
              {i18n.t('Clear all')}
            </Button>
          </Box>
        </ManageSectionLayout.Content>
        <ManageSectionLayout.Actions>
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            width="100%"
          >
            <Button onClick={onClose} color="secondary">
              {i18n.t('Cancel')}
            </Button>
            <Button onClick={onSave}>{i18n.t('Save')}</Button>
          </Stack>
        </ManageSectionLayout.Actions>
      </ManageSectionLayout>
    );
  };

  const drawerStyles = drawerMixin({ theme, isOpen });

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={onClose}
      sx={{
        ...drawerStyles,
        '& .MuiDrawer-paper': {
          ...drawerStyles['& .MuiDrawer-paper'],
          overflowX: 'visible',
          overflowY: 'visible',
        },
      }}
    >
      {renderContent()}
    </Drawer>
  );
}
