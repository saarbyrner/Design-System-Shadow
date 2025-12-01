// @flow
import { useState } from 'react';
import { getProcedures } from '@kitman/services';
import type { ProceduresFilter } from '../types';
import type { ProcedureResponseData } from '../types/medical';

const useProcedures = () => {
  const [procedures, setProcedures] = useState<Array<ProcedureResponseData>>(
    []
  );
  const [nextPage, setNextPage] = useState(null);

  const fetchProcedures = (
    filters: ProceduresFilter,
    resetList: boolean
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      getProcedures(filters, resetList ? null : nextPage)
        .then((data) => {
          setProcedures((prevProcedures) =>
            resetList
              ? data.procedures
              : [...prevProcedures, ...data.procedures]
          );
          setNextPage(data.next_id);
          if (!data.next_id) {
            resolve();
          }
        })
        .catch(() => {
          reject();
        });
    });

  const resetProcedures = () => setProcedures([]);
  const resetNextPage = () => setNextPage(null);

  return {
    procedures,
    fetchProcedures,
    resetProcedures,
    resetNextPage,
  };
};

export default useProcedures;
