// @flow
import $ from 'jquery';

export type SurfaceQuality = {
  id: number,
  title: string,
};
export type WeatherConditions = {
  id: number,
  name: string,
};
export type SurfaceTypes = {
  id: number,
  title: string,
};
export type TemperatureUnits = 'F' | 'C';

export type EventConditions = {
  surface_qualities: SurfaceQuality,
  surface_types: SurfaceTypes,
  weather_conditions: WeatherConditions,
  temperature_units: TemperatureUnits,
};

const getEventConditions = (): Promise<EventConditions> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/event_conditions',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getEventConditions;
