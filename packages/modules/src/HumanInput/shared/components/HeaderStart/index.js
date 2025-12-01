// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';
import { getFormStatusFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { renderStatusChip } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormStatus } from '@kitman/modules/src/HumanInput/types/forms';

type Props = {
  title: string,
  avatarUrl?: string,
  userName?: string,
  handleBack?: () => void,
  showStatus?: boolean,
  backLabel?: string,
};

const HeaderStart = ({
  title,
  avatarUrl,
  userName,
  handleBack,
  showStatus = true,
}: I18nProps<Props>) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isDraftModeFFOn = window.featureFlags['form-renderer-draft-mode'];
  const formStatus: FormStatus = useSelector(getFormStatusFactory());
  const formTitle = userName ? `${title} - ${userName}` : title;

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTap = () => {
    setTooltipOpen((prev) => !prev);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      {handleBack && (
        <IconButton size="small" onClick={handleBack}>
          <KitmanIcon name={KITMAN_ICON_NAMES.ArrowBackIos} fontSize="small" />
        </IconButton>
      )}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ flexGrow: 1, minWidth: 0 }}
      >
        {avatarUrl && (
          <Avatar
            alt={userName}
            src={avatarUrl || '/broken-image.jpg'}
            sx={{
              width: 45,
              height: 45,
              mr: 1,
              display: { xs: 'none', sm: 'flex' },
            }}
          />
        )}
        <Tooltip
          title={formTitle}
          onClose={handleTooltipClose}
          open={tooltipOpen}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="bottom"
          arrow
        >
          <Box sx={{ width: '100%', minWidth: 0 }} onClick={handleTap}>
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
              {formTitle}
            </Typography>
          </Box>
        </Tooltip>
        {showStatus && isDraftModeFFOn && renderStatusChip(formStatus)}
      </Box>
    </Box>
  );
};

export const HeaderStartTranslated = withNamespaces()(HeaderStart);
export default HeaderStart;
