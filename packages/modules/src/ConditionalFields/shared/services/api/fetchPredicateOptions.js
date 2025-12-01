// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { PredicateOptions } from '../../types';

const fetchPredicateOptions = async (id: number): Promise<PredicateOptions> => {
  const { data } = await axios.get(
    `/conditional_fields/predicate_options?owner_type=Organisation&owner_id=${id}`,
    {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  return data;
};

export default fetchPredicateOptions;
