// @flow
import { useDispatch } from 'react-redux';
import { useEffect, useState, type ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  setShowFormHeaderModal,
  setBrandingHeaderConfig,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import type { BrandingHeaderConfig } from '@kitman/modules/src/HumanInput/types/forms';

type Props = {
  header: BrandingHeaderConfig,
  showMenu: boolean,
};

const FormBrandingHeader = ({ header, showMenu, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { image, text, color, layout } = header;

  const [logoUrl, setLogoUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const { data: organisation, isSuccess: hasOrganisationDataLoaded } =
    useGetOrganisationQuery();

  const showDefaultOrgLogo =
    image.current_organisation_logo && hasOrganisationDataLoaded;

  useEffect(() => {
    const fetchLogo = async () => {
      if (image?.attachment && !image.current_organisation_logo) {
        const { url } = image.attachment;

        setLogoUrl(url);
      }
    };

    fetchLogo();
  }, [
    image?.attachment_id,
    image.current_organisation_logo,
    image?.attachment,
  ]);

  const getFlexDirection = (layoutConfig) => {
    if (layoutConfig === 'center') return 'column';
    return 'row';
  };

  const getJustifyContent = (layoutConfig) => {
    if (layoutConfig === 'center') return 'center';
    if (layoutConfig === 'right') return 'flex-end';
    return 'flex-start';
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      flexDirection={getFlexDirection(layout)}
      alignItems="center"
      justifyContent={getJustifyContent(layout)}
      sx={{
        backgroundColor: color.primary,
        width: '100%',
        height: { xs: '3.5rem', sm: '4rem', md: '5rem' },
        p: 2,
        position: 'relative',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {!image.hidden && (
        <img
          src={showDefaultOrgLogo ? organisation.logo_full_path : logoUrl}
          alt={t('logo')}
          style={{ width: '2.5rem', height: '2.5rem' }}
        />
      )}
      {!text.hidden && (
        <Typography variant="subtitle2" color={text.color} sx={{ mx: 1 }}>
          {text.content}
        </Typography>
      )}
      {showMenu && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ml: 1,
          }}
        >
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ color: text.color }}
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                dispatch(setShowFormHeaderModal(true));
                handleMenuClose();
              }}
            >
              {t('Edit')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(setBrandingHeaderConfig({ headerConfig: null }));
                handleMenuClose();
              }}
            >
              {t('Delete')}
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export const FormBrandingHeaderTranslated: ComponentType<Props> =
  withNamespaces()(FormBrandingHeader);
export default FormBrandingHeader;
