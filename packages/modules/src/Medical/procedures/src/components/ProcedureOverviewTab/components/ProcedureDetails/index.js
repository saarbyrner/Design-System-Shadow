// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { AppStatus, LineLoader } from '@kitman/components';
import { DetailsTranslated as Details } from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/Details';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import style from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/styles';

const ProcedureDetails = () => {
  // eslint-disable-next-line no-unused-vars
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <section css={style.section}>
      <Details />
      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="ProcedureDetailsLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </section>
  );
};

export const ProcedureDetailsTranslated = withNamespaces()(ProcedureDetails);
export default ProcedureDetails;
