// @flow
import { useState, useEffect } from 'react';

const useDataReady = (grid: Object, gridDataIsLoading: boolean) => {
  const [dataIsReady, setDataIsReady] = useState(false);

  useEffect(() => {
    if (grid && grid.rows && !gridDataIsLoading) {
      setDataIsReady(true);
    } else {
      setDataIsReady(false);
    }
  }, [grid, gridDataIsLoading]);

  return dataIsReady;
};

export default useDataReady;
