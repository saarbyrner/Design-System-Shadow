// @flow
import { useState } from 'react';
import { getDiagnostics } from '@kitman/services';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import type { RequestStatus } from '@kitman/common/src/types';
import type { DiagnosticFilter, Diagnostic } from '../types';

const useDiagnostics = () => {
  const [diagnosticsRequestStatus, setDiagnosticsRequestStatus] = useState<
    RequestStatus | 'DORMANT'
  >('DORMANT');
  const [diagnostics, setDiagnostics] = useState<Array<Diagnostic>>([]);
  const [nextPage, setNextPage] = useState(null);
  const checkIsMounted = useIsMountedCheck();

  const fetchDiagnostics = (
    filters: DiagnosticFilter,
    resetList: boolean
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      getDiagnostics(filters, resetList ? null : nextPage)
        .then((data) => {
          if (!checkIsMounted()) {
            return;
          }
          setDiagnostics((prevDiagnostics) =>
            resetList
              ? data.diagnostics
              : [...prevDiagnostics, ...data.diagnostics]
          );
          setNextPage(data.meta.next_page);
          if (!data.meta.next_page) {
            resolve();
          }
          setDiagnosticsRequestStatus('SUCCESS');
        })
        .catch((err) => {
          if (!checkIsMounted()) {
            return;
          }
          reject(err);
          setDiagnosticsRequestStatus('FAILURE');
        });
    });

  const resetDiagnostics = () => setDiagnostics([]);
  const resetNextPage = () => setNextPage(null);

  return {
    diagnosticsRequestStatus,
    setDiagnosticsRequestStatus,
    diagnostics,
    fetchDiagnostics,
    resetDiagnostics,
    resetNextPage,
    nextPage,
  };
};

export default useDiagnostics;
