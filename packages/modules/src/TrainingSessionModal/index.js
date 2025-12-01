// @flow
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { ErrorBoundary } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import { AppTranslated as App } from './src/components/App';

const renderTrainingSessionModal = (
  trainingSessionId: number,
  formMode: 'EDIT' | 'CREATE'
) => {
  const TrainingSessionModalElement = document.getElementById(
    'TrainingSessionModal'
  );

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <App
          trainingSessionId={trainingSessionId}
          formMode={formMode}
          calledOutsideReact
        />
      </ErrorBoundary>
    </I18nextProvider>,
    TrainingSessionModalElement
  );
};

export default renderTrainingSessionModal;
