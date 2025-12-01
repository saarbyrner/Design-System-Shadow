// @flow
import { axios } from '@kitman/common/src/utils/services';

export type TrainingVariable = {
  description: string,
  id: number,
  invert_scale: boolean,
  max: number,
  min: number,
  name: string,
  perma_id: string,
  variable_type_id: number,
};

type Response = {
  training_variables: Array<TrainingVariable>,
};

const getTrainingVariables = async (
  { platformId }: { platformId: ?number } = { platformId: null }
): Promise<Response> => {
  const { data } = await axios.post('/training_variables/search', {
    platform_id: platformId,
  });
  return data;
};

export default getTrainingVariables;
