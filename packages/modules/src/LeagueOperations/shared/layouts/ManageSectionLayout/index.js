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
  // eslint-disable-next-line react/no-unused-prop-types
  sx?: Object,
};

const ManageSectionLayout = ({ children, sx = {} }: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        overflowY: 'hidden',
        p: 0,
        gap: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

const Content = ({ children, sx = {} }: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 3,
        gap: 2,
        p: 0,
        pr: 2,
        overflowY: 'hidden',
        ...sx,
      }}
    >
      {children}
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
        p: 2,
        borderTop: 1,
        borderColor: colors.grey_disabled,
      }}
    >
      {props.children}
    </Stack>
  );
};

type TitleProps = {
  title: string,
  subtitle?: string,
  onClose: Function,
  removeBorderBottom?: boolean,
};

const Title = (props: TitleProps): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        borderBottom: props.removeBorderBottom ? 0 : 1,
        borderColor: colors.grey_disabled,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="start"
        spacing={1}
      >
        <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
          {props.title}
        </Typography>
        <IconButton onClick={props.onClose} disableRipple>
          <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
        </IconButton>
      </Stack>
      <Typography
        variant="h4"
        component="div"
        sx={{
          color: 'text.secondary',
          fontSize: '16px',
          lineHeight: '18px',
          py: 0,
        }}
      >
        {props.subtitle}
      </Typography>
    </Box>
  );
};

// Temporary, to appease the SonarCloud gods.
ManageSectionLayout.Title = Title;
ManageSectionLayout.Loading = CreateMovementDrawerLayout.Loading;
ManageSectionLayout.Content = Content;
ManageSectionLayout.Actions = Actions;

export default ManageSectionLayout;
