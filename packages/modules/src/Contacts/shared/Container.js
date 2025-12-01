// @flow
import type { Node } from 'react';
import { Box, Stack, Paper } from '@kitman/playbook/components';
import style from '@kitman/modules/src/KitMatrix/style';

const Container = ({ children }: { children: Node }) => {
  return (
    <Box sx={{ p: 3 }} css={style.container}>
      <Paper>
        <Stack direction="column" gap={1}>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
};

const Header = ({ children }: { children: Node }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 3, pt: 3 }}
    >
      {children}
    </Stack>
  );
};

Container.Header = Header;

export default Container;
