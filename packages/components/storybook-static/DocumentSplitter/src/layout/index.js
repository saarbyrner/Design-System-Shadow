// @flow
import { Box, Typography, Stack } from '@kitman/playbook/components';

// Types
import type { Node } from 'react';

type Props = {
  children: Node,
};

const Layout = (props: Props): Node => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </Box>
  );
};

type TitleProps = {
  title: string,
};

const Title = (props: TitleProps): Node => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ pl: 2, pr: 1, py: 1 }}
    >
      <Typography
        variant="subtitle1"
        component="p"
        sx={{ color: 'text.primary' }}
      >
        {props.title}
      </Typography>
    </Stack>
  );
};

const Content = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        flex: '1 1 0%',
        p: 2,
        paddingTop: 0,
      }}
    >
      {props.children}
    </Box>
  );
};

const Actions = (props: Props): Node => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      {props.children}
    </Stack>
  );
};

Layout.Title = Title;
Layout.Content = Content;
Layout.Actions = Actions;

export default Layout;
