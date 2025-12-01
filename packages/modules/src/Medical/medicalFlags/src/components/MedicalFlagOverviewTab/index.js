// @flow
import { useMedicalFlag } from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext';
import { AdditionalDetailsTranslated as AdditionalDetails } from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/AdditionalDetails';
import MedicalFlagDetails from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/styles';

const MedicalFlagOverviewTab = () => {
  const { medicalFlag } = useMedicalFlag();

  return (
    <div css={style.medicalFlagOverviewTab}>
      <div data-testid="MedicalFlag|Main" css={style.mainContent}>
        <MedicalFlagDetails medicalFlag={medicalFlag} />
      </div>
      <div data-testid="MedicalFlag|Sidebar">
        <AdditionalDetails />
      </div>
    </div>
  );
};

export default MedicalFlagOverviewTab;
