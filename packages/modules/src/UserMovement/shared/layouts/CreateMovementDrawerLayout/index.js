// @flow
import type { Node } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Skeleton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  children: Node,
};

const CreateMovementDrawerLayout = (props: Props): Node => {
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
      spacing={1}
      p={1}
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

const Profile = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        p: 1,
      }}
    >
      {props.children}
    </Box>
  );
};

const Content = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 3,
        overflowY: 'auto',
        gap: 2,
        p: 1,
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
      spacing={1}
      sx={{
        mt: 'auto',
        p: 1,
      }}
    >
      {props.children}
    </Stack>
  );
};

const Loading = (): Node => {
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" height={40} width={40} />
        <Skeleton variant="text" width="25%" sx={{ pb: 2 }} />
      </Box>
      <Skeleton variant="text" height={30} width="20%" sx={{ mt: 1 }} />
      <Skeleton variant="text" height={30} width="35%" />
      <Skeleton variant="text" height={30} width="28%" />
      <Skeleton variant="text" height={80} width="50%" />
      <Skeleton variant="text" height={60} sx={{ pb: 2, mt: 22 }} />
      <Skeleton variant="text" height={60} sx={{ pb: 2 }} />
      <Skeleton variant="text" height={60} sx={{ pb: 2 }} />
    </Box>
  );
};

CreateMovementDrawerLayout.Title = Title;
CreateMovementDrawerLayout.Loading = Loading;
CreateMovementDrawerLayout.Profile = Profile;
CreateMovementDrawerLayout.Content = Content;
CreateMovementDrawerLayout.Actions = Actions;

export default CreateMovementDrawerLayout;
