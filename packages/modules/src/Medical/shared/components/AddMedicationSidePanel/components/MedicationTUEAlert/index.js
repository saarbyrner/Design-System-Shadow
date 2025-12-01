// @flow
import { withNamespaces } from 'react-i18next';
import { Alert, AlertTitle } from '@kitman/playbook/components';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isUnlistedMed: boolean,
  localDrugId: ?number,
  drugName?: string,
};

// TODO: we will get a Backend service for drugs with banned substances

// KLAtlanta Drug Ids
const DrugIdsDemoAccount = [
  31533, // testosterone 50 mg implant pellet
  24309, // testosterone cypionate 200 mg/mL intramuscular kit
  25527, // testosterone micronized (bulk) 100 % powder
  28670, // testosterone enanthate 50 mg/0.5 mL subcutaneous auto-injector
  28673, // testosterone enanthate 75 mg/0.5 mL subcutaneous auto-injector
  28674, // testosterone enanthate 100 mg/0.5 mL subcutaneous auto-injector
  29203, // testosterone undecanoate 237 mg capsule
  29218, // testosterone undecanoate 158 mg capsule
  29219, // testosterone undecanoate 198 mg capsule
  29809, // testosterone 200 mg implant pellet
  31117, // testosterone 100 mg implant pellet
  24043, // testosterone 5.5 mg/0.122 gram per actuation nasal gel pump
  33143, // testosterone undecanoate 112.5 mg capsule
  33622, // testosterone undecanoate 100 mg capsule
  33623, // testosterone undecanoate 150 mg capsule
  33624, // testosterone undecanoate 200 mg capsule
  96601, // testosterone 25 mg implant pellet
  96602, // testosterone 37.5 mg implant pellet
  96603, // testosterone 87.5 mg implant pellet
  99294, // testosterone 75 mg-anastrozole 4 mg implant pellet
  122751, // testosterone undecanoate (bulk) 100 % powder
  139426, // testosterone cypionate 200 mg/mL intramuscular syringe
  10399, // testosterone 12.5 mg/1.25 gram per pump actuation (1%) transdermal gel
  1743, // testosterone cypionate 100 mg/mL intramuscular oil
  2242, // testosterone 75 mg implant pellet
  2821, // testosterone propionate (bulk) powder
  3420, // Depo-Testosterone 200 mg/mL intramuscular oil
  4500, // testosterone cypionate (bulk) 100 % powder
  4671, // testosterone (bulk) powder
  5627, // testosterone enanthate 200 mg/mL intramuscular oil
  5825, // testosterone cypionate 200 mg/mL intramuscular oil
  6010, // testosterone 1 % (25 mg/2.5 gram) transdermal gel packet
  6856, // testosterone 1 % (50 mg/5 gram) transdermal gel packet
  1237, // Depo-Testosterone 100 mg/mL intramuscular oil
  12270, // testosterone 50 mg/5 gram (1 %) transdermal gel
  17483, // testosterone 10 mg/0.5 gram/actuation transdermal gel pump
  17651, // testosterone 30 mg/actuation (1.5 mL) transderm solution metered pump
  17823, // testosterone enanthate (bulk) 100 % powder
  17863, // testosterone 20.25 mg/1.25 gram per pump act.(1.62 %) transdermal gel
  20417, // testosterone 1.62 % (20.25 mg/1.25 gram) transdermal gel packet
  20419, // testosterone 1.62 % (40.5 mg/2.5 gram) transdermal gel packet
  21090, // testosterone cypionate, micronized (bulk) 100 % powder
  22537, // testosterone undecanoate 750 mg/3 mL (250mg/mL) intramuscular solution
];

