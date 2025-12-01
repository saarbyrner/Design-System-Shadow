// @flow
import $ from 'jquery';

export type Equipment = {
  id: number,
  name: string,
};
export type EquipmentTypes = Array<Equipment>;

const getOrgCustomEquipment = (): Promise<EquipmentTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/nfl_equipment',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOrgCustomEquipment;
