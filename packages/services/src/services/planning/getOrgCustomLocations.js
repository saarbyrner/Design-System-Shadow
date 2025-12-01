// @flow
import $ from 'jquery';

export type Location = {
  id: number,
  name: string,
  default_surface_type_id: ?number,
};
export type Locations = Array<Location>;

const getOrgCustomLocations = (): Promise<Locations> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/nfl_locations',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOrgCustomLocations;
