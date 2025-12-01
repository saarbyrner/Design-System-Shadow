/* eslint-disable flowtype/require-valid-file-annotation */
export const isValueBoolean = (status) =>
  // If the summary is count, the value type is number.
  status.type === 'boolean' && status.summary !== 'count';

export const isValueScale = (status) =>
  // If the summary is count, the value type is number.
  status.type === 'scale' &&
  ['last', 'mean', 'min', 'max'].includes(status.summary) &&
  status.summary !== 'count';

export const isValueSleepDuration = (status) =>
  // If the summary is count, z_score or z_score_rolling, the value type is number.
  status.type === 'sleep_duration' &&
  status.summary !== 'count' &&
  status.summary !== 'z_score' &&
  status.summary !== 'z_score_rolling';

// For booleans, we need to set the min / max values ourselves
// Otherwise, we keep Highchart default behavior
// We can't set a fix Min and Max value as they
// change depending on the data aggregation.
export const getYAxisMin = (status) => {
  if (isValueBoolean(status)) {
    return 0;
  }
  if (isValueScale(status) && status.variable_min) {
    return status.variable_min - 1;
  }
  return null;
};

export const getYAxisMax = (status) => {
  if (isValueBoolean(status)) {
    return 1;
  }
  if (isValueScale(status) && status.variable_max) {
    return status.variable_max;
  }
  return null;
};

export const formatYAxisLabel = (value, status) => {
  if (isValueSleepDuration(status)) {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    return `${hours}h ${minutes}m`;
  }

  if (isValueBoolean(status)) {
    switch (value) {
      case 0:
        return 'No';
      case 1:
        return 'Yes';
      default:
        return null;
    }
  }

  if (typeof value !== 'number') {
    return value;
  }

  return Math.round(value * 100) / 100;
};

/* eslint-disable no-console */
export const aggregationMethodForHighcharts = (aggMethod) => {
  // Maps aggregation method names from profiler into what Hightcharts expects
  const map = {
    last: 'close',
    first: 'open',
    mean: 'average',
    sum: 'sum',
    min: 'low',
    max: 'high',
  };

  if (map[aggMethod]) {
    return map[aggMethod];
  }

  console.error(`Unknown aggregation method: ${aggMethod}`);
  return null;
};
