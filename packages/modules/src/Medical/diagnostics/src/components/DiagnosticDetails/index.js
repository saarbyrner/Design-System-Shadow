// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, LineLoader } from '@kitman/components';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { PrintViewTranslated as PrintView } from './PrintView';
import { HeaderTranslated as Header } from './Header';
import { AdditionalInfoTranslated as AdditionalInfo } from './AdditionalInfo';
import style from './styles';

type Props = { hiddenFilters?: ?Array<string> };
const DiagnosticDetails = (props: Props) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);

  const isRedoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <section css={style.section}>
      <Header hiddenFilters={props.hiddenFilters} />
      {(!window.featureFlags['diagnostics-multiple-cpt'] || isRedoxOrg) && (
        <AdditionalInfo />
      )}
      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="DiagnosticDetailsLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
      {window.featureFlags['print-diagnostics'] && (
        <PrintView setRequestStatus={setRequestStatus} />
      )}
    </section>
  );
};

export const DiagnosticDetailsTranslated = withNamespaces()(DiagnosticDetails);
export default DiagnosticDetails;
