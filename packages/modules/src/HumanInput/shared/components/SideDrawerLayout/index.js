// @flow
import type { Node } from 'react';

import {
  Box,
  IconButton,
  Typography,
  Stack,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  children: Node,
};

type TitleProps = {
  title: string,
  onClose: Function,
};

const SideDrawerLayout = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </Box>
  );
};

const Title = (props: TitleProps): Node => {
  return (
    <Stack
      p={2}
      spacing={1}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h6" sx={{ color: 'text.primary' }} component="p">
        {props.title}
      </Typography>
      <IconButton disableRipple onClick={props.onClose}>
        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
      </IconButton>
    </Stack>
  );
};

const Body = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
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
      justifyContent="flex-end"
      alignItems="center"
      sx={{
        mt: 'auto',
        p: 2,
      }}
      spacing={1}
    >
      {props.children}
    </Stack>
  );
};

SideDrawerLayout.Title = Title;
SideDrawerLayout.Body = Body;
SideDrawerLayout.Actions = Actions;

export default SideDrawerLayout;
