// @flow
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

import { withNamespaces } from 'react-i18next';
import { Select, InputNumeric } from '@kitman/components';
import { getEventConditions } from '@kitman/services';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import type { GameFieldEvent } from '@kitman/modules/src/PlanningEventSidePanel/src/components/gameLayoutV2/GameFieldsV2';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EventGameFormValidity, OnUpdateEventDetails } from '../../types';

export type Props = {
  event: GameFieldEvent,
  eventValidity: EventGameFormValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

const EventConditionFieldsV2 = (props: I18nProps<Props>) => {
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
        onClear={() => {
          props.onUpdateEventDetails({
            surface_type: null,
          });
        }}
        data-testid="EventConditionFields|SurfaceType"
        invalid={props.eventValidity.surface_type?.isInvalid}
        menuPlacement="bottom"
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
        onClear={() => {
          props.onUpdateEventDetails({
            surface_quality: null,
          });
        }}
        data-testid="EventConditionFields|SurfaceQuality"
        invalid={props.eventValidity.surface_quality?.isInvalid}
        menuPlacement="bottom"
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
        onClear={() => {
          props.onUpdateEventDetails({
            weather: null,
          });
        }}
        data-testid="EventConditionFields|Weather"
        invalid={props.eventValidity.weather?.isInvalid}
        menuPlacement="bottom"
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

export const EventConditionFieldsV2Translated: ComponentType<Props> =
  withNamespaces()(EventConditionFieldsV2);
export default EventConditionFieldsV2;
