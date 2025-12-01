// @flow
import type { Node } from 'react';
import type { StackProps } from '@mui/material';
import { Stack, Typography, Skeleton } from '@kitman/playbook/components/index';
import { colors } from '@kitman/common/src/variables';

type Props = {
  children: Node,
};

const HeaderLayout = (props: { children: Node, withTabs?: boolean }): Node => {
  return (
    <Stack
      direction="column"
      alignItems="start"
      spacing={2}
      sx={{
        width: '100%',
        p: 2,
        backgroundColor: colors.white,
        borderBottom: props.withTabs ? 0 : 1,
        position: 'relative',
      }}
    >
      {props.children}
    </Stack>
  );
};

const Actions = ({
  children,
  containerProps = {},
}: {
  children: Node,
  containerProps?: StackProps,
}): Node => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        display: 'flex',
      }}
      {...containerProps}
    >
      {children}
    </Stack>
  );
};

const Avatar = (props: Props) => props.children;

const BackBar = (props: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ width: '100%' }}
    >
      {props.children}
    </Stack>
  );
};

const Content = (props: Props): Node => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ width: '100%' }}
    >
      {props.children}
    </Stack>
  );
};

const MainContent = (props: Props): Node => {
  return (
    <Stack
      direction="column"
      alignItems="start"
      sx={{ width: '100%', overflowX: 'auto' }}
    >
      {props.children}
    </Stack>
  );
};

const Title = (props: Props) => {
  return (
    <Typography variant="h6" sx={{ fontWeight: 400, color: colors.grey_200 }}>
      {props.children}
    </Typography>
  );
};

const TitleBar = (props: Props) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{ width: '100%' }}
    >
      {props.children}
    </Stack>
  );
};

const Items = (props: Props) => {
  return (
    <Stack
      direction="row"
      alignItems="start"
      spacing={8}
      sx={{ width: '100%', overflowX: 'auto', textWrap: 'nowrap' }}
    >
      {props.children}
    </Stack>
  );
};

type LoadingProps = {
  withAvatar?: boolean,
  withItems?: boolean,
  withActions?: boolean,
  withTabs?: boolean,
};

const Loading = (props: LoadingProps) => {
  return (
    <HeaderLayout withTabs={props.withTabs}>
      <HeaderLayout.Content>
        {props.withAvatar && (
          <HeaderLayout.Avatar>
            <Skeleton
              variant="circular"
              height={80}
              width={80}
              data-testid="HeaderLayout.Avatar"
            />
          </HeaderLayout.Avatar>
        )}
        <HeaderLayout.MainContent>
          <HeaderLayout.TitleBar>
            <Skeleton
              sx={{ width: 180, height: 32 }}
              data-testid="HeaderLayout.TitleBar"
            />
            {props.withActions && (
              <Skeleton
                sx={{ width: 60, height: 32 }}
                data-testid="HeaderLayout.Actions"
              />
            )}
          </HeaderLayout.TitleBar>
          {props.withItems && (
            <HeaderLayout.Items>
              <Skeleton
                sx={{ width: 120, height: 64 }}
                data-testid="HeaderLayout.Items1"
              />
              <Skeleton
                sx={{ width: 120, height: 64 }}
                data-testid="HeaderLayout.Items2"
              />
              <Skeleton
                sx={{ width: 120, height: 64 }}
                data-testid="HeaderLayout.Items3"
              />
              <Skeleton
                sx={{ width: 120, height: 64 }}
                data-testid="HeaderLayout.Items4"
              />
            </HeaderLayout.Items>
          )}
        </HeaderLayout.MainContent>
      </HeaderLayout.Content>
    </HeaderLayout>
  );
};

HeaderLayout.Loading = Loading;
HeaderLayout.BackBar = BackBar;
HeaderLayout.Content = Content;
HeaderLayout.Avatar = Avatar;
HeaderLayout.MainContent = MainContent;
HeaderLayout.TitleBar = TitleBar;
HeaderLayout.Title = Title;
HeaderLayout.Actions = Actions;
HeaderLayout.Items = Items;

export default HeaderLayout;
