// @flow

import { Box, IconButton, Typography } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { levelEnumLike } from '../../Menu/utils/enum-likes';
import { sxByLevel } from './styles';

type NameLevel =
  | $PropertyType<typeof levelEnumLike, 'menuGroup'>
  | $PropertyType<typeof levelEnumLike, 'menuItem'>
  | $PropertyType<typeof levelEnumLike, 'group'>;

export const createRenderContent = (level: NameLevel) => {
  return ({ value, onClick }: { value: String, onClick: () => void }) => {
    return (
      <Box display="flex" columnGap="0.875rem">
        <Typography sx={sxByLevel[level]}>{value}</Typography>
        <IconButton onClick={onClick} sx={{ padding: 0 }}>
          <KitmanIcon name={KITMAN_ICON_NAMES.Edit} />
        </IconButton>
      </Box>
    );
  };
};
