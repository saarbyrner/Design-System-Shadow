// @flow
import $ from 'jquery';

export type Squad = {
  id: number | string,
  name: string,
  owner_id: number,
  created_at: string,
  updated_at: ?string,
};
export type Squads = Array<Squad>;

const getSquads = (): Promise<Squads> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/squads',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getSquads;
