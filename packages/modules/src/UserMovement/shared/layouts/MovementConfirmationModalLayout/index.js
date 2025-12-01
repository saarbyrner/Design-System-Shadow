// @flow
import type { Node } from 'react';
import { Box, Typography, Stack } from '@kitman/playbook/components';

type Props = {
  children: Node,
};
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  borderRadius: 1,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1,
};

const MovementConfirmationModalLayout = (props: Props): Node => {
  return <Box sx={style}>{props.children}</Box>;
};

type TitleProps = {
  title: string,
  subtitle?: string,
  description?: string,
};

const Title = (props: TitleProps): Node => {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="flex-start"
      p={1}
    >
      <Typography
        variant="h6"
        component="p"
        sx={{ color: 'text.primary', mb: 1 }}
      >
        {props.title}
      </Typography>
      <Typography
        variant="subtitle1"
        component="p"
        sx={{ color: 'text.primary' }}
      >
        {props.subtitle}
      </Typography>
      <Typography
        variant="subtitle1"
        component="p"
        sx={{ color: 'text.primary' }}
      >
        {props.description}
      </Typography>
    </Stack>
  );
};

const Profile = (props: Props): Node => {
  return (
    <Stack
      alignItems="flex-start"
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

MovementConfirmationModalLayout.Title = Title;
MovementConfirmationModalLayout.Profile = Profile;
MovementConfirmationModalLayout.Content = Content;
MovementConfirmationModalLayout.Actions = Actions;

export default MovementConfirmationModalLayout;
