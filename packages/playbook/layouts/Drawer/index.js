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
  children: ?Node,
};

const DrawerLayout = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        overflowY: 'hidden',
        p: 1,
        gap: 1,
      }}
    >
      {props.children}
    </Box>
  );
};

type TitleProps = {
  title: string,
  onClose: Function,
};

const Title = (props: TitleProps): Node => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ pl: 2, pr: 1, py: 1 }}
    >
      <Typography variant="h6" component="p" sx={{ color: 'text.primary' }}>
        {props.title}
      </Typography>
      <IconButton onClick={props.onClose} disableRipple>
        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
      </IconButton>
    </Stack>
  );
};

type ContentProps = {
  children: ?Node,
  p?: number,
};

const Content = ({ children, p = 2 }: ContentProps): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        flex: '1 1 0%',
        p,
      }}
    >
      {children}
    </Box>
  );
};

type ActionProps = {
  children: ?Node,
};

const Actions = ({ children }: ActionProps): Node => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={1}
    >
      {children}
    </Stack>
  );
};

DrawerLayout.Title = Title;
DrawerLayout.Content = Content;
DrawerLayout.Actions = Actions;

export default DrawerLayout;
