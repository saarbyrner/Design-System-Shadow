// @flow
import { useRef, type Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { useTheme } from '@kitman/playbook/hooks';
import { Box, LinearProgress, Skeleton } from '@kitman/playbook/components';
import {
  TITLE_BAR_HEIGHT,
  TITLE_BAR_XS_HEIGHT,
  FOOTER_HEIGHT,
  FOOTER_XS_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { drawerMixin } from '../../mixins';

type Props = {
  children: Node,
};

const Title = (props: { children: Node, withTabs?: boolean }): Node => {
  return (
    <Box
      sx={{
        background: colors.white,
        minHeight: {
          sm: `${TITLE_BAR_XS_HEIGHT}px`,
          md: `${TITLE_BAR_HEIGHT}px`,
        },
        borderBottom: props.withTabs ? 0 : 1,
        borderColor: colors.grey_disabled,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
      }}
    >
      {props.children}
    </Box>
  );
};

type DrawerProps = {
  children: Node,
  isOpen: boolean,
};

const Menu = (props: DrawerProps): Node => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        ...drawerMixin({
          theme,
          isOpen: props.isOpen,
        }),
        padding: 0,
        borderColor: colors.grey_disabled,
        backgroundColor: colors.white,
        height: '100%',
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
        justifyContent: 'space-between',
        background: colors.white,
        overflowY: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      {props.children}
    </Box>
  );
};

const Body = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
        flexGrow: 1,
      }}
    >
      {props.children}
    </Box>
  );
};

const Form = (props: Props): Node => {
  const formContainerRef = useRef();

  return (
    <Box
      ref={formContainerRef}
      sx={{
        display: 'flex',
        width: '100%',
        overflowY: 'auto',
        alignItems: 'flex-start',
      }}
    >
      {props.children}
    </Box>
  );
};

const Footer = (props: Props): Node => {
  return (
    <Box
      sx={{
        display: 'flex',
        p: 2,
        flexDirection: 'row',
        width: '100%',
        overflow: 'hidden',
        height: { xs: `${FOOTER_XS_HEIGHT}px`, md: `${FOOTER_HEIGHT}px` },
        justifyContent: 'start',
        borderTop: `1px solid ${colors.grey_disabled}`,
        marginTop: 'auto',
        flexShrink: 0,
      }}
      elevation={0}
    >
      {props.children}
    </Box>
  );
};

const FormLayout = (props: { children: Node, className?: string }): Node => {
  return (
    <Box
      className={props.className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        background: colors.background,
        height: '100%',
      }}
    >
      {props.children}
    </Box>
  );
};

const Loading = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
};

const FormMenuSkeleton = () => {
  return (
    <Box p={3}>
      <Skeleton variant="wave" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="wave" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
    </Box>
  );
};

const FormContentSkeleton = () => {
  return (
    <Box
      sx={{ p: { xs: 1.5, sm: 3 } }}
      width={{ sm: '100%', xs: '100%', md: '50%' }}
    >
      <Skeleton variant="wave" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
      <Skeleton variant="text" height={48} />
    </Box>
  );
};

FormLayout.Title = Title;
FormLayout.Body = Body;
FormLayout.Menu = Menu;
FormLayout.Form = Form;
FormLayout.Content = Content;
FormLayout.Footer = Footer;
FormLayout.Loading = Loading;
FormLayout.MenuSkeleton = FormMenuSkeleton;
FormLayout.ContentSkeleton = FormContentSkeleton;

export default FormLayout;
