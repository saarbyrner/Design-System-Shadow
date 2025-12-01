// @flow
import {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { withNamespaces } from 'react-i18next';
import { DataGrid, TextLink, UserAvatar } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { GridData } from '../../../types';
import { gridStyle, headerStyle } from '../../CommonGridStyle';

type Props = {
  grid: GridData,
  isLoading: boolean,
};

const gridBottomMarginToHideOverflowOnBody = '21px';

const InactiveAthletesGrid = (props: I18nProps<Props>) => {
  const gridContainerRef = useRef();
  const [height, setHeight] = useState();
  const [gridColumns, setGridColumns] = useState([]);

  useLayoutEffect(() => {
    if (gridContainerRef.current) {
      const { y } = gridContainerRef?.current?.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  const getGridColumns = useCallback(() => {
    const columnConfig = [
      {
        id: 'athlete',
        displayName: props.t('Athlete'),
        isPermitted: true,
      },
    ];

    return columnConfig
      .filter((col) => col.isPermitted)
      .map((column) => {
        return {
          id: column.id,
          row_key: column.id,
          content: (
            <div css={headerStyle.headerCell}>
              <span css={headerStyle[`headerCell__${column.id}`]}>
                {column.displayName}
              </span>
            </div>
          ),
          isHeader: true,
        };
      });
  }, [props]);

  useEffect(() => {
    setGridColumns(getGridColumns());
  }, [getGridColumns]);

  const getCellContent = ({ row_key: rowKey }, rowData) => {
    switch (rowKey) {
      case 'athlete':
        return (
          <div css={headerStyle.athleteCell}>
            <div css={headerStyle.imageContainer}>
              <UserAvatar
                url={rowData.avatar_url}
                firstname={rowData.fullname}
                displayInitialsAsFallback
                size="MEDIUM"
              />
            </div>
            <div css={headerStyle.detailsContainer}>
              <TextLink
                text={rowData.fullname}
                href={`/medical/athletes/${rowData.id}`}
                kitmanDesignSystem
              />
            </div>
          </div>
        );
      default:
        return <span css={headerStyle.defaultCell}>{rowData[rowKey]}</span>;
    }
  };

  const getGridRows = () => {
    const gridRows = props.grid.rows.map((row) => {
      const cells = gridColumns.map((column) => {
        const content = getCellContent(column, row);
        return {
          id: column.row_key,
          content,
          allowOverflow: false,
        };
      });

      return {
        id: row.id,
        cells,
        classnames: {
          athlete__row: true,
        },
      };
    });

    return gridRows;
  };

  return (
    // $FlowFixMe
    <div id="inactiveAthletesGrid" ref={gridContainerRef} css={gridStyle.grid}>
      <DataGrid
        columns={getGridColumns()}
        rows={getGridRows()}
        rowActions={undefined}
        emptyTableText={props.t('No inactive athletes for this period')}
        isTableEmpty={props.grid.rows.length === 0}
        isFullyLoaded={!props.isLoading && !props.grid.next_id}
        isLoading={props.isLoading}
        // A height is forced on this component as the scrollOnBody event is triggered regardless of what tab you are viewing
        maxHeight={height}
      />
    </div>
  );
};

export const InactiveAthletesGridTranslated =
  withNamespaces()(InactiveAthletesGrid);
export default InactiveAthletesGrid;
