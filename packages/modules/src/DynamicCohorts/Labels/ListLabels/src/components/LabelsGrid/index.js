// @flow
import { useRef, useState, useLayoutEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { DataGrid, AppStatus } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch } from 'react-redux';
import type { ComponentType } from 'react';
import useLabelsGrid from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid/useLabelsGrid';
import {
  setNextId,
  onOpenLabelModal,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import {
  onUpdateForm,
  onStartEditing,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import style from '@kitman/modules/src/DynamicCohorts/shared/styles';
import { useDeleteLabelMutation } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

const gridBottomMarginToHideOverflowOnBody = '50px';

type Props = {
  isLabelsAdmin: boolean,
};

const LabelsGrid = ({ isLabelsAdmin, t }: I18nProps<Props>) => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const [height, setHeight] = useState();
  const [deleteLabel] = useDeleteLabelMutation();

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { y } = containerRef?.current?.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  const {
    isGridLoading,
    isGridError,
    isGridSuccess,
    labels,
    rows,
    columns,
    nextIdToFetch,
    resetLabelsGrid,
  } = useLabelsGrid();

  const getRowActions = () => {
    const rowActions = [];
    if (isLabelsAdmin) {
      rowActions.push({
        id: 'edit',
        text: t('Edit'),
        onCallAction: (labelId) => {
          const labelToUpdate = labels.find((label) => label.id === labelId);
          dispatch(
            onUpdateForm({
              id: labelId,
              name: labelToUpdate?.name,
              description: labelToUpdate?.description,
              color: labelToUpdate?.color,
            })
          );
          dispatch(onStartEditing());
          dispatch(onOpenLabelModal());
        },
      });
      rowActions.push({
        id: 'delete',
        text: t('Delete'),
        onCallAction: (labelId) => {
          deleteLabel(labelId)
            .unwrap()
            .then(() => {
              dispatch(
                add({
                  status: 'SUCCESS',
                  title: t('Label successfully deleted.'),
                })
              );
              resetLabelsGrid();
            })
            .catch(() => {
              dispatch(
                add({
                  status: 'ERROR',
                  title: t('Error deleting label.'),
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
      {isGridError && <AppStatus status="error" />}
      {isGridLoading && <AppStatus status="loading" />}
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
            emptyTableText={t('No labels yet.')}
            isTableEmpty={labels?.length === 0}
            maxHeight={height}
            isFullyLoaded={nextIdToFetch === null}
            fetchMoreData={() => dispatch(setNextId(nextIdToFetch))}
            isLoading={isGridLoading}
            scrollOnBody
          />
        </div>
      )}
    </>
  );
};

export const LabelsGridTranslated: ComponentType<Props> =
  withNamespaces()(LabelsGrid);
export default LabelsGrid;
