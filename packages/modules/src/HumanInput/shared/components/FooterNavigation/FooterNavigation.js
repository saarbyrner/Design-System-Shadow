// @flow
import { withNamespaces } from 'react-i18next';

import { Box, Button } from '@kitman/playbook/components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@kitman/playbook/hooks';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  canNavigateBack: boolean,
  canNavigateForward: boolean,
  onBackTriggered: () => void,
  onForwardTriggered: () => void,
};

const FooterNavigation = (props: I18nProps<Props>) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div css={{ display: 'flex', gap: '5px' }}>
        <Button
          color="secondary"
          variant="contained"
          onClick={props.onBackTriggered}
          disabled={!props.canNavigateBack}
          size={isMobileView ? 'small' : 'medium'}
          startIcon={
            !isMobileView && <KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />
          }
        >
          {isMobileView ? (
            <KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />
          ) : (
            props.t('Back')
          )}
        </Button>
        <Button
          variant={props.canNavigateForward ? 'contained' : 'outlined'}
          onClick={props.onForwardTriggered}
          disabled={!props.canNavigateForward}
          size={isMobileView ? 'small' : 'medium'}
          endIcon={
            !isMobileView && (
              <KitmanIcon name={KITMAN_ICON_NAMES.ChevronRight} />
            )
          }
        >
          {isMobileView ? (
            <KitmanIcon name={KITMAN_ICON_NAMES.ChevronRight} />
          ) : (
            props.t('Next')
          )}
        </Button>
      </div>
    </Box>
  );
};

export const FooterNavigationTranslated = withNamespaces()(FooterNavigation);
export default FooterNavigation;
