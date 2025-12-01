// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { FormType } from '@kitman/services/src/services/humanInput/api/types';
import type { FormAnswersSetsFilterBasic } from '@kitman/modules/src/Medical/shared/types/medical';

export const generateFetchFormTypesUrl = (
  filter: FormAnswersSetsFilterBasic
) => {
  const urlParams = new URLSearchParams();

  urlParams.append('category', filter.category || 'medical,general');

  if (filter.group) {
    urlParams.append('group', filter.group);
  }

  if (filter.formType) {
    urlParams.append('form_type', filter.formType);
  }

  if (filter.key) {
    urlParams.append('key', filter.key);
  }

  return `/ui/forms?${urlParams.toString()}`;
};

const fetchFormTypes = async (
  filter: FormAnswersSetsFilterBasic
): Promise<Array<FormType>> => {
  const url = generateFetchFormTypesUrl(filter);
  const { data } = await axios.get(url);

  return data;
};

export default fetchFormTypes;
