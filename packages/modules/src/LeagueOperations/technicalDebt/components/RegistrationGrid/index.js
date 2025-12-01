// @flow
import { useRef, useLayoutEffect, useState } from 'react';
import { DataGrid } from '@kitman/components';
import type { RowAction } from '@kitman/components/src/DataGrid';
import type { Meta } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import i18n from '@kitman/common/src/utils/i18n';

import { gridStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';
import type { GridData } from '../../types';
import style from './style';

type Props = {
  grid: GridData,
  emptyTableText: string,
  gridId: string,
  isLoading: boolean,
  rowActions: ?Array<RowAction>,
  meta?: Meta,
  onFetchData?: Function,
  gridHeight?: string | number,
  mustShowOnlyRowsWithErrorsOnParseStateComplete?: boolean,
};

const gridBottomMarginToHideOverflowOnBody = '50px';

const RegistrationGrid = (props: Props) => {
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

  const getEmptyTableText = (): string => {
    if (props.isLoading) return '';
    if (props.mustShowOnlyRowsWithErrorsOnParseStateComplete) {
      return i18n.t('All data is valid');
    }
    if (props.emptyTableText) {
      return props.emptyTableText;
    }
    return '';
  };

  return (
    <div
      id={props.gridId}
      // $FlowFixMe div does not like ref
      ref={organisationOverviewContainerRef}
      css={
        props.mustShowOnlyRowsWithErrorsOnParseStateComplete
          ? style.allDataIsValidMessage
          : gridStyle.grid
      }
    >
      {props.mustShowOnlyRowsWithErrorsOnParseStateComplete &&
      props.grid.rows.length === 0 ? (
        getEmptyTableText()
      ) : (
        <DataGrid
          columns={props.grid.columns}
          rows={props.grid.rows}
          rowActions={props.rowActions}
          emptyTableText={getEmptyTableText()}
          isTableEmpty={props.grid.rows.length === 0}
          maxHeight={props.gridHeight || height}
          isFullyLoaded={!props.meta?.next_page}
          fetchMoreData={props.onFetchData}
          isLoading={props.isLoading}
        />
      )}
    </div>
  );
};

export default RegistrationGrid;
