// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { AppStatus, LineLoader } from '@kitman/components';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { HeaderTranslated as Header } from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/components/Header';
import type {
  AllergyDataResponse,
  AthleteMedicalAlertDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import { AllergyInfoTranslated as AllergyInfo } from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/components/AllergyInfo';
import { MedicalAlertInfoTranslated as MedicalAlertInfo } from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/components/MedicalAlertInfo';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/styles';
import { MedicalFlagHistoryTranslated as MedicalFlagHistory } from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagHistory';

type Request = RequestStatus | 'DORMANT';
type Props = {
  medicalFlag: AllergyDataResponse | AthleteMedicalAlertDataResponse,
};

const MedicalFlagDetails = (props: Props) => {
  // eslint-disable-next-line no-unused-vars
  const [requestStatus, setRequestStatus] = useState<Request>('DORMANT');

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  // update both medical flags to pass down the same title key
  const renderHistory = () => {
    const updateVersions = props.medicalFlag.versions.map((version) => {
      const updatedChangeset = { ...version.changeset };
      updatedChangeset.title = props.medicalFlag.allergen
        ? updatedChangeset.name
        : updatedChangeset.alert_title;
      return { ...version, changeset: updatedChangeset };
    });

    return <MedicalFlagHistory history={updateVersions} />;
  };

  return (
    <section css={style.section} data-testid="MedicalFlag|MedicalFlagDetails">
      <Header />
      {props.medicalFlag.allergen ? (
        // $FlowFixMe
        <AllergyInfo allergyInfo={props.medicalFlag} />
      ) : (
        <MedicalAlertInfo medicalAlert={props.medicalFlag} />
      )}
      {props.medicalFlag.versions &&
        props.medicalFlag.versions.length > 0 &&
        renderHistory()}

      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="MedicalFlagInfoLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </section>
  );
};

export const MedicalFlagDetailsTranslated: ComponentType<Props> =
  withNamespaces()(MedicalFlagDetails);
export default MedicalFlagDetails;
