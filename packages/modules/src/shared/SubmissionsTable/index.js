// @flow
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  DataGrid,
  ConfirmationModal,
  Typography,
} from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { useIsMountedCheck } from '@kitman/common/src/hooks';
import {
  useGetImportJobsQuery,
  useLazyDeleteMassUploadQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { onUpdateImportToDelete } from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import { getTitleLabels } from '@kitman/modules/src/shared/MassUpload/New/utils';
import getDeleteImportData from '@kitman/common/src/utils/TrackingData/src/data/forms/deleteImport/getDeleteImportData';

import { transformImportsListToRows, getColumns } from './utils';
import type { SubmissionsRow, ImportTypesWithSubmissionsTable } from './types';
import styles from './styles';

/*
  This component is primarily used for the dashboard pages of mass upload importers,
  however there is no reason this can't be used elsewhere, as long as the endpoint
  used is relevant.
*/
const SubmissionsTable = ({
  importType,
}: {
  importType: ImportTypesWithSubmissionsTable,
}) => {
  const checkIsMounted = useIsMountedCheck();

  // `columns` must keep the same reference between re-renders.
  const columns = useMemo(() => getColumns(importType), [importType]);

  const [rows, setRows] = useState<Array<SubmissionsRow>>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const appHeaderHeight = useAppHeaderHeight();

  const { trackEvent } = useEventTracking();

  const {
    data: queryResponse,
    isSuccess,
    isError,
    refetch,
  } = useGetImportJobsQuery(
    {
      importTypes: [`${importType}_import`],
    },
    { refetchOnMountOrArgChange: true }
  );

  const dispatch = useDispatch();
  const { isConfirmationModalOpen, attachmentId, submissionStatus } =
    useSelector((state) => state.massUploadSlice.deleteImport);

  const [
    deleteMassUpload,
    {
      isLoading: isDeleteInProgress,
      isSuccess: hasDeleteCompleted,
      isError: hasDeleteErrored,
    },
  ] = useLazyDeleteMassUploadQuery();

  const tryDelete = async () => {
    trackEvent(
      `Forms - ${
        getTitleLabels()[importType]
      } - CSV Importer - Delete Import Confirmation Click`,
      getDeleteImportData(submissionStatus)
    );
    await deleteMassUpload({
      attachmentId,
      importType,
    });
    dispatch(
      onUpdateImportToDelete({
        id: attachmentId,
        showDeleteConfirmation: false,
      })
    );
    // Setting timeout to refetch submissions to allow for time for
    // deletion to occur, as this is done by a worker. This is a temporary
    // solution until polling/server-side events is implemented.
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  useEffect(() => {
    if (hasDeleteCompleted) {
      dispatch(
        add({
          id: attachmentId,
          status: 'SUCCESS',
          title: i18n.t('Import deleted'),
        })
      );
    }
    if (hasDeleteErrored) {
      dispatch(
        add({
          id: attachmentId,
          status: 'ERROR',
          title: i18n.t('Error deleting import'),
          description: i18n.t('Please try again.'),
        })
      );
    }
  }, [hasDeleteErrored, hasDeleteCompleted]);

  useEffect(() => {
    if (!checkIsMounted()) return;

    if (isSuccess || isError) {
      if (isSuccess && queryResponse?.data?.length > 0) {
        setRows(transformImportsListToRows(queryResponse.data));
      }
      setIsDataLoaded(true);
    }
  }, [isSuccess, isError, queryResponse]);

  const noRowsMessage = isDataLoaded
    ? i18n.t('No measurements submitted yet')
    : `${i18n.t('Loading')}...`;

  return (
    <>
      <ConfirmationModal
        isModalOpen={isConfirmationModalOpen}
        isLoading={isDeleteInProgress}
        isDeleteAction
        onConfirm={tryDelete}
        onCancel={() =>
          dispatch(
            onUpdateImportToDelete({
              id: attachmentId,
              showDeleteConfirmation: false,
            })
          )
        }
        dialogContent={
          <Typography variant="body">
            {i18n.t(
              'Deleting this imported file may change any associated information or visualisations in the system.'
            )}
          </Typography>
        }
        translatedText={{
          title: i18n.t('Delete submission'),
          actions: {
            ctaButton: i18n.t('Delete'),
            cancelButton: i18n.t('Cancel'),
          },
        }}
      />
      <Box
        sx={
          typeof styles.getWrapper === 'function' &&
          styles.getWrapper(appHeaderHeight, importType)
        }
      >
        <DataGrid
          noRowsMessage={noRowsMessage}
          columns={columns}
          rows={rows}
          disableColumnReorder={false}
          disableColumnResize={false}
          pagination
        />
      </Box>
    </>
  );
};

export default SubmissionsTable;
