// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type Side = {
  id: number,
  name: string,
  active: ?boolean,
};
export type Sides = Array<Side>;

const getSides = (): Promise<Sides> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/sides',
  });

export default getSides;
