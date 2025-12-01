// @flow
import type { Node } from 'react';
import React, { useRef, useLayoutEffect, useState } from 'react';
import { Grid, Box } from '@kitman/playbook/components';

type Props = {
  children: Node,
};

type ColumnProps = Props & {
  sx?: Object,
};

const ColumnLayout = (props: ColumnProps): Node => {
  return <Box {...props.sx}>{props.children}</Box>;
};

const Column = (props: ColumnProps): Node => {
  return (
    <Grid container item {...props.sx} spacing={2}>
      {React.Children.map(props.children, (child) => {
        return (
          <Grid item xs={12}>
            {child}
          </Grid>
        );
      })}
    </Grid>
  );
};

const Body = (props: Props): Node => {
  const tabContainerRef = useRef();
  const [height, setHeight] = useState();

  useLayoutEffect(() => {
    if (tabContainerRef.current) {
      const { y } = tabContainerRef?.current?.getBoundingClientRect();
      setHeight(`calc((100vh - ${y}px))`);
    }
  }, [tabContainerRef]);

  return (
    // $FlowIgnore ref is valid here
    <Grid
      container
      spacing={2}
      columns={10}
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      ref={tabContainerRef}
      sx={{ maxHeight: height }}
    >
      {props.children}
    </Grid>
  );
};

ColumnLayout.Body = Body;
ColumnLayout.Column = Column;

export default ColumnLayout;
