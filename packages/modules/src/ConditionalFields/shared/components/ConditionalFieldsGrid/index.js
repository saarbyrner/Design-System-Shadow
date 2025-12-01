// @flow
import { useRef, useLayoutEffect, useState } from 'react';
import { DataGrid } from '@kitman/components';
import type { RowAction } from '@kitman/components/src/DataGrid';
import type { GridData } from '../../types';
import { gridStyle } from '../CommonGridStyle';

type Props = {
  grid: GridData,
  grid: any,
  emptyTableText: string,
  gridId: string,
  isLoading: boolean,
  rowActions: ?Array<RowAction>,
  onFetchData?: Function,
};

const gridBottomMarginToHideOverflowOnBody = '50px';

const ConditionalFieldsGrid = (props: Props) => {
  const organisationOverviewContainerRef = useRef();
  const [height, setHeight] = useState();

  useLayoutEffect(() => {
    if (organisationOverviewContainerRef.current) {
      const { y } =
        organisationOverviewContainerRef?.current?.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  return (
    <div
      id={props.gridId}
      // $FlowFixMe div does not like ref
      ref={organisationOverviewContainerRef}
      css={gridStyle.grid}
    >
      <DataGrid
        columns={props.grid.columns}
        rows={props.grid.rows}
        rowActions={props.rowActions}
        emptyTableText={props.isLoading ? '' : props.emptyTableText}
        isTableEmpty={props.grid.rows.length === 0}
        maxHeight={height}
        isFullyLoaded
        fetchMoreData={props.onFetchData}
        isLoading={props.isLoading}
      />
    </div>
  );
};

export default ConditionalFieldsGrid;
