// @flow
import { useState } from 'react';

export type Request<T> = {
  status: 'DORMANT' | 'PENDING' | 'SUCCESS' | 'ERROR',
  data: ?T,
  error: ?Object,
};

function useReportData<T>(
  service: (Object) => Promise<T>,
  params: ?Object = {}
): { ...Request<T>, fetchData: (?Object) => void } {
  const [reportData, setReportData] = useState<Request<T>>({
    status: 'DORMANT',
    data: null,
    error: null,
  });

  const fetchData = () => {
    setReportData((state) => ({ ...state, status: 'PENDING' }));
    service(params)
      .then((data) => {
        setReportData({
          status: 'SUCCESS',
          data,
          error: null,
        });
      })
      .catch((error) => {
        setReportData({
          status: 'ERROR',
          data: null,
          error,
        });
      });
  };

  return { ...reportData, fetchData };
}

export default useReportData;
