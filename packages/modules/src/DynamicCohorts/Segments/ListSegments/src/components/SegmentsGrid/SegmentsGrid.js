// @flow
import { useRef, useState, useLayoutEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { DataGrid } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch } from 'react-redux';
import type { ComponentType } from 'react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import style from '@kitman/modules/src/DynamicCohorts/shared/styles';
import { useDeleteSegmentMutation } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import useSegmentsGrid from './useSegmentsGrid';
import { setNextId } from '../../../redux/slices/manageSegmentsSlice';

const gridBottomMarginToHideOverflowOnBody = '50px';

type Props = {
  canEditSegment: boolean,
};

const SegmentsGrid = ({ canEditSegment, t }: I18nProps<Props>) => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const [height, setHeight] = useState();
  const locationAssign = useLocationAssign();
  const [deleteSegment] = useDeleteSegmentMutation();

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { y } = containerRef.current.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  const {
    isGridError,
    isGridFetching,
    isGridSuccess,
    segments,
    rows,
    columns,
    nextIdToFetch,
    resetSegmentsGrid,
  } = useSegmentsGrid();

  const getRowActions = () => {
    const rowActions = [];
    if (canEditSegment) {
      rowActions.push({
        id: 'edit',
        text: t('Edit'),
        onCallAction: (segmentId) => {
          locationAssign(`/administration/groups/${segmentId}/edit`);
        },
      });
      rowActions.push({
        id: 'delete',
        text: t('Delete'),
        onCallAction: (segmentId) => {
          deleteSegment(segmentId)
            .unwrap()
            .then(() => {
              dispatch(
                add({
                  status: 'SUCCESS',
                  title: t('Group successfully deleted.'),
                })
              );
              resetSegmentsGrid();
            })
            .catch(() => {
              dispatch(
                add({
                  status: 'ERROR',
                  title: t('Error deleting group.'),
                })
              );
            });
        },
      });
      return rowActions;
    }
    return null;
  };

  return (
    <>
      {isGridError && <>{t('Error fetching groups.')}</>}
      {isGridSuccess && (
        <div
          id="labelsGrid"
          // $FlowFixMe div does not like ref
          ref={containerRef}
          css={style.grid}
        >
          <DataGrid
            columns={columns}
            rows={rows}
            rowActions={getRowActions()}
            emptyTableText={t('No groups.')}
            isTableEmpty={segments?.length === 0}
            maxHeight={height}
            isFullyLoaded={isGridSuccess ? nextIdToFetch === null : true}
            fetchMoreData={() => dispatch(setNextId(nextIdToFetch))}
            isLoading={isGridFetching}
            scrollOnBody
          />
        </div>
      )}
    </>
  );
};

export const SegmentsGridTranslated: ComponentType<Props> =
  withNamespaces()(SegmentsGrid);
export default SegmentsGrid;
