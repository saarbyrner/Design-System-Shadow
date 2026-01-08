// @flow

import { CheckboxList } from '@kitman/components';
import type { ItemValue } from '@kitman/components/src/CheckboxList';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { checkboxLiStyleOverride } from '../utils/styles';
import { useGetVenueTypesQuery } from '../redux/services/filters';
import { useFilter, type SetFilter } from '../utils/hooks';

const VenueTypes = () => {
  const {
    filter: venueTypesFilter,
    setFilter: setVenueTypesFilter,
  }: { filter: Array<ItemValue>, setFilter: SetFilter } =
    // $FlowIgnore(incompatible-type) Flow is somehow taking into consideration types used by LocationNames
    useFilter('venueTypes');

  const { data: venueTypes = [] } = useGetVenueTypesQuery();

  return (
    <CheckboxList
      items={defaultMapToOptions(venueTypes)}
      values={venueTypesFilter}
      kitmanDesignSystem
      onChange={setVenueTypesFilter}
      liStyleOverride={checkboxLiStyleOverride}
    />
  );
};

export default VenueTypes;
