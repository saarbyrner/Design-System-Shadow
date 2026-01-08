// @flow
import type { ComponentType } from 'react';

import { AsyncSelect, TextTag } from '@kitman/components';
import getEventLocations, {
  type EventLocationFull,
} from '@kitman/services/src/services/planning/getEventLocations';
import type { SelectOption } from '@kitman/components/src/AsyncSelect';
import { useFilter, type SetFilter } from '../utils/hooks';
import styles from './utils/styles';
import type { LocationName } from '../redux/types';

type Props = { placeholder: string };

const LocationNames: ComponentType<Props> = ({ placeholder }: Props) => {
  const {
    filter: locationNamesFilter,
    setFilter: setLocationNameFilter,
  }: { filter: Array<LocationName>, setFilter: SetFilter } =
    // $FlowIgnore(incompatible-type) Flow is somehow taking into consideration types used by VenueTypes
    useFilter('locationNames');

  const loadOptions = (
    searchValue: string,
    callback: (options: Array<SelectOption>) => void
  ) => {
    getEventLocations({ searchValue }).then(
      (data: Array<EventLocationFull>) => {
        callback(
          data.map((location) => {
            return {
              value: location.id,
              label: location.name,
            };
          })
        );
      }
    );
  };

  return (
    <>
      <AsyncSelect
        label=""
        loadOptions={loadOptions}
        // $FlowIgnore(incompatible-type) value is any in the component and the location value is number
        value={locationNamesFilter}
        onChange={(options: Array<SelectOption>) => {
          // $FlowIgnore(incompatible-call) undefined values are filtered
          setLocationNameFilter(options.filter((option) => !!option));
        }}
        isMulti
        placeholder={placeholder}
      />
      <ul css={styles.tagsContainer}>
        {locationNamesFilter.map(({ value, label }) => {
          return (
            <li key={value} css={styles.tag}>
              <TextTag
                content={label}
                closeable
                onClose={() => {
                  setLocationNameFilter(
                    locationNamesFilter.filter(
                      (locationName) => locationName.value !== value
                    )
                  );
                }}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default LocationNames;
