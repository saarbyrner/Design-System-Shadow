// @flow
import { axios } from '@kitman/common/src/utils/services';
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

export type OSIC = {
  id: string,
  bamic: null | boolean,
  icd: string | null,
};
export type OSICs = Array<OSIC>;

export const getInjuryOsics = (): Promise<OSICs> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/injuries/osics',
  });

export const getIllnessOsics = (): Promise<OSICs> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/illnesses/osics',
  });

export const getInjuryOsicsPathologies = (): Promise<Pathologies> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/injuries/osics_pathologies',
  });

export const getIllnessOsicsPathologies = (): Promise<Pathologies> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/illnesses/osics_pathologies',
  });

export const getInjuryOsicsClassifications = (): Promise<Classifications> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/injuries/osics_classifications',
  });

export const getIllnessOsicsClassifications = (): Promise<Classifications> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/illnesses/osics_classifications',
  });

export const getInjuryOsicsBodyAreas = (): Promise<BodyAreas> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/injuries/osics_body_areas',
  });

export const getIllnessOsicsBodyAreas = (): Promise<BodyAreas> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/illnesses/osics_body_areas',
  });

export const getCodingSystemV2Classifications =
  async (): Promise<Classifications> => {
    const { data } = await axios.get('/emr/pathologies/classifications');
    return data;
  };
