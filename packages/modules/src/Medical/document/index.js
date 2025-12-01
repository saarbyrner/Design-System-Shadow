// @flow

import _last from 'lodash/last';
import { ErrorBoundary } from '@kitman/components';
import { AppTranslated as App } from '@kitman/modules/src/Medical/document/src/components/App';

const DocumentMedicalApp = () => {
  /*
   * giving the url /medical/documents/30693
   * the documentId is the last part of the URL
   */
  const documentId = parseInt(_last(window.location.pathname.split('/')), 10);

  return (
    <ErrorBoundary>
      <App documentId={documentId} />
    </ErrorBoundary>
  );
};

export default () => <DocumentMedicalApp />;
