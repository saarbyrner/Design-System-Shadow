// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type Squad = {
  id: number,
  name: string,
};

type Squads = Array<Squad>;

const getPermittedSquads = (): Promise<Squads> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/squads/permitted',
  });

export default getPermittedSquads;
