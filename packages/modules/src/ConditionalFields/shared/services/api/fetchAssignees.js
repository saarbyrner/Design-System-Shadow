// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Assignees } from '../../types';

const fetchAssignees = async (versionId: string): Promise<Assignees> => {
  const { data } = await axios.get(
    `/conditional_fields/squad_assignments/${versionId}`,
    {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  return data;
};

export default fetchAssignees;
