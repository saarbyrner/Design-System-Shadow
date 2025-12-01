// @flow
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { PermissionsProvider } from '@kitman/common/src/contexts/PermissionsContext';
import { ErrorBoundary } from '@kitman/components';
import { ResultsFormDisplayTranslated as ResultsFormDisplay } from '@kitman/modules/src/Medical/forms/src/components/ResultsFormDisplay';

export default () => {
  /*
   * giving the url /medical/athletes/30693/forms/1
   * the athleteId is the third part of the URL
   * the formsId is the last part of the URL
   */
  const urlParts = window.location.pathname.split('/');
  const athleteId = urlParts[3];
  const formId = parseInt(urlParts[urlParts.length - 1], 10);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <PermissionsProvider>
          <ResultsFormDisplay formId={formId} athleteId={athleteId} />
        </PermissionsProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
};
