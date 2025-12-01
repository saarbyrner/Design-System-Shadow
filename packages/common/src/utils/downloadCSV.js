// @flow
import { parse } from 'json2csv';
import _isString from 'lodash/isString';

/**
 * Downloads the JSON supplied as a csv file in the browser
 *
 * @param {string} filename name of file when downloaded
 * @param {string|Array<Object>} csv as string or an array of data to be exported, in the format of [{Header: "value 1"}, {Header: "value 2"}]
 * @param {Object} options options object for json2csv function https://github.com/mrodrig/json-2-csv#converterjson2csvarray-callback-options
 * @param {Function} onError optional callback thats called if there is an issue with the export
 * @param {Function} onSuccess optional callback once download link clicked
 */
function downloadCSV(
  filename: string,
  data: string | Array<Object>,
  options: ?Object,
  onError?: Function,
  onSuccess?: Function
) {
  try {
    const csv = _isString(data) ? data.toString() : parse(data, options);
    const hiddenElement = document.createElement('a');

    hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
      csv
    )}`;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${filename}.csv`;
    hiddenElement.click();
    hiddenElement.remove();
    onSuccess?.();
  } catch (err) {
    if (typeof onError === 'function') onError(err);
  }
}

export default downloadCSV;
