// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { AppStatus } from '@kitman/components';
import { Box, Typography, DataGrid } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/common/src/types';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { useGetImportJobsQuery } from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';

import {
  getRows,
  getColumns,
  getLastEditedDate,
  getLastEditedSubmission,
} from './utils';
import { type SubmissionsSubmitted, type LastEdited } from './types';

import styles from './styles';

const GrowthAndMaturationApp = ({ t }: I18nProps<{}>) => {
  useBrowserTabTitle(t('Growth and maturation'));

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [lastEdited, setLastEdited] = useState<LastEdited | null>(null);
  const [submissionsSubmitted, setSubmissionsSubmitted] =
    useState<SubmissionsSubmitted | null>(null);

  const growthAndMaturationImportType = `${IMPORT_TYPES.GrowthAndMaturation}_import`;
  const baselinesImportType = `${IMPORT_TYPES.Baselines}_import`;

  const {
    data: queryResponse,
    isError,
    isLoading,
    isSuccess,
    status,
  } = useGetImportJobsQuery(
    {
      importTypes: [growthAndMaturationImportType, baselinesImportType],
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (isLoading) setRequestStatus('PENDING');
    if (isError) setRequestStatus('FAILURE');

    if (isSuccess) {
      const growthAndMaturationSubmissions = queryResponse.data.filter(
        (submission) => submission.importType === growthAndMaturationImportType
      );
      const baselinesSubmissions = queryResponse.data.filter(
        (submission) => submission.importType === baselinesImportType
      );

      setLastEdited({
        growth_and_maturation: {
          date: getLastEditedDate(
            growthAndMaturationSubmissions.length
              ? getLastEditedSubmission(growthAndMaturationSubmissions)
                  .createdAt
              : null
          ),
          by: growthAndMaturationSubmissions.length
            ? getLastEditedSubmission(growthAndMaturationSubmissions).createdBy
                ?.fullname
            : null,
        },
        baselines: {
          date: getLastEditedDate(
            baselinesSubmissions.length
              ? getLastEditedSubmission(baselinesSubmissions).createdAt
              : null
          ),
          by: baselinesSubmissions.length
            ? getLastEditedSubmission(baselinesSubmissions).createdBy?.fullname
            : null,
        },
      });
      setSubmissionsSubmitted({
        growth_and_maturation: growthAndMaturationSubmissions.length,
        baselines: baselinesSubmissions.length,
      });

      setRequestStatus('SUCCESS');
    }
  }, [status, queryResponse]);

  if (requestStatus === 'SUCCESS') {
    return (
      <>
        <Box sx={styles.wrapper}>
          <Typography variant="h5" component="h1" sx={styles.title}>
            {t('Growth and maturation')}
          </Typography>
        </Box>

        <Box>
          <DataGrid
            sx={{ backgroundColor: 'background.default', border: 'none' }}
            columns={getColumns()}
            rows={getRows(submissionsSubmitted, lastEdited)}
            disableColumnReorder={false}
            disableColumnResize={false}
          />
        </Box>
      </>
    );
  }

  return (
    <AppStatus
      status={requestStatus === 'PENDING' ? 'loading' : 'error'}
      message={requestStatus === 'PENDING' && 'Loading...'}
    />
  );
};

// Exporting translated as default for use in Router
export default withNamespaces()(GrowthAndMaturationApp);
