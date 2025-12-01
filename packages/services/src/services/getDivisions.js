// @flow
import { axios } from '@kitman/common/src/utils/services';

type Params = {
  childDivisionsOnly?: boolean,
};

const getDivisions = async (params: Params): Promise<any> => {
  try {
    const { data } = await axios.post(
      '/ui/associations/divisions',
      {},
      {
        params: {
          child_divisions_only: params?.childDivisionsOnly ?? false,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default getDivisions;
