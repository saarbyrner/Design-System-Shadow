// @flow
import { useRef, useLayoutEffect, useState } from 'react';
import { DataGrid } from '@kitman/components';
import type { GridData } from '../types';
import { gridStyle } from '../../CommonGridStyle';

type Props = {
  fetchMoreData: Function,
  grid: GridData,
  emptyTableText: string,
  gridId: string,
  isLoading: boolean,
  rowActions: ?Array<Object>,
};

const gridBottomMarginToHideOverflowOnBody = '21px';

const AthleteRosterGrid = (props: Props) => {
  const athleteContainerRef = useRef();
  const [height, setHeight] = useState();

  useLayoutEffect(() => {
    if (athleteContainerRef.current) {
      const { y } = athleteContainerRef?.current?.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  return (
    // $FlowFixMe div does not like ref
    <div id={props.gridId} ref={athleteContainerRef} css={gridStyle.grid}>
      <DataGrid
        columns={props.grid.columns}
        rows={props.grid.rows}
        rowActions={props.rowActions}
        emptyTableText={props.emptyTableText}
        isTableEmpty={props.grid.rows.length === 0}
        isFullyLoaded={props.isLoading === false && props.grid.next_id === null}
        fetchMoreData={props.fetchMoreData}
        isLoading={props.isLoading}
        // A height is forced on this component as the scrollOnBody event is triggered regardless of what tab you are viewing
        maxHeight={height}
      />
    </div>
  );
};

export default AthleteRosterGrid;
