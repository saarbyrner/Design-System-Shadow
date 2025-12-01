// @flow
import type { Node } from 'react';

import { colors } from '@kitman/common/src/variables';
import { ListItemIcon } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';

type Props = {
  status: ValidationStatus,
};

const Status = (props: Props): Node => {
  const sharedProps = {
    fontSize: 20,
  };
  const minWidth = 20;
  const style = { minWidth, mr: 2 };

  switch (props.status) {
    case 'INVALID': {
      return (
        <ListItemIcon sx={style}>
          <KitmanIcon
            name={KITMAN_ICON_NAMES.Error}
            sx={{ color: colors.red_100, ...sharedProps }}
          />
        </ListItemIcon>
      );
    }

    case 'VALID': {
      return (
        <ListItemIcon sx={style}>
          <KitmanIcon
            name={KITMAN_ICON_NAMES.CheckCircle}
            sx={{ color: colors.green_100, ...sharedProps }}
          />
        </ListItemIcon>
      );
    }
    default:
      return (
        <ListItemIcon sx={style}>
          <KitmanIcon
            name={KITMAN_ICON_NAMES.DonutLarge}
            sx={{ color: colors.grey_disabled, ...sharedProps }}
          />
        </ListItemIcon>
      );
  }
};

export default Status;
