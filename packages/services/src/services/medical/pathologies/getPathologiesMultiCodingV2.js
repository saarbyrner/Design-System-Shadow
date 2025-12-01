// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import { normalizeCodingSystemKey } from '../getCodingSystemSides';

export const url = '/emr/pathologies/search';

/**
 * Searches for medical pathologies using a search expression and an optional coding system name via the `/emr/pathologies/search` endpoint.
 * Note: The search expression must be at least 3 characters long.
 *
 * @param {{searchExpression: string, codingSystemName?: string}} params - The parameters for the search.
 * @param {string} params.searchExpression - The string to search for. Must be at least 3 characters long.
 * @param {string} [params.codingSystemName] - The optional coding system name to filter the search.
 * @returns {Promise<Array<MultiCodingV2Pathology>>} A promise that resolves with an array of matching pathologies.
 */
const getPathologiesMultiCodingV2 = async ({
  searchExpression,
  codingSystemName,
}: {
  searchExpression: string,
  codingSystemName?: CodingSystemKey,
}): Promise<Array<MultiCodingV2Pathology>> => {
  const searchParams = new URLSearchParams();
  if (codingSystemName) {
    searchParams.append(
      'coding_system',
      normalizeCodingSystemKey(codingSystemName)
    );
  }

  const searchExpressionTrimmed = searchExpression.trim();
  if (
    !searchExpression ||
    searchExpressionTrimmed === '' ||
    searchExpressionTrimmed.length < 3
  ) {
    return Promise.reject(
      new Error('Search expression is empty or not long enough')
    );
  }

  searchParams.append('search_expression', searchExpression);

  const { data } = await axios.get(`${url}?${searchParams.toString()}`);

  return data;
};

export default getPathologiesMultiCodingV2;
