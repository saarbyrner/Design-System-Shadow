// @flow
import { useState, useEffect } from 'react';
import {
  Drawer,
  Typography,
  IconButton,
  Stack,
  Button,
} from '@kitman/playbook/components';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useTheme } from '@kitman/playbook/hooks';
import SnackbarDialog from './SnackbarDialog';
import styles from './styles';

type Props = {
  isOpen: boolean,
  onClose: Function,
  title: string,
  children: React$Node,
  exportReport: Function,
  openSnackbar: boolean,
  isSuccess: boolean,
  isExportDisabled: boolean,
};

const LayoutReport = ({
  isOpen,
  onClose,
  title,
  children,
  exportReport,
  openSnackbar,
  isSuccess,
  isExportDisabled,
  t,
}: I18nProps<Props>) => {
  const theme = useTheme();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  useEffect(() => {
    if (openSnackbar) {
      setIsSnackbarOpen(true);
    }
  }, [openSnackbar]);
  return (
    <>
      <Drawer
        open={isOpen}
        anchor="right"
        onClose={onClose}
        css={styles.drawer}
        sx={drawerMixin({ theme, isOpen, drawerWidth: 460 })}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={styles.drawerHeader}
        >
          <Typography sx={styles.drawerTitle} variant="h6">
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.Close} />
          </IconButton>
        </Stack>
        <Stack spacing={2} flexGrow={1} sx={styles.drawerBody}>
          {children}
        </Stack>
        <Stack
          sx={styles.drawerFooter}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button onClick={exportReport} disabled={isExportDisabled}>
            {t('Export')}
          </Button>
        </Stack>
      </Drawer>
      <SnackbarDialog
        isSuccess={isSuccess}
        openSnackbar={isSnackbarOpen}
        t={t}
      />
    </>
  );
};

export const LayoutReportTranslated: ComponentType<Props> =
  withNamespaces()(LayoutReport);
export default LayoutReport;
