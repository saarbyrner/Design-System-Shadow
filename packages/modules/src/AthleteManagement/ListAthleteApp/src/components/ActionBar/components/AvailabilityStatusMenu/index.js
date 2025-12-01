// @flow

import { withNamespaces } from 'react-i18next';
import {
  Box,
  Menu,
  Button,
  Divider,
  MenuItem,
  ListItemText,
  CircularProgress,
} from '@kitman/playbook/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  anchorEl: Object,
  statusDataFetching: boolean,
  isBulkUpdateAvailabilityStatuLoading: boolean,
  statusOptions: Array<string>,
  selectedStatus: string,
  onSaveClick: () => Promise<void>,
  onCloseMenu: () => void,
  handleAvailabilityStatusChange: (newLabel: string | null) => void,
};

const AvailabilityStatusMenu = ({
  anchorEl,
  statusDataFetching,
  isBulkUpdateAvailabilityStatuLoading,
  statusOptions,
  selectedStatus,
  onSaveClick,
  handleAvailabilityStatusChange,
  onCloseMenu,
  t,
}: I18nProps<Props>) => {
  const onCancel = (): void => {
    onCloseMenu();
    handleAvailabilityStatusChange(null);
  };

  const onSave = async (): Promise<void> => {
    await onSaveClick();
    onCancel();
  };

  return (
    <Menu
      id="basic-menu-labels"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onCloseMenu}
      slotProps={{ paper: { sx: { minWidth: '16.25rem' } } }}
      MenuListProps={{
        'aria-labelledby': 'assign-status-button',
      }}
    >
      {statusDataFetching ? (
        <Box justifyContent="center" display="flex" p={1}>
          <CircularProgress size="2rem" />
        </Box>
      ) : (
        statusOptions?.map((status) => {
          return (
            <MenuItem
              onClick={() => handleAvailabilityStatusChange(status)}
              key={status}
              selected={status === selectedStatus}
            >
              <ListItemText>{status}</ListItemText>
            </MenuItem>
          );
        })
      )}
      <Divider sx={{ margin: 0 }} />
      <Box
        display="flex"
        p="0.25rem 1rem"
        justifyContent="space-between"
        width="100%"
      >
        <Button
          disabled={isBulkUpdateAvailabilityStatuLoading}
          sx={{ mt: 2 }}
          onClick={onCancel}
          variant="secondary"
        >
          {t('Cancel')}
        </Button>
        <Button
          disabled={isBulkUpdateAvailabilityStatuLoading || !selectedStatus}
          sx={{ mt: 2 }}
          onClick={onSave}
        >
          {t('Save')}
        </Button>
      </Box>
    </Menu>
  );
};

export const AvailabilityStatusMenuTranslated = withNamespaces()(
  AvailabilityStatusMenu
);
export default AvailabilityStatusMenu;
