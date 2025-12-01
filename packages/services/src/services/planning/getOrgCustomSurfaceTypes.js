// @flow
import $ from 'jquery';

export type Surface = {
  id: number,
  name: string,
};
export type SurfaceTypes = Array<Surface>;

const getOrgCustomSurfaceTypes = (): Promise<SurfaceTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/nfl_surfaces',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOrgCustomSurfaceTypes;
