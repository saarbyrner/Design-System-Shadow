// @flow
import { KitmanIcon, type KitmanIconName } from '@kitman/playbook/icons';
import {
  Typography,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@kitman/playbook/components';

import style from './style';
import { tooltipSlotProps } from './consts';

export const ParticipantsCount = ({
  icon,
  tooltip,
  available,
  total,
  onClick,
}: {
  icon: KitmanIconName,
  tooltip: string,
  available?: number,
  total?: number,
  onClick?: () => void,
}) => (
  <Stack sx={style.stack} direction="row" spacing={0.4}>
    {[available, total].every((count) => typeof count === 'number') ? (
      <>
        <Tooltip
          title={tooltip}
          placement="bottom-start"
          slotProps={tooltipSlotProps}
          sx={style.tooltip}
        >
          <IconButton sx={style.tooltipIconButton} onClick={onClick}>
            <KitmanIcon name={icon} />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">
          {available}/{total}
        </Typography>
      </>
    ) : (
      <CircularProgress size={16} sx={{ margin: 0.2 }} />
    )}
  </Stack>
);
