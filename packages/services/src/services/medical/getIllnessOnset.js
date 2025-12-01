// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type IllnessOnset = {
  id: number,
  name: string,
  require_additional_input: boolean,
};
export type IllnessOnsets = Array<IllnessOnset>;

const getIllnessOnset = (): Promise<IllnessOnsets> =>
  ajaxPromise({
    url: '/ui/medical/illnesses/onsets',
    contentType: 'application/json',
    method: 'GET',
  });

export default getIllnessOnset;
