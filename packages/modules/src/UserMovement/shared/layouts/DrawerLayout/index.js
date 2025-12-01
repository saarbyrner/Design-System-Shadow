// @flow
import type { Node } from 'react';
import {
  Box,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Grid,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@kitman/playbook/components';
import CreateMovementDrawerLayout from '../CreateMovementDrawerLayout';

import type { SearchAthleteProfile } from '../../types';
import FormItem from '../../components/UserMovementDrawer/components/FormItem';

type Props = {
  children: Node,
};

const DrawerLayout = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        overflowY: 'hidden',
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
  return <CreateMovementDrawerLayout.Title {...props} />;
};

type StepProps = {
  steps: Array<string>,
  activeStepIndex: number,
};

const Steps = (props: StepProps): Node => {
  return (
    <Box
      sx={{
        width: '100%',
        p: 1,
      }}
    >
      <Stepper activeStep={props.activeStepIndex}>
        {props.steps?.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

type InstructionProps = {
  instructions: { primary: string, secondary: string },
};

const Instructions = (props: InstructionProps): Node => {
  const sx = {
    color: 'text.primary',
    fontWeight: 600,
    whiteSpace: 'normal',
  };

  return (
    <Box
      p={2}
      sx={{
        width: '100%',
      }}
    >
      <Stack sx={{ pr: 12 }}>
        <Typography variant="body2" sx={sx} noWrap component="p">
          {props.instructions.primary}
        </Typography>
        <Typography variant="body2" sx={sx} noWrap component="p">
          {props.instructions.secondary}
        </Typography>
      </Stack>
    </Box>
  );
};

type ProfileProps = {
  profile: SearchAthleteProfile,
};

const Profile = (props: ProfileProps): Node => {
  return (
    <Box px={2}>
      <Grid container>
        <Grid item xs={12}>
          <ListItem sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar alt={props.profile?.name} src={props.profile?.avatar} />
            </ListItemAvatar>
            <ListItemText>
              <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.primary' }}
              >
                {props.profile?.name}
              </Typography>
            </ListItemText>
          </ListItem>
        </Grid>
      </Grid>
    </Box>
  );
};

type ProfileItemProps = {
  items: Array<{ primary: string, secondary: string }>,
};

const ProfileItems = (props: ProfileItemProps) => {
  return (
    <Grid container spacing={2} px={2}>
      {props.items.map(({ primary, secondary }) => {
        return (
          <Grid item xs={6} key={primary}>
            <FormItem primary={primary} secondary={secondary} />
          </Grid>
        );
      })}
    </Grid>
  );
};

const Form = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto',
      }}
    >
      {props.children}
    </Box>
  );
};

const Actions = (props: Props): Node => {
  return <CreateMovementDrawerLayout.Actions {...props} />;
};

DrawerLayout.Title = Title;
DrawerLayout.Steps = Steps;
DrawerLayout.Instructions = Instructions;
DrawerLayout.Profile = Profile;
DrawerLayout.ProfileItems = ProfileItems;
DrawerLayout.Form = Form;
DrawerLayout.Actions = Actions;

export default DrawerLayout;
