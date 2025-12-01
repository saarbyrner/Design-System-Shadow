/* eslint-disable flowtype/require-valid-file-annotation */
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  usePermissions,
  PermissionsProvider,
} from '@kitman/common/src/contexts/PermissionsContext';
import { Provider, useSelector } from 'react-redux';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import _last from 'lodash/last';
import {
  useOrganisation,
  OrganisationProvider,
} from '@kitman/common/src/contexts/OrganisationContext';
import { AppTranslated as App } from '@kitman/modules/src/Medical/issues/src/components/App';
import store from '@kitman/modules/src/Medical/issues/src/redux/store';
import {
  useIssue,
  IssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext';

const IssueMedicalApp = (props) => {
  const { requestStatus: issueRequestStatus } = useIssue();

  if (issueRequestStatus === 'FAILURE') {
    return <AppStatus status="error" isEmbed />;
  }

  if (issueRequestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (issueRequestStatus === 'SUCCESS') {
    return (
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <App {...props} />
        </ErrorBoundary>
      </I18nextProvider>
    );
  }

  return null;
};

const IssueProviderWrapper = (props) => {
  const { isChronicIssue } = props;
  const { permissionsRequestStatus } = usePermissions();
  const { organisation, organisationRequestStatus } = useOrganisation();
  const pathname = useLocationPathname();
  /*
   * giving the url /medical/illnesses/123/athletes/30693
   * the athleteId is the third part of the URL
   * the issueId is the last part of the URL
   */
  const urlParts = pathname.split('/'); // ['', 'medical', 'athletes', '32774', 'illnesses', '5357']
  const athleteId = urlParts[3];
  const issueType = urlParts[4] === 'illnesses' ? 'Illness' : 'Injury';
  const issueId = _last(urlParts);

  if (
    organisationRequestStatus === 'FAILURE' ||
    permissionsRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }

  if (
    organisationRequestStatus === 'PENDING' ||
    permissionsRequestStatus === 'PENDING'
  ) {
    return <DelayedLoadingFeedback />;
  }

  if (
    organisationRequestStatus === 'SUCCESS' &&
    permissionsRequestStatus === 'SUCCESS'
  ) {
    return (
      <Provider store={store}>
        <IssueContextProvider
          athleteId={athleteId}
          issueType={issueType}
          issueId={issueId}
          isChronicIssue={isChronicIssue}
          organisationId={organisation.id}
        >
          <IssueMedicalApp {...props} />
        </IssueContextProvider>
      </Provider>
    );
  }

  return null;
};

export default (props) => {
  const { isPlayerSelectOpen } = useSelector(
    (state) => state.playerSelectSlice
  );
  const { isChronicIssue } = props;
  return (
    <OrganisationProvider>
      <PermissionsProvider>
        <IssueProviderWrapper
          isChronicIssue={isChronicIssue}
          isPlayerSelectOpen={isPlayerSelectOpen}
        />
      </PermissionsProvider>
    </OrganisationProvider>
  );
};
