// @flow
import { Tooltip, Typography } from '@kitman/playbook/components';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

type Props = {
  text: string,
  width?: string | number,
  sx?: ObjectStyle,
  maxLength?: number,
};

const TruncatedTextWithTooltip = (props: Props) => {
  const { text, width = '100%', sx, maxLength = 20 } = props;
  if (text.length > maxLength) {
    return (
      <Tooltip title={text} arrow placement="top">
        <Typography
          sx={{
            ...sx,
            width,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    );
  }

  return <Typography sx={{ ...sx }}>{text}</Typography>;
};

export default TruncatedTextWithTooltip;
