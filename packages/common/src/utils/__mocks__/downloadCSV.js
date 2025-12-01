// @flow
import { parse } from 'json2csv';

/**
 * Downloads the JSON supplied as a csv file in the browser
 *
 * @param {string} filename name of file when downloaded
 * @param {Array<Object>} data json array of data to be exported, in the format of [{Header: "value 1"}, {Header: "value 2"}]
 * @param {Object} options options object for json2csv function https://github.com/mrodrig/json-2-csv#converterjson2csvarray-callback-options
 * @param {Function} onError optional callback thats called if there is an issue with the export
 * @param {Function} onSuccess optional callback once download link clicked
 */
function downloadCSV(
  filename: string,
  data: Array<Object>,
  options: ?Object,
  onError?: Function,
  onSuccess?: Function
) {
  try {
    const csv = parse(data, options);
    const hiddenElement = document.createElement('a');
    const output = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    hiddenElement.href = output;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${filename}.csv`;
    // hiddenElement.click(); Just don't click the download in this mock. Incase file actually does build up on test execution
    hiddenElement.remove();
    onSuccess?.(output); // Output the data to success callback so can test result
  } catch (err) {
    if (typeof onError === 'function') onError(err);
  }
}

export default downloadCSV;
