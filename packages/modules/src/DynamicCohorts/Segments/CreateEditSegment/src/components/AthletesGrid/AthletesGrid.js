// @flow
import { useRef, useState, useLayoutEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { DataGrid } from '@kitman/components';
import { useDispatch } from 'react-redux';
import { onUpdateNextId } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import style from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/styles';
import useAthletesGrid from './useAthletesGrid';

const gridBottomMarginToHideOverflowOnBody = '70px';

const AthletesGrid = () => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const [height, setHeight] = useState();

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { y } = containerRef.current.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  const {
    isGridFetching,
    athletes,
    rows,
    columns,
    nextAthleteIdToFetch,
    emptyTableText,
  } = useAthletesGrid();

  return (
    <>
      <div
        id="AthletesGrid"
        // $FlowFixMe div does not like ref
        ref={containerRef}
        css={style.grid}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          emptyTableText={emptyTableText}
          isTableEmpty={athletes?.length === 0}
          maxHeight={height}
          isFullyLoaded={nextAthleteIdToFetch === null}
          fetchMoreData={() => dispatch(onUpdateNextId(nextAthleteIdToFetch))}
          isLoading={isGridFetching}
          scrollOnBody
        />
      </div>
    </>
  );
};

export const AthletesGridTranslated = withNamespaces()(AthletesGrid);
export default AthletesGrid;
