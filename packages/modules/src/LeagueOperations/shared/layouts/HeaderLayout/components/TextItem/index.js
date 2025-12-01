// @flow
import type { Node } from 'react';
import { Stack, Typography } from '@kitman/playbook/components/index';
import { colors } from '@kitman/common/src/variables';

type Props = {
  primary: string,
  secondary?: Node,
};

const TextItem = (props: Props) => {
  return (
    <Stack direction="column" alignItems="start" spacing={0}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 400, color: colors.grey_200 }}
      >
        {props.primary}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 400, color: colors.grey_300 }}
      >
        {props.secondary}
      </Typography>
    </Stack>
  );
};

export default TextItem;
