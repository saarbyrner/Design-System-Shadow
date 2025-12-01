// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Select, InputNumeric } from '@kitman/components';
import { getEventConditions } from '@kitman/services';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  EventFormConditions,
  EventConditionsValidity,
  OnUpdateEventDetails,
} from '../../types';

export type Props = {
  event: EventFormConditions,
  eventValidity: EventConditionsValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

const EventConditionFields = (props: I18nProps<Props>) => {
  const { onDataLoadingStatusChanged } = props;
  const [eventConditionsData, setEventConditionsData] =
    useState<?EventConditions>(null);

  useEffect(() => {
    let mounted = true;
    getEventConditions().then(
      (data: EventConditions) => {
        if (mounted) {
          onDataLoadingStatusChanged('SUCCESS', 'eventConditions', null);
          setEventConditionsData(data);
        }
      },
      () => {
        if (mounted) {
          onDataLoadingStatusChanged('FAILURE', 'eventConditions', null);
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [onDataLoadingStatusChanged]);

  return (
    <>
      <Select
        label={props.t('Surface Type')}
        required={window.getFlag('surface-type-mandatory-sessions')}
        options={
          eventConditionsData
            ? // $FlowIgnore[prop-missing] surface_types is an array
              eventConditionsData.surface_types?.map(({ id, name }) => ({
                label: name,
                value: id,
              }))
            : []
        }
        onChange={(value) => {
          props.onUpdateEventDetails({
            surface_type: value,
          });
        }}
        value={props.event.surface_type}
        isClearable
        onClear={() => {
          props.onUpdateEventDetails({
            surface_type: null,
          });
        }}
        data-testid="EventConditionFields|SurfaceType"
        invalid={props.eventValidity.surface_type?.isInvalid}
        menuPlacement="top"
      />

      <Select
        label={props.t('Surface Quality')}
        options={
          eventConditionsData
            ? // $FlowIgnore[prop-missing] surface_qualities is an array
              eventConditionsData.surface_qualities?.map(({ id, title }) => ({
                label: title,
                value: id,
              }))
            : []
        }
        onChange={(value) =>
          props.onUpdateEventDetails({
            surface_quality: value,
          })
        }
        value={props.event.surface_quality}
        isClearable
        onClear={() => {
          props.onUpdateEventDetails({
            surface_quality: null,
          });
        }}
        data-testid="EventConditionFields|SurfaceQuality"
        invalid={props.eventValidity.surface_quality?.isInvalid}
        menuPlacement="top"
      />

      <Select
        label={props.t('Weather')}
        options={
          eventConditionsData
            ? // $FlowIgnore[prop-missing] weather_conditions is an array
              eventConditionsData.weather_conditions?.map(({ id, title }) => ({
                label: title,
                value: id,
              }))
            : []
        }
        onChange={(value) =>
          props.onUpdateEventDetails({
            weather: value,
          })
        }
        value={props.event.weather}
        isClearable
        onClear={() => {
          props.onUpdateEventDetails({
            weather: null,
          });
        }}
        data-testid="EventConditionFields|Weather"
        invalid={props.eventValidity.weather?.isInvalid}
        menuPlacement="top"
      />

      <InputNumeric
        label={props.t('Temperature')}
        name="temperature"
        value={props.event.temperature ?? undefined}
        onChange={(value) => {
          props.onUpdateEventDetails({
            temperature: value,
            temperature_units: eventConditionsData?.temperature_units,
          });
        }}
        inputMode="decimal"
        descriptor={`°${eventConditionsData?.temperature_units || ''}`}
        kitmanDesignSystem
        data-testid="EventConditionFields|Temperature"
        isInvalid={props.eventValidity.temperature?.isInvalid}
      />
    </>
  );
};

export const EventConditionFieldsTranslated: ComponentType<Props> =
  withNamespaces()(EventConditionFields);
export default EventConditionFields;
