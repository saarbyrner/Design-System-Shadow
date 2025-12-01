// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';
import type {
  BodyArea as BodyAreaType,
  Classification as ClassificationType,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

export type Classification = ClassificationType;
export type Classifications = Array<Classification>;

export const getDatalysClassifications = (): Promise<Classifications> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/datalys_classifications',
  });

export type BodyArea = BodyAreaType;
export type BodyAreas = Array<BodyArea>;

export const getDatalysBodyAreas = (): Promise<BodyAreas> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/datalys_body_areas',
  });
