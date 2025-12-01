// @flow
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '@kitman/common/src/variables';
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
} from '@kitman/playbook/components';
import { FormHeaderModalTranslated as FormHeaderModal } from '@kitman/modules/src/FormTemplates/FormBuilder/components/FormHeaderModal';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  addMenuGroup,
  addMenuItemToCurrentMenuGroup,
  setShowFormHeaderModal,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  getShowFormHeaderModal,
  getFormHeaderBrandingConfig,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { getHeaderTranslations } from './utils/helpers';

const buttonAriaLabel = 'options-button';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const showFormHeaderModal: boolean = useSelector(getShowFormHeaderModal);
  const formHeaderBrandingConfig = useSelector(getFormHeaderBrandingConfig);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseFormHeaderModal = () => {
    dispatch(setShowFormHeaderModal(false));
  };

  const translations = getHeaderTranslations();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="1.5rem 1.125rem 1.5rem 1.5rem"
      borderBottom={`2px solid ${colors.neutral_300}`}
    >
      <Typography variant="h6">{translations.title}</Typography>
      <Button
        aria-label={buttonAriaLabel}
        color="secondary"
        endIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {translations.add}
      </Button>
      <Menu
        id="options-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': buttonAriaLabel,
        }}
      >
        <MenuItem
          onClick={() => {
            dispatch(setShowFormHeaderModal(true));
            handleCloseMenu();
          }}
          disabled={!!formHeaderBrandingConfig}
        >
          {translations.formHeader}
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(addMenuGroup());
            handleCloseMenu();
          }}
        >
          {translations.menuGroup}
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(addMenuItemToCurrentMenuGroup());
            handleCloseMenu();
          }}
        >
          {translations.menuItem}
        </MenuItem>
      </Menu>
      {showFormHeaderModal && (
        <FormHeaderModal
          isModalOpen={showFormHeaderModal}
          onCancel={handleCloseFormHeaderModal}
          onClose={handleCloseFormHeaderModal}
        />
      )}
    </Box>
  );
};

export default Header;
