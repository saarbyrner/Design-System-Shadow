// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { useRef, useLayoutEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@kitman/playbook/components';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';

type Props = {
  children: Node,
};

const Title = ({ children }: Props): Node => {
  return <Typography variant="h6">{children}</Typography>;
};

const Filters = (props: Props): Node => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      mt={2}
    >
      {props.children}
    </Stack>
  );
};

const Content = (props: Props): Node => {
  return (
    <Card variant="outlined" sx={{ overflow: 'visible' }}>
      <CardContent sx={{ p: 2, overflow: 'visible' }}>
        {props.children}
      </CardContent>
    </Card>
  );
};

const Body = (props: Props): Node => {
  return <Box>{props.children}</Box>;
};

const ListLayout = (props: Props): Node => {
  const listLayoutContainerRef = useRef();
  const [height, setHeight] = useState();

  useLayoutEffect(() => {
    if (listLayoutContainerRef.current) {
      const { y } = listLayoutContainerRef?.current?.getBoundingClientRect();
      setHeight(`calc((100vh - ${y}px))`);
    }
  }, [listLayoutContainerRef]);

  return (
    <Box
      ref={listLayoutContainerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        overflow: 'hidden',
        height,
        background: colors.background,
        maxHeight: height,
        p: 2,
      }}
    >
      {props.children}
    </Box>
  );
};

const Loading = () => {
  return <FormLayout.Loading />;
};

const LoadingTitle = (): Node => {
  return (
    <Typography variant="p" data-testid="ListLayout.LoadingTitle">
      <Skeleton variant="text" width={80} />
    </Typography>
  );
};

const LoadingFilters = (): Node => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      data-testid="ListLayout.LoadingFilters"
    >
      <Skeleton variant="rectangular" width={210} height={48} />
    </Stack>
  );
};

const LoadingGrid = (): Node => {
  const generateRow = (key: number) => {
    return (
      <TableRow key={key}>
        <TableCell>
          <Skeleton variant="text" height={48} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" height={48} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" height={48} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" height={48} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" height={48} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" height={48} />
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Table>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => generateRow(index))}
      </TableBody>
    </Table>
  );
};

const LoadingLayout = (): Node => {
  return (
    <ListLayout>
      <ListLayout.Content>
        <ListLayout.Title>
          <ListLayout.LoadingTitle />
        </ListLayout.Title>
        <ListLayout.Filters>
          <ListLayout.LoadingFilters />
        </ListLayout.Filters>
      </ListLayout.Content>
      <ListLayout.Content>
        <ListLayout.LoadingGrid />
      </ListLayout.Content>
    </ListLayout>
  );
};

ListLayout.Title = Title;
ListLayout.LoadingTitle = LoadingTitle;
ListLayout.LoadingFilters = LoadingFilters;
ListLayout.LoadingGrid = LoadingGrid;
ListLayout.Filters = Filters;
ListLayout.Content = Content;
ListLayout.Body = Body;
ListLayout.Loading = Loading;
ListLayout.LoadingLayout = LoadingLayout;

export default ListLayout;
