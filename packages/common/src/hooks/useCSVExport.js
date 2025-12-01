// @flow
import { useCallback } from 'react';
import downloadCSV from '../utils/downloadCSV';

/**
 * Hook that returns a download function which will download the data to a users browser when called
 *
 * @param {string} filename name of file when downloaded
 * @param {Array<Object>} data json array of data to be exported, in the format of [{Header: "value 1"}, {Header: "value 2"}]
 * @param {Object} options options object for json2csv function https://github.com/mrodrig/json-2-csv#converterjson2csvarray-callback-options
 * @returns
 */
export default function useCSVExport(
  filename: string,
  data: Array<Object>,
  options: ?Object
) {
  const downloadFile = useCallback(() => {
    downloadCSV(filename, data, options);
  }, [filename, data, options]);

  return downloadFile;
}
