// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import { normalizeCodingSystemKey } from '../getCodingSystemSides';

export const url = '/emr/pathologies/list';

export type getPathologiesByIdsParams = {
  codingSystem?: CodingSystemKey,
  ids?: Array<number>,
  excludeCustom?: boolean,
  includeAttributes?: boolean,
};

type RequestBody = {
  coding_system?: string,
  ids?: Array<number>,
  exclude_custom?: boolean,
  include_attributes?: boolean,
};

const getPathologiesByIds = async (
  params: getPathologiesByIdsParams = {}
): Promise<Array<MultiCodingV2Pathology>> => {
  const { codingSystem, ids, excludeCustom, includeAttributes } = params;

  const body: RequestBody = {};

  if (codingSystem) {
    body.coding_system = normalizeCodingSystemKey(codingSystem);
  }

  if (ids && ids.length > 0) {
    body.ids = ids;
  }

  if (typeof excludeCustom === 'boolean') {
    body.exclude_custom = excludeCustom;
  }

  if (typeof includeAttributes === 'boolean') {
    body.include_attributes = includeAttributes;
  }

  const { data } = await axios.get(url, {
    params: Object.keys(body).length > 0 ? body : undefined,
  });

  return data;
};

export default getPathologiesByIds;
