// @flow
/* eslint-disable no-console */

import { axios } from '@kitman/common/src/utils/services';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';

export type CodingSystemSide = {
  coding_system_side_id: number,
  coding_system_side_name: string,
  side_id: number,
  side_name: string,
  coding_system_side_active: string,
};

export type GetCodingSystemSidesResponse = Array<CodingSystemSide>;

// Changes 'osiics_15' to 'OSIICS-15'
export const normalizeCodingSystemKey = (key: CodingSystemKey): string => {
  return key.replace(/_/g, '-').toUpperCase();
};

const getCodingSystemSides = async (
  codingSystemKey?: CodingSystemKey,
  includeBlank: boolean = true
): Promise<GetCodingSystemSidesResponse> => {
  if (!codingSystemKey) {
    return [];
  }

  try {
    const params = new URLSearchParams();
    if (codingSystemKey) {
      params.append('coding_system', normalizeCodingSystemKey(codingSystemKey));
    }
    params.append('include_blank', String(!!includeBlank));

    const url = `/emr/coding_system_sides?${params.toString()}`;
    const { data } = await axios.get<GetCodingSystemSidesResponse>(url);

    return data;
  } catch (error) {
    console.error('Error fetching coding system sides:', error); // Will be replaced with Standardized error system toast
    return [];
  }
};

export default getCodingSystemSides;
