// @flow
import $ from 'jquery';

export type MedicalLocationType = {
  id: number,
  location: string,
  type_of: {
    name: string,
    value: number,
  },
};

export type MedicalLocationsType = {
  organisation_locations: Array<MedicalLocationType>,
};

export type LocationScope = 'diagnostic' | 'treatment';

const getMedicalLocations = (
  scope: LocationScope
): Promise<MedicalLocationsType> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/locations',
      data: { type_of: scope },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getMedicalLocations;
