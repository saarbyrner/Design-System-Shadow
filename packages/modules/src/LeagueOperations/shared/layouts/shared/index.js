// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { Grid, Skeleton } from '@kitman/playbook/components';
import { useTheme } from '@kitman/playbook/hooks';
import { FOOTER_HEIGHT } from '@kitman/modules/src/HumanInput/shared/constants';
import { drawerMixin } from '@kitman/modules/src/HumanInput/shared/mixins';

type Props = {
  children: Node,
};

export const MenuContainer = (props: {
  isOpen: boolean,
  children: Node,
}): Node => {
  const theme = useTheme();

  return (
    <Grid
      item
      sx={{
        flexDirection: 'column',
        borderRight: 1,
        borderColor: colors.grey_disabled,
        ...drawerMixin({
          theme,
          isOpen: props.isOpen,
        }),
        padding: 0,
        overflow: 'auto',
      }}
    >
      {props.children}
    </Grid>
  );
};

export const FormTitle = (props: Props): Node => {
  return (
    <Grid
      item
      xs
      sx={{ p: 2, borderBottom: 1, borderColor: colors.grey_disabled }}
    >
      {props.children}
    </Grid>
  );
};

export const FormContainer = (props: Props): Node => {
  return (
    <Grid
      item
      container
      xs
      sm
      sx={{
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {props.children}
    </Grid>
  );
};

export const FormBody = (props: Props): Node => {
  return (
    <Grid
      item
      xs
      sm
      sx={{
        overflowY: 'auto',
      }}
      gap={1}
    >
      {props.children}
    </Grid>
  );
};

export const FormFooter = (props: Props): Node => {
  return (
    <Grid
      item
      sx={{
        p: 2,
        bottom: `calc(${FOOTER_HEIGHT}px + 16px)`,
        display: 'flex',
        justifyItems: 'end',
        borderTop: 1,
        gap: 2,
        borderColor: colors.grey_disabled,

        height: `${FOOTER_HEIGHT}px`,
      }}
    >
      {props.children}
    </Grid>
  );
};

export const generateSkeletonLoaders = (count: number) => {
  const skeletonLoaders = [];
  for (let i = 0; i < count; i++) {
    const width = Math.floor(Math.random() * 51) + 50;
    skeletonLoaders.push(
      <Skeleton key={i} variant="text" width={`${width}%`} height={56} />
    );
  }
  return skeletonLoaders;
};

export const generateSkeletonMenu = () => {
  return (
    <>
      <Skeleton variant="text" height={32} />
      <Skeleton
        variant="text"
        display="flex"
        height={32}
        sx={{ marginLeft: '40px' }}
      />
      <Skeleton
        variant="text"
        display="flex"
        height={32}
        sx={{ marginLeft: '40px' }}
      />
      <Skeleton
        variant="text"
        display="flex"
        height={32}
        sx={{ marginLeft: '40px' }}
      />
      <Skeleton variant="text" height={32} />
      <Skeleton variant="text" height={32} />
    </>
  );
};
