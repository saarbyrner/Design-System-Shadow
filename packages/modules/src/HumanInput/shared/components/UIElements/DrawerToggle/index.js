// @flow
import { Box, IconButton } from '@kitman/playbook/components';
import { useTheme } from '@kitman/playbook/hooks';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { drawerToggleMixin } from '@kitman/modules/src/HumanInput/shared/mixins';

type Props = {
  onToggle: Function,
  isOpen: boolean,
};

const DrawerToggle = (props: Props) => {
  const theme = useTheme();

  return (
    <Box sx={drawerToggleMixin({ theme, isOpen: props.isOpen })}>
      <IconButton onClick={props.onToggle} disableRipple>
        {props.isOpen ? (
          <KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />
        ) : (
          <KitmanIcon name={KITMAN_ICON_NAMES.ChevronRight} />
        )}
      </IconButton>
    </Box>
  );
};

export default DrawerToggle;
