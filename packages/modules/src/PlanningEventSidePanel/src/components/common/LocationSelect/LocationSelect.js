// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';
import { AsyncSelect } from '@kitman/components';
import { getEventLocations } from '@kitman/services/src/services/planning';
import type { Option } from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EventLocationFull } from '@kitman/services/src/services/planning/getEventLocations';
import { buildParentsLabel, getTopLevelLocations } from './utils';
import type {
  CommonAttributesValidity,
  EventFormData,
  OnUpdateEventDetails,
} from '../../../types';

export const createMapToOptions = (
  previouslyChosenLocation: EventLocationFull | void,
  shouldRenderNestedOptions: boolean,
  serviceData: Array<EventLocationFull>
): Array<Option> => {
  if (shouldRenderNestedOptions) {
    // if we are editing a value that no longer exists in the response (ex:
    // location was archived after the user selected it), add the location back
    // in so it displays in the dropdown
    const shouldAddLocation =
      previouslyChosenLocation &&
      !serviceData.find(
        (location) => location.id === previouslyChosenLocation?.id
      );
    if (shouldAddLocation && previouslyChosenLocation) {
      serviceData.push(previouslyChosenLocation);
    }

    // event locations that do not have a parent are the groupings in the Select component
    const topLevelLocations = getTopLevelLocations(serviceData);

    const returnOptions = topLevelLocations.map((topLevelLocation) => {
      // get the options that are associated with this location
      const children = serviceData.filter((eventLocation) =>
        eventLocation.parents?.find(
          (parentLocation) => parentLocation.id === topLevelLocation.id
        )
      );

      return {
        label: topLevelLocation.name,
        options: [
          { value: topLevelLocation.id, label: topLevelLocation.name },
          ...children.map((option) => ({
            value: option.id,
            label: buildParentsLabel(option),
          })),
        ],
      };
    });

    // if the current event location did not fall under an existing grouping, create it's own
    if (previouslyChosenLocation) {
      const currentTopLevelParent =
        previouslyChosenLocation.parent_event_location_id == null
          ? previouslyChosenLocation
          : getTopLevelLocations(previouslyChosenLocation?.parents)[0];

      const isCurrentTopLevelParentIncluded = topLevelLocations?.find(
        (location) => location.id === currentTopLevelParent?.id
      );

      if (!isCurrentTopLevelParentIncluded) {
        returnOptions.push({
          label: currentTopLevelParent.name,
          options: [
            {
              value: previouslyChosenLocation.id,
              label: buildParentsLabel(previouslyChosenLocation),
            },
          ],
        });
      }
    }
    return returnOptions;
  }

  return serviceData.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
};

export type Props = {
  event: EventFormData,
  eventValidity: CommonAttributesValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
  isDisabled?: boolean,
};

const LocationSelect = ({
  event,
  t,
  onUpdateEventDetails,
  isDisabled,
  eventValidity,
}: I18nProps<Props>) => {
  const { event_location: eventLocation, type } = event;
  const shouldRenderNestedOptions = !(
    type === 'game_event' && window.featureFlags['game-details']
  );

  const selectValue = eventLocation
    ? { value: eventLocation.id, label: eventLocation.name }
    : null;

  return (
    <AsyncSelect
      label={t('Location')}
      loadOptions={(searchValue, callback) => {
        getEventLocations({ eventType: type, searchValue }).then(
          (data: Array<EventLocationFull>) => {
            callback(
              createMapToOptions(eventLocation, shouldRenderNestedOptions, data)
            );
          }
        );
      }}
      value={selectValue}
      onChange={(selectedEventLocation) => {
        onUpdateEventDetails({
          event_location: selectedEventLocation
            ? {
                id: selectedEventLocation.value,
                name: selectedEventLocation.label,
              }
            : null,
        });
      }}
      placeholder={`${t('Search locations')}...`}
      optional
      isDisabled={isDisabled}
      invalid={eventValidity.event_location?.isInvalid}
      isClearable
      returnObject
      menuPlacement="bottom"
    />
  );
};

export const LocationSelectTranslated: ComponentType<Props> =
  withNamespaces()(LocationSelect);
export default LocationSelect;
