// @flow
import {
  getClinicalImpressionsBodyAreas,
  getClinicalImpressionsClassifications,
  getDatalysBodyAreas,
  getDatalysClassifications,
  getIllnessOsicsBodyAreas,
  getIllnessOsicsClassifications,
  getIllnessOsicsPathologies,
  getInjuryOsicsBodyAreas,
  getInjuryOsicsClassifications,
  getInjuryOsicsPathologies,
} from '@kitman/services';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';

const getCodingSystemCategories = (
  codingSystemKey: CodingSystemKey
): Array<Promise<Object>> => {
  switch (codingSystemKey) {
    case codingSystemKeys.OSICS_10:
      return [
        getInjuryOsicsPathologies(),
        getIllnessOsicsPathologies(),
        getInjuryOsicsClassifications(),
        getIllnessOsicsClassifications(),
        getInjuryOsicsBodyAreas(),
        getIllnessOsicsBodyAreas(),
      ];

    case codingSystemKeys.DATALYS:
      return [getDatalysClassifications(), getDatalysBodyAreas()];

    case codingSystemKeys.CLINICAL_IMPRESSIONS:
      return [
        getClinicalImpressionsClassifications(),
        getClinicalImpressionsBodyAreas(),
      ];

    case codingSystemKeys.ICD:
      return [
        // ICD uses the same endpoint as of OSICS for getting classifications and body areas.
        getInjuryOsicsClassifications(),
        getIllnessOsicsClassifications(),
        getInjuryOsicsBodyAreas(),
        getIllnessOsicsBodyAreas(),
      ];
    default:
      return [];
  }
};

export default getCodingSystemCategories;
