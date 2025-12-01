// @flow
import { withNamespaces } from 'react-i18next';
import { useState } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  IconButton,
  Stack,
} from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import downloadCsvTemplate from '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';

type Props = {
  setIsDrawerOpen: (isOpen: boolean) => void,
};

const KitManagementHeader = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const canManageKits = permissions?.leagueGame.manageKits;
  const { isLeague } = useLeagueOperations();
  const locationAssign = useLocationAssign();
  const [menuAnchorEl, setMenuAnchorEl] = useState<?HTMLElement>(null);
  const isMenuOpen = !!menuAnchorEl;

  const showMassUploadButton = useImportConfig({
    importType: IMPORT_TYPES.KitMatrix,
    permissions,
  })?.enabled;

  const handleMenuClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDownloadTemplate = () => {
    downloadCsvTemplate('Kits_template_csv', IMPORT_TYPES.KitMatrix);
    handleMenuClose();
  };

  const renderKitManagementMenu = () => {
    if (!isLeague && !showMassUploadButton) return null;

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Box>
          <Button
            color="secondary"
            onClick={() => {
              locationAssign(`/mass_upload/${IMPORT_TYPES.KitMatrix}`);
            }}
          >
            {props.t('Upload kits')}
          </Button>
        </Box>
        <ButtonGroup
          orientation="horizontal"
          variant="contained"
          sx={{
            boxShadow: 'none',
            backgroundColor: 'secondary.main',
          }}
        >
          <IconButton
            onClick={handleMenuClick}
            aria-controls={isMenuOpen ? 'kit-management-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            size="small"
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
          </IconButton>
        </ButtonGroup>
        <Menu
          id="kit-management-menu"
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'kit-management-menu-button',
          }}
        >
          <MenuItem onClick={handleDownloadTemplate}>
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Download}
              sx={{ mr: 1, fontSize: 20 }}
            />
            {props.t('Kits template csv')}
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  return (
    <HeaderLayout.Content>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {props.t('Kit Sets')}
      </Typography>
      {canManageKits && (
        <Stack direction="row" spacing={1}>
          <Button color="primary" onClick={() => props.setIsDrawerOpen(true)}>
            {props.t('Add Kit Set')}
          </Button>
          {renderKitManagementMenu()}
        </Stack>
      )}
    </HeaderLayout.Content>
  );
};

export const KitManagementHeaderTranslated =
  withNamespaces()(KitManagementHeader);
export default KitManagementHeader;
