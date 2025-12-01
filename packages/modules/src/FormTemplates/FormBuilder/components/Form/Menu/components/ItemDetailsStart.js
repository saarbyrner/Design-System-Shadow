// @flow
import { Box, Typography, Tooltip } from '@kitman/playbook/components';
import DragHandle from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/DragHandle';

import { levelEnumLike } from '../utils/enum-likes';
import { itemDetailsStartStyle } from './utils/style';
import type { Level } from '../utils/types';

type Props = {
  id: number,
  name: string,
  level: Level,
  numberOfChildrenText?: string,
};

const ItemDetailsStart = ({ id, name, level, numberOfChildrenText }: Props) => {
  const levelStyle = itemDetailsStartStyle[level];
  const { container, text, textLength } = levelStyle;

  const showTooltip = name.length > textLength;
  const displayName = showTooltip
    ? `${name.substring(0, textLength)}...`
    : name;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...container,
      }}
    >
      <DragHandle id={id} />
      {showTooltip ? (
        <Tooltip title={name} placement="right">
          <Typography sx={{ marginLeft: '1rem', ...text }}>
            {displayName}
          </Typography>
        </Tooltip>
      ) : (
        <Typography sx={{ marginLeft: '1rem', ...text }}>
          {displayName}
        </Typography>
      )}

      {level !== levelEnumLike.question && numberOfChildrenText && (
        <Typography
          sx={{ fontSize: '12px', ...levelStyle.numberOfChildrenText }}
        >
          {numberOfChildrenText}
        </Typography>
      )}
    </Box>
  );
};

export default ItemDetailsStart;
