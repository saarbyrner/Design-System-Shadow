// @flow
import { useEffect, useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import type { TemperatureUnits } from '@kitman/services/src/services/getEventConditions';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import getEventLocationsSurface from '@kitman/services/src/services/planning/getEventLocationsSurface';
import {
  InputNumeric,
  Select,
  withSelectServiceSuppliedOptions,
} from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import {
  getEventConditions,
  getOrgCustomEquipmentTypes,
  getOrgCustomLocations,
  getOrgCustomSurfaceTypes,
  getFieldConditions,
  getSurfaceCompositionsByFieldType,
  getActivityLocations,
} from '@kitman/services';
import type { ActivityLocation } from '@kitman/services/src/services/planning/getActivityLocations';
import _groupBy from 'lodash/groupBy';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import getSeasonTypes from '../../services/getSeasonTypes';
import type {
  EventGameFormData,
  EventSessionFormData,
  EventFormValidity,
  SeasonType,
  OnUpdateEventDetails,
} from '../../types';
import { activeOrganisationSort, noActiveOrganisationSort } from './utils';

export type Props = {
  event: EventGameFormData | EventSessionFormData,
  eventValidity: EventFormValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
  isOpen?: boolean,
};

const OrgCustomFields = (props: I18nProps<Props>) => {
  const [temperatureUnits, setTemperatureUnits] =
    useState<TemperatureUnits>('C');

  const mapToOptions = (serviceData: Array<SeasonType>): Array<Option> => {
    const isCurrentSeasonTypeArchived =
      props.event.type === 'session_event' &&
      props.event.season_type &&
      props.event.season_type?.is_archived;

    return serviceData
      .filter((option) => {
        return isCurrentSeasonTypeArchived
          ? option.is_archived !== true ||
              option.id === props.event.season_type_id
          : option.is_archived !== true;
      })
      .map((seasonTypeOption) => ({
        label: seasonTypeOption.name,
        value: seasonTypeOption.id,
        is_archived: seasonTypeOption.is_archived,
      }));
  };

  const mapLocationFeedOptions = (
    serviceData: Array<ActivityLocation>
  ): Array<Option> => {
    const activeLocations = serviceData.filter((option) => {
      if (option.is_active === true) {
        return true;
      }
      if (option.id === props.event.nfl_location_feed_id) {
        return true;
      }

      return false;
    });

    const orgLocations = _groupBy(activeLocations, (item) => {
      return item.organisation_name || props.t('Other');
    });

    const activeOrg = activeLocations.find((org) => {
      return org.is_owned_by_org === true;
    });

    return Object.keys(orgLocations)
      .sort((a, b) => {
        if (activeOrg) {
          return activeOrganisationSort(
            a,
            b,
            [activeOrg.organisation_name, props.t('Other')],
            activeOrg.organisation_name
          );
        }
        return noActiveOrganisationSort(a, b, [props.t('Other')]);
      })
      .map((orgLocationKey) => {
        return {
          label: orgLocationKey,
          options: orgLocations[orgLocationKey]?.map((location) => {
            return {
              value: location.id,
              label: location.name,
            };
          }),
        };
      });
  };

  const mapSurfaceCompOptions = (serviceData) => {
    return serviceData?.map((data) => {
      return {
        label: data.name,
        options: data.surface_types?.map((surfaceType) => {
          return {
            value: surfaceType.id,
            label: surfaceType.name,
          };
        }),
      };
    });
  };

  const LocationSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getOrgCustomLocations, {
        dataId: 'nfl_location_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  const LocationFeedSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getActivityLocations, {
        dataId: 'nfl_location_feed_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
        mapToOptions: mapLocationFeedOptions,
      }),
    [props.isOpen]
  );

  const SeasonTypeSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getSeasonTypes, {
        dataId: 'season_type_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
        ...(window.getFlag('planning-custom-org-event-details') && {
          mapToOptions,
        }),
      }),
    [props.isOpen]
  );

  const SurfaceSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getOrgCustomSurfaceTypes, {
        dataId: 'nfl_surface_type_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  const EquipmentSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getOrgCustomEquipmentTypes, {
        dataId: 'nfl_equipment_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  const FieldConditionSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getFieldConditions, {
        dataId: 'field_condition',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  const SurfaceCompSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(
        Select,
        getSurfaceCompositionsByFieldType,
        {
          dataId: 'nfl_surface_composition_id',
          onStatusChangedCallback: props.onDataLoadingStatusChanged,
          mapToOptions: mapSurfaceCompOptions,
        }
      ),
    []
  );

  useEffect(() => {
    getEventConditions().then((response) =>
      setTemperatureUnits(response.temperature_units)
    );
  }, []);

  const renderLocationField = () => {
    return window.featureFlags['nfl-location-feed'] ? (
      <div css={style.singleColumn}>
        <LocationFeedSelect
          label={props.t('Location')}
          onChange={async (nflFeedLocation) => {
            // auto-filling the surface type based on selected location
            const eventLocationSurface = await getEventLocationsSurface(
              nflFeedLocation.value,
              props.event.start_time
            );

            props.onUpdateEventDetails({
              nfl_location_feed_id: nflFeedLocation.value,
              nfl_location_feed: nflFeedLocation,
              nfl_surface_composition: eventLocationSurface
                ? {
                    label: eventLocationSurface.name,
                    value: eventLocationSurface.id,
                  }
                : null,
              nfl_surface_composition_id: eventLocationSurface?.id ?? null,
            });
          }}
          value={props.event.nfl_location_feed_id}
          invalid={props.eventValidity.nfl_location_feed_id?.isInvalid}
          menuPlacement="top"
          returnObject
        />
      </div>
    ) : (
      <LocationSelect
        label={props.t('Location')}
        onChange={() => {}}
        onChangeFullOptionObject={(option) => {
          let surfaceType;

          if (option.default_surface_type_id != null) {
            surfaceType =
              typeof option.default_surface_type_id === 'string'
                ? Number.parseInt(option.default_surface_type_id, 10)
                : option.default_surface_type_id;
          }

          props.onUpdateEventDetails({
            nfl_location_id: option.value,
            nfl_surface_type_id: surfaceType,
          });
        }}
        value={props.event.nfl_location_id}
        invalid={props.eventValidity.nfl_location_id?.isInvalid}
        data-testid="OrgCustomFields|CustomLocation"
        menuPlacement="top"
      />
    );
  };

  return (
    <>
      {window.getFlag('nfl-hide-surface-type') && renderLocationField()}
      {props.event.type === 'session_event' && (
        <SeasonTypeSelect
          label={props.t('Season type')}
          onChange={(seasonType) => {
            props.onUpdateEventDetails({
              season_type_id: seasonType.value,
              season_type: seasonType,
            });
          }}
          value={props.event.season_type_id}
          invalid={props.eventValidity.season_type_id?.isInvalid}
          data-testid="OrgCustomFields|SeasonType"
          menuPlacement="top"
          returnObject
        />
      )}
      {window.getFlag('nfl-hide-surface-type') && (
        // this feature flag displays hides the original 'Session Type' and displays 'Field Type - Surface Composition' as 'Session Type'
        <>
          {props.event.type === 'session_event' && (
            <SurfaceCompSelect
              label={props.t('Surface type')}
              onChange={(surfaceComp) => {
                props.onUpdateEventDetails({
                  nfl_surface_composition_id: surfaceComp.value,
                  nfl_surface_composition: surfaceComp,
                });
              }}
              value={props.event.nfl_surface_composition_id}
              invalid={
                props.eventValidity.nfl_surface_composition_id?.isInvalid
              }
              menuPlacement="top"
              returnObject
            />
          )}
        </>
      )}
      {!window.getFlag('nfl-hide-surface-type') && (
        <SurfaceSelect
          label={props.t('Surface type')}
          onChange={(value) => {
            props.onUpdateEventDetails({ nfl_surface_type_id: value });
          }}
          value={props.event.nfl_surface_type_id}
          invalid={props.eventValidity.nfl_surface_type_id?.isInvalid}
          data-testid="OrgCustomFields|CustomSurface"
          menuPlacement="top"
        />
      )}
      <EquipmentSelect
        label={props.t('Equipment')}
        onChange={(value) => {
          props.onUpdateEventDetails({ nfl_equipment_id: value });
        }}
        value={props.event.nfl_equipment_id}
        invalid={props.eventValidity.nfl_equipment_id?.isInvalid}
        data-testid="OrgCustomFields|CustomEquipment"
        menuPlacement="top"
      />
      {!window.getFlag('nfl-hide-surface-type') && (
        <>
          {props.event.type === 'session_event' && (
            <SurfaceCompSelect
              label={props.t('Field Type - Surface Composition')}
              onChange={(surfaceComp) => {
                props.onUpdateEventDetails({
                  nfl_surface_composition_id: surfaceComp.value,
                  nfl_surface_composition: surfaceComp,
                });
              }}
              value={props.event.nfl_surface_composition_id}
              invalid={
                props.eventValidity.nfl_surface_composition_id?.isInvalid
              }
              menuPlacement="top"
              returnObject
            />
          )}
        </>
      )}
      <FieldConditionSelect
        label={props.t('Field Condition')}
        onChange={(value) => {
          props.onUpdateEventDetails({ field_condition: value });
        }}
        value={props.event.field_condition}
        invalid={props.eventValidity.field_condition?.isInvalid}
        data-testid="OrgCustomFields|CustomFieldCondition"
        menuPlacement="top"
      />
      <InputNumeric
        label={props.t('Temperature')}
        value={props.event.temperature ?? undefined}
        onChange={(value) => {
          props.onUpdateEventDetails({
            temperature: value,
          });
        }}
        inputMode="decimal"
        descriptor={`°${temperatureUnits || ''}`}
        kitmanDesignSystem
        data-testid="OrgCustomFields|CustomTemperature"
        isInvalid={props.eventValidity.temperature?.isInvalid}
      />
      <InputNumeric
        label={props.t('Humidity')}
        value={props.event.humidity ?? undefined}
        inputMode="decimal"
        descriptor="%"
        onChange={(value) => {
          props.onUpdateEventDetails({ humidity: value });
        }}
        kitmanDesignSystem
        data-testid="OrgCustomFields|CustomHumidity"
        isInvalid={props.eventValidity.humidity?.isInvalid}
      />
      {!window.getFlag('nfl-hide-surface-type') && renderLocationField()}
    </>
  );
};

export const OrgCustomFieldsTranslated: ComponentType<Props> =
  withNamespaces()(OrgCustomFields);
export default OrgCustomFields;
