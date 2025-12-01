// @flow
import $ from 'jquery';

type OrderProvider = {
  id: number,
  sgid: number,
  fullname: string,
};
export type OrderProviderType = {
  staff_providers: Array<OrderProvider>,
  location_providers: Array<OrderProvider>,
};
export type StaffUserTypes = Array<OrderProviderType>;

type argsForProvider = {
  locationId?: string,
  activeUsersOnly?: boolean,
  npi?: boolean,
  onlyDefaultLocation?: boolean,
};
const getOrderProviders = (
  args: argsForProvider
): Promise<OrderProviderType> => {
  return new Promise((resolve, reject) => {
    const { locationId, activeUsersOnly, npi, onlyDefaultLocation } = args;

    $.ajax({
      method: 'GET',
      url: '/medical/location_providers',
      data: {
        ...(locationId && { location_id: locationId }),
        // $FlowFixMe known 'bug' Flow Issue that they don't intend to fix soon https://github.com/facebook/flow/issues/8186
        ...(activeUsersOnly && { is_active: true }),
        ...(npi && { npi: true }),
        ...(onlyDefaultLocation && {
          only_default_locations: onlyDefaultLocation,
        }),
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOrderProviders;
