// @flow
import { pdfjs } from 'react-pdf';

export const setupPDFWorker = () => {
  /*
    https://github.com/wojtekmaj/react-pdf/blob/v6.x/README.md#create-react-app
    in packages/profiler/package.json copying pdf.worker.min.js to libs
  */
  pdfjs.GlobalWorkerOptions.workerSrc = '/libs/pdf.worker.min.js';

  /*
    NOTE: For medinah, we have a task, 'libs-to-dist', to get pdf.worker.min.js
    accessible
  */

  /*
    THIS is how we may do it in the newer version when we upgrade
    But note our version of flow complains about it.

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      '/libs/pdf.worker.min.js',
      // $FlowIgnore flow can't deal with this line, and ignore does not work
      import.meta.url
    ).toString(); // NOTE: Our version of flow can't deal with this line, and ignore does not work
  */
};
