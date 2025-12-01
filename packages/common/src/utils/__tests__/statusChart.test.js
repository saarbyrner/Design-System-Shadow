import {
  formatYAxisLabel,
  isValueBoolean,
  isValueScale,
  isValueSleepDuration,
  aggregationMethodForHighcharts,
  getYAxisMin,
  getYAxisMax,
} from '../statusChart';

describe('Sparkline Component', () => {
  describe('isValueBoolean()', () => {
    it('returns true if the status is boolean and the summary not count', () => {
      const status = {
        type: 'boolean',
        summary: 'last',
      };

      const isBoolean = isValueBoolean(status);
      expect(isBoolean).toEqual(true);
    });

    it('returns false if the status is not boolean', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'last',
      };

      const isBoolean = isValueBoolean(status);
      expect(isBoolean).toEqual(false);
    });

    it('returns false if the status is boolean but the summary is count', () => {
      const status = {
        type: 'boolean',
        summary: 'count',
      };

      const isBoolean = isValueBoolean(status);
      expect(isBoolean).toEqual(false);
    });
  });

  describe('isValueScale()', () => {
    it('returns true if the status is scale and the summary not count', () => {
      const status = {
        type: 'scale',
        summary: 'last',
      };

      const isScale = isValueScale(status);
      expect(isScale).toEqual(true);
    });

    it('returns false if the status is not scale', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'last',
      };

      const isScale = isValueScale(status);
      expect(isScale).toEqual(false);
    });

    it('returns false if the status is scale but the summary is count', () => {
      const status = {
        type: 'scale',
        summary: 'count',
      };

      const isScale = isValueScale(status);
      expect(isScale).toEqual(false);
    });

    it('returns true if summary is one of [min, max, last, mean]', () => {
      const summaries = ['last', 'min', 'max', 'mean'];
      for (let i = 0; i < summaries.length; i++) {
        const status = {
          type: 'scale',
          summary: summaries[i],
        };
        const isScale = isValueScale(status);
        expect(isScale).toEqual(true);
      }
    });

    it('returns false if summary is not one of [min, max, last, mean]', () => {
      const summaries = ['z_score_rolling', 'ewma_ac', 'std_dev'];
      for (let i = 0; i < summaries.length; i++) {
        const status = {
          type: 'scale',
          summary: summaries[i],
        };
        const isScale = isValueScale(status);
        expect(isScale).toEqual(false);
      }
    });
  });

  describe('isValueSleepDuration()', () => {
    it('returns true if the status is sleep_duration and the summary not count/z_score/z_score_rolling', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'last',
      };

      const isSleepDuration = isValueSleepDuration(status);
      expect(isSleepDuration).toEqual(true);
    });

    it('returns false if the status is not sleep_duration', () => {
      const status = {
        type: 'boolean',
        summary: 'last',
      };

      const isSleepDuration = isValueSleepDuration(status);
      expect(isSleepDuration).toEqual(false);
    });

    it('returns false if the status is sleep_duration but the summary is count', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'count',
      };

      const isSleepDuration = isValueSleepDuration(status);
      expect(isSleepDuration).toEqual(false);
    });

    it('returns false if the status is sleep_duration but the summary is z_score_rolling', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'z_score_rolling',
      };

      const isSleepDuration = isValueSleepDuration(status);
      expect(isSleepDuration).toEqual(false);
    });
  });

  describe('formatYAxisLabel()', () => {
    it('returns the rounded value if the status type is not boolean or sleep duration', () => {
      const status = {
        type: null,
        summary: 'last',
      };

      const labelOne = formatYAxisLabel(1, status);
      expect(labelOne).toEqual(1);

      const labelZero = formatYAxisLabel(0, status);
      expect(labelZero).toEqual(0);

      const labelDecimal = formatYAxisLabel(0.4567, status);
      expect(labelDecimal).toEqual(0.46);

      const labelString = formatYAxisLabel('string', status);
      expect(labelString).toEqual('string');
    });

    it('returns the value if the status type is boolean and the status summary is count', () => {
      const status = {
        type: 'boolean',
        summary: 'count',
      };

      const labelOne = formatYAxisLabel(1, status);
      expect(labelOne).toEqual(1);

      const labelZero = formatYAxisLabel(0, status);
      expect(labelZero).toEqual(0);

      const labelString = formatYAxisLabel('string', status);
      expect(labelString).toEqual('string');
    });

    it('returns Yes or No if the status type is boolean and the status summary is not count', () => {
      const status = {
        type: 'boolean',
        summary: 'last',
      };

      const labelOne = formatYAxisLabel(1, status);
      expect(labelOne).toEqual('Yes');

      const labelZero = formatYAxisLabel(0, status);
      expect(labelZero).toEqual('No');

      const labelString = formatYAxisLabel('string', status);
      expect(labelString).toEqual(null);
    });

    it('formats the value if the status type is sleep_duration and the status summary is not count or z-score', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'last',
      };

      const label = formatYAxisLabel(100, status);

      expect(label).toEqual('1h 40m');
    });

    it("doesn't format the value if the status type is sleep_duration and the status summary is count", () => {
      const status = {
        type: 'sleep_duration',
        summary: 'count',
      };

      const label = formatYAxisLabel(100, status);

      expect(label).toEqual(100);
    });

    it("doesn't format the value if the status type is sleep_duration and the status summary is z_score", () => {
      const status = {
        type: 'sleep_duration',
        summary: 'z_score',
      };

      const label = formatYAxisLabel(100, status);

      expect(label).toEqual(100);
    });

    it("doesn't format the value if the status type is sleep_duration and the status summary is z_score_rolling", () => {
      const status = {
        type: 'sleep_duration',
        summary: 'z_score_rolling',
      };

      const label = formatYAxisLabel(100, status);

      expect(label).toEqual(100);
    });
  });

  describe('aggregationMethodForHighcharts()', () => {
    it('maps profiler daiy aggregation function names to high charts approximation function names', () => {
      expect(aggregationMethodForHighcharts('max')).toEqual('high');
      expect(aggregationMethodForHighcharts('min')).toEqual('low');
      expect(aggregationMethodForHighcharts('first')).toEqual('open');
      expect(aggregationMethodForHighcharts('last')).toEqual('close');
      expect(aggregationMethodForHighcharts('sum')).toEqual('sum');
      expect(aggregationMethodForHighcharts('mean')).toEqual('average');
      expect(aggregationMethodForHighcharts('unknown')).toEqual(null);
    });
  });

  describe('getYAxisMin()', () => {
    it('returns 0 if the status is a boolean', () => {
      const status = {
        type: 'boolean',
        summary: 'last',
      };

      expect(getYAxisMin(status)).toEqual(0);
    });

    it('returns status.variable_min - 1 if the status is a scale', () => {
      const status = {
        type: 'scale',
        summary: 'last',
        variable_min: 5,
      };

      expect(getYAxisMin(status)).toEqual(4);
    });

    it('returns null if the status is not scale and not a boolean', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'last',
      };

      expect(getYAxisMin(status)).toEqual(null);
    });
  });

  describe('getYAxisMax()', () => {
    it('returns 1 if the status is a boolean', () => {
      const status = {
        type: 'boolean',
        summary: 'last',
      };

      expect(getYAxisMax(status)).toEqual(1);
    });

    it('returns status.max if the status is a scale', () => {
      const status = {
        type: 'scale',
        summary: 'last',
        variable_max: 10,
      };

      expect(getYAxisMax(status)).toEqual(10);
    });

    it('returns null if the status is not scale and not a boolean', () => {
      const status = {
        type: 'sleep_duration',
        summary: 'last',
      };

      expect(getYAxisMax(status)).toEqual(null);
    });
  });
});
