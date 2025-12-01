// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import {
  IconButton,
  Stack,
  Snackbar,
  Typography,
  Link,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import styles from './styles';

type Props = {
  openSnackbar: boolean,
  isSuccess: boolean,
};

const exportUrl = window.featureFlags['side-nav-update']
  ? '/administration/exports'
  : '/settings/exports';

const SnackbarDialog = ({ openSnackbar, isSuccess, t }: I18nProps<Props>) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  useEffect(() => {
    if (openSnackbar) {
      setIsSnackbarOpen(true);
    }
  }, [openSnackbar]);
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      key="injury-surveillance-report-snackbar"
      sx={styles.snackbar(isSuccess)}
      open={isSnackbarOpen}
      autoHideDuration={6000}
      onClose={() => setIsSnackbarOpen(false)}
      message={
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <KitmanIcon
            sx={{ color: styles.statusColor(isSuccess) }}
            name={
              isSuccess
                ? KITMAN_ICON_NAMES.CheckCircle
                : KITMAN_ICON_NAMES.ErrorRoundedIcon
            }
          />
          <Stack spacing={1}>
            <Typography variant="h6" sx={styles.snackbarHeader}>
              {isSuccess ? t('Export successful') : t('Export failed')}
            </Typography>
            {isSuccess && (
              <>
                <Typography variant="body1">
                  {t('You can find the download link here:')}
                </Typography>
                <Link sx={styles.snackbarLink} href={exportUrl}>
                  {t('Exports')}
                </Link>
              </>
            )}
          </Stack>
        </Stack>
      }
      action={
        <IconButton onClick={() => setIsSnackbarOpen(false)}>
          <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.Close} />
        </IconButton>
      }
    />
  );
};

export const SnackbarDialogTranslated: ComponentType<Props> =
  withNamespaces()(SnackbarDialog);
export default SnackbarDialog;
