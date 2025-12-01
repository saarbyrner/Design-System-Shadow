// @flow
import { withNamespaces } from 'react-i18next';

import {
  Box,
  Typography,
  IconButton,
  Divider,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  title: string,
  avatarUrl?: string,
  userName?: string,
  handleBack?: () => void,
  showStatus?: boolean,
  backLabel?: string,
};

const Header = ({ title, handleBack, backLabel = '' }: I18nProps<Props>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      {handleBack && backLabel ? (
        <Box
          display="flex"
          alignItems="center"
          onClick={handleBack}
          sx={{ cursor: 'pointer', p: 2 }}
        >
          <IconButton size="small">
            <KitmanIcon
              name={KITMAN_ICON_NAMES.ArrowBackIos}
              fontSize="small"
            />
          </IconButton>
          <Typography variant="subtitle2" color={colors.grey_200}>
            {backLabel}
          </Typography>
          <Divider sx={{ px: 1 }} orientation="vertical" flexItem />
        </Box>
      ) : (
        handleBack && (
          <IconButton size="small" onClick={handleBack}>
            <KitmanIcon
              name={KITMAN_ICON_NAMES.ArrowBackIos}
              fontSize="small"
            />
          </IconButton>
        )
      )}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ flexGrow: 1, minWidth: 0 }}
      >
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Typography
            noWrap
            variant="h5"
            color={colors.grey_200}
            sx={{
              typography: { sm: 'subtitle1', xs: 'subtitle1', md: 'h5' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
