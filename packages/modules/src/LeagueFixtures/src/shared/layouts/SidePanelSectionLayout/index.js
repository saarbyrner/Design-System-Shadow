// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import {
  Box,
  IconButton,
  Typography,
  Stack,
} from '@kitman/playbook/components';
import CreateMovementDrawerLayout from '@kitman/modules/src/UserMovement/shared/layouts/CreateMovementDrawerLayout';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  children: Node,
};

const SidePanelSectionLayout = (props: Props): Node => {
  const boxStyle = {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    overflowY: 'hidden',
    p: 0,
    gap: 1,
  };
  return (
    <Box sx={boxStyle}>
      {props.children}
    </Box>
  );
};

const Content = (props: Props): Node => {
  const contentBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 3,
    gap: 2,
    p: 0,
    pr: 2,
    overflowY: 'scroll',
  };

  return (
    <Box sx={contentBoxStyle}>
      {props.children}
    </Box>
  );
};

const Actions = (props: Props): Node => {
  const ActionsStackStyle = {
    mt: 'auto',
    p: 2,
    borderTop: 1,
    borderColor: colors.grey_disabled,
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={1}
      sx={ActionsStackStyle}
    >
      {props.children}
    </Stack>
  );
};

type TitleProps = {
  title: string,
  subtitle?: string,
  date?: string,
  text?: string,
  onClose: () => void
};

const Title = (props: TitleProps): Node => {
  const titleBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    borderBottom: 1,
    borderColor: colors.grey_disabled,
  };
  const h4Style = {
    color: 'text.secondary',
    fontSize: '16px',
    lineHeight: '18px',
    py: 0,
  };

  const h6Style = { color: 'text.primary' };

  return (
    <Box sx={titleBoxStyle}>
      <Stack
        direction="row"
        alignItems="start"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography variant="h6" component="div" sx={h6Style}>
          {props.title}
        </Typography>

        <IconButton onClick={props.onClose} disableRipple>
          <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
        </IconButton>
      </Stack>

      <Typography
        variant="h4"
        component="div"
        sx={h4Style}
      >
        {props.subtitle}
      </Typography>

      <Typography
        variant="body2"
        component="div"
      >
        {props.date}
      </Typography>

      <Typography
        variant="body2"
        component="div"
      >
        {props.text}
      </Typography>
    </Box>
  );
};

// Temporary, to appease the SonarCloud gods.
SidePanelSectionLayout.Title = Title;
SidePanelSectionLayout.Loading = CreateMovementDrawerLayout.Loading;
SidePanelSectionLayout.Content = Content;
SidePanelSectionLayout.Actions = Actions;

export default SidePanelSectionLayout;
