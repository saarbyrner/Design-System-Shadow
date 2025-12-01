// @flow
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { ErrorBoundary } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import { AppTranslated as App } from './src/components/App';
import type { Event } from './src/types';

const renderImportWorkflow = (event: Event) => {
  const importWorkflowElement = document.getElementById('importWorkflow');
  const orgTimezone =
    document.getElementsByTagName('body')[0].dataset.timezone || '';

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <App event={event} orgTimezone={orgTimezone} calledOutsideReact />
      </ErrorBoundary>
    </I18nextProvider>,
    importWorkflowElement
  );
};

export default renderImportWorkflow;
