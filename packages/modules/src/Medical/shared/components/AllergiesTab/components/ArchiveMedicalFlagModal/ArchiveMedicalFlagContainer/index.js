// @flow
import type {
  AllergyDataResponse,
  AthleteMedicalAlertDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

import { ArchiveMedicalFlagModalTranslated as ArchiveMedicalFlagModal } from '..';

type Props = {
  selectedMedicalFlag: AllergyDataResponse | AthleteMedicalAlertDataResponse,
  isOpen: boolean,
  onClose: Function,
  setRequestStatus: Function,
  enableReloadData: Function,
};

const ArchiveMedicalFlagContainer = (props: Props) => {
  return (
    <ArchiveMedicalFlagModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      selectedMedicalFlag={props.selectedMedicalFlag}
      setRequestStatus={props.setRequestStatus}
      enableReloadData={props.enableReloadData}
    />
  );
};

export default ArchiveMedicalFlagContainer;
