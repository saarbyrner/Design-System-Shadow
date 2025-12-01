// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';
import type {
  BodyArea as BodyAreaType,
  Classification as ClassificationType,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

export type Classification = ClassificationType;
export type Classifications = Array<Classification>;

export const getClinicalImpressionsClassifications =
  (): Promise<Classifications> =>
    ajaxPromise({
      method: 'GET',
      url: '/ui/medical/clinical_impressions_classifications',
    });

export type BodyArea = BodyAreaType;
export type BodyAreas = Array<BodyArea>;

export const getClinicalImpressionsBodyAreas = (): Promise<BodyAreas> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/clinical_impressions_body_areas',
  });