// These are database IDs on akron pros
export const BannedSubstanceLocalDrugIds = [
  ...DrugIdsDemoAccount,
  90, // terbutaline sulfate (bulk) powder
  660, // terbutaline 2.5 mg tablet
  1339, // Depo-Testosterone 100 mg/mL intramuscular oil
  1864, // testosterone cypionate 100 mg/mL intramuscular oil
  2388, // testosterone 75 mg implant pellet
  2986, // testosterone propionate (bulk) powder
  3231, // Decongestant Inhaler 50 mg nasal
  3613, // Depo-Testosterone 200 mg/mL intramuscular oil
  4070, // terbutaline 5 mg tablet
  4734, // testosterone cypionate (bulk) 100 % powder
  4908, // testosterone (bulk) powder
  5896, // testosterone enanthate 200 mg/mL intramuscular oil
  6106, // testosterone cypionate 200 mg/mL intramuscular oil
  6297, // testosterone 1 % (25 mg/2.5 gram) transdermal gel packet
  6649, // Benzedrex nasal inhaler
  7170, // testosterone 1 % (50 mg/5 gram) transdermal gel packet
  10440, // terbutaline 1 mg/mL subcutaneous solution
  10806, // testosterone 12.5 mg/1.25 gram per pump actuation (1%) transdermal gel
  12743, // testosterone 50 mg/5 gram (1 %) transdermal gel
  14140, // levmetamfetamine 50 mg nasal inhaler
  14144, // Vapor Inhaler 50 mg nasal
  18194, // testosterone 10 mg/0.5 gram/actuation transdermal gel pump
  18365, // testosterone 30 mg/actuation (1.5 mL) transderm solution metered pump
  18539, // testosterone enanthate (bulk) 100 % powder
  18579, // testosterone 20.25 mg/1.25 gram per pump act.(1.62 %) transdermal gel
  19840, // ciclesonide 37 mcg/actuation nasal HFA inhaler
  20168, // beclomethasone dipropionate 80 mcg/actuation nasal HFA inhaler
  20551, // Zetonna 37 mcg/actuation nasal HFA inhaler
  21220, // testosterone 1.62 % (20.25 mg/1.25 gram) transdermal gel packet
  21222, // testosterone 1.62 % (40.5 mg/2.5 gram) transdermal gel packet
  21924, // testosterone cypionate, micronized (bulk) 100 % powder
  23432, // testosterone undecanoate 750 mg/3 mL (250mg/mL) intramuscular solution
  24497, // Cold and Sinus Relief (ibuprofen) 30 mg-200 mg capsule
  24977, // testosterone 5.5 mg/0.122 gram per actuation nasal gel pump
  25259, // testosterone cypionate 200 mg/mL intramuscular kit
  26501, // testosterone micronized (bulk) 100 % powder
  29243, // Menthol Nasal Inhaler
  29764, // testosterone enanthate 50 mg/0.5 mL subcutaneous auto-injector
  29767, // testosterone enanthate 75 mg/0.5 mL subcutaneous auto-injector
  29768, // testosterone enanthate 100 mg/0.5 mL subcutaneous auto-injector
  30323, // testosterone undecanoate 237 mg capsule
  30338, // testosterone undecanoate 158 mg capsule
  30339, // testosterone undecanoate 198 mg capsule
  30958, // testosterone 200 mg implant pellet
  32383, // testosterone 100 mg implant pellet
  32830, // testosterone 50 mg implant pellet
  34500, // testosterone undecanoate 112.5 mg capsule
  35017, // testosterone undecanoate 100 mg capsule
  35018, // testosterone undecanoate 150 mg capsule
  35019, // testosterone undecanoate 200 mg capsule
  286333, // testosterone 25 mg implant pellet
  286334, // testosterone 37.5 mg implant pellet
  286335, // testosterone 87.5 mg implant pellet
  288026, // testosterone 75 mg-anastrozole 4 mg implant pellet
  308804, // testosterone undecanoate (bulk) 100 % powder
  321708, // Vapor Inhaler (menthol) nasal
  324744, // testosterone cypionate 200 mg/mL intramuscular syringe
];

const MedicationTUEAlert = ({
  t,
  isUnlistedMed,
  localDrugId,
  drugName,
}: I18nProps<Props>) => {
  const containsBannedSubstance =
    BannedSubstanceLocalDrugIds.includes(localDrugId) ||
    drugName?.toLowerCase().includes('testosterone');
  const needsTUE = containsBannedSubstance || isUnlistedMed;
  const getAlertText = () => {
    if (isUnlistedMed) {
      return t(
        'Unlisted medications may contain banned substance(s) and may require a (TUE).'
      );
    }
    return t(
      'This medication may contain banned substance(s) and may require a (TUE).'
    );
  };

  if (needsTUE) {
    return (
      <Alert severity="warning">
        <AlertTitle>{t('Warning')}</AlertTitle> {getAlertText()}
      </Alert>
    );
  }
  return null;
};

export const MedicationTUEAlertTranslated: ComponentType<Props> =
  withNamespaces()(MedicationTUEAlert);

export default MedicationTUEAlert;
