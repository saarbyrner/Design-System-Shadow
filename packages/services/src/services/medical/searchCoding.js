// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ICD,
  OSICS,
  CodingSystemKey,
} from '@kitman/common/src/types/Coding';
import { normalizeCodingSystemKey } from './getCodingSystemSides';

type Response =
  | { coding: 'icd_10_cm', filter: string, results: Array<ICD> }
  | { coding: 'osics_10', filter: string, results: Array<OSICS> };

const searchCoding = async ({
  filter,
  codingSystem,
  onlyActiveCodes = true,
}: {
  filter: string,
  codingSystem: CodingSystemKey,
  onlyActiveCodes?: boolean,
}): Promise<Response> => {
  const codingSystemKey = normalizeCodingSystemKey(codingSystem);

  const { data } = await axios.post(`/ui/medical/issues/search`, {
    coding_system: codingSystemKey,
    filter,
    /*
     * default true, pass false in read-only flow like export to
     * also get the retired codes listing in the dropdown
     */
    only_active: onlyActiveCodes,
  });

  return data;
};

export default searchCoding;
