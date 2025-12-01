// @flow
import type { Node } from 'react';
import { Box, Typography } from '@kitman/playbook/components';

import { colors } from '@kitman/common/src/variables';

type Props = {
  title: string,
  children?: Node,
};

const Header = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'white',
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Typography variant="h6" color={colors.grey_200}>
          {props.title}
        </Typography>
      </Box>
      {props.children}
    </Box>
  );
};

export default Header;
