import uuid from 'uuid';
import {
  blankStatus,
  availableSummaries,
  dateRangeTimePeriods,
  availableTimePeriods,
  getTimePeriodName,
  getCalculationsByType,
} from '../status_utils';

const calculations = {
  last: { title: 'Last Value', id: 'last' },
  mean: { title: 'Mean', id: 'mean' },
  sum: { title: 'Sum', id: 'sum' },
  sumAbsolute: {
    id: 'sum_absolute',
    title: 'Sum (Absolute)',
  },
  min: { title: 'Min', id: 'min' },
  minAbsolute: {
    id: 'min_absolute',
    title: 'Min (Absolute)',
  },
  max: { title: 'Max', id: 'max' },
  maxAbsolute: {
    id: 'max_absolute',
    title: 'Max (Absolute)',
  },
  stddev: {
    title: 'Standard Deviation',
    id: 'standard_deviation',
  },
  zscore: { title: 'Z Score', id: 'z_score' },
  zscoreRolling: {
    title: 'Complex Z Score',
    id: 'z_score_rolling',
  },
  acutechronic: {
    title: 'Acute:Chronic',
    id: 'acute_to_chronic_ratio',
  },
  ewmaAcuteChronic: {
    title: 'Acute:Chronic (EWMA)',
    id: 'ewma_acute_to_chronic_ratio',
  },
  tsb: {
    title: 'Training Stress Balance',
    id: 'training_stress_balance',
  },
  strain: { title: 'Strain', id: 'strain' },
  monotony: { title: 'Monotony', id: 'monotony' },
  averagePercentageChange: {
    title: 'Average Percentage Change',
    id: 'average_percentage_change',
  },
  count: { title: 'Count', id: 'count' },
  countAbsolute: {
    id: 'count_absolute',
    title: 'Count (Absolute)',
  },
  trainingEfficiencyIndex: {
    title: 'Training Efficiency Index',
    id: 'training_efficiency_index',
  },
};

describe('blankStatus', () => {
  it('generates a UUID and sets it as the status_id for the new status', () => {
    jest.spyOn(uuid, 'v4').mockImplementation(() => 'uuid');
    expect(blankStatus().status_id).toEqual('uuid');
    jest.restoreAllMocks();
  });

  it('initializes variables with an empty array', () => {
    expect(blankStatus().variables).toEqual([]);
  });
});

describe('availableSummaries', () => {
  // option objects

  // available options
  const standardOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.sum,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.trainingEfficiencyIndex,
  ];
  const standardOptionsWithAbsolute = [
    calculations.last,
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.min,
    calculations.minAbsolute,
    calculations.count,
    calculations.countAbsolute,
    calculations.sum,
    calculations.sumAbsolute,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.trainingEfficiencyIndex,
  ];
  const dynamicMovementOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
  ];
  const dynamicMovementOptionsWithAbsolute = [
    calculations.last,
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.min,
    calculations.minAbsolute,
    calculations.count,
    calculations.countAbsolute,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
  ];
  const booleanOptions = [calculations.last, calculations.count];
  const booleanOptionsWithAbsolute = [
    calculations.last,
    calculations.count,
    calculations.countAbsolute,
  ];
  const sleepOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.zscore,
    calculations.zscoreRolling,
  ];
  const sleepOptionsWithAbsolute = [
    calculations.last,
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.min,
    calculations.minAbsolute,
    calculations.count,
    calculations.countAbsolute,
    calculations.zscore,
    calculations.zscoreRolling,
  ];
  const workloadOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.count,
    calculations.sum,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];
  const workloadOptionsWithAbsolute = [
    calculations.last,
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.count,
    calculations.countAbsolute,
    calculations.sum,
    calculations.sumAbsolute,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];
  const thirdPartyOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.sum,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];
  const thirdPartyOptionsWithAbsolute = [
    calculations.last,
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.min,
    calculations.minAbsolute,
    calculations.count,
    calculations.countAbsolute,
    calculations.sum,
    calculations.sumAbsolute,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];

  beforeEach(() => {
    window.setFlag('training-efficiency-index', true);
  });

  describe('source is kitman:tv', () => {
    it('is boolean summaries for boolean statuses', () => {
      const summaries = availableSummaries(
        'kitman:tv',
        'lower_back_pain',
        'boolean'
      );
      expect(summaries).toEqual(booleanOptions);

      expect(
        availableSummaries('kitman:tv', 'lower_back_pain', 'boolean', true)
      ).toEqual(booleanOptionsWithAbsolute);
    });

    it('is sleep_duration summaries for Sleep Duration statuses', () => {
      const summaries = availableSummaries(
        'kitman:tv',
        'sleep_duration',
        'sleep_duration'
      );
      expect(summaries).toEqual(sleepOptions);
      expect(
        availableSummaries(
          'kitman:tv',
          'sleep_duration',
          'sleep_duration',
          true
        )
      ).toEqual(sleepOptionsWithAbsolute);
    });

    it('is standard summaries for other types', () => {
      const summaries = availableSummaries('kitman:tv', 'mood', 'scale');
      const summariesWithAbsolute = availableSummaries(
        'kitman:tv',
        'mood',
        'scale',
        true
      );
      expect(summaries).toEqual(standardOptions);
      expect(summariesWithAbsolute).toEqual(standardOptionsWithAbsolute);
    });
  });

  describe('source is kitman', () => {
    it('has standard options for game minutes', () => {
      const summaries = availableSummaries('kitman', 'game_minutes', 'number');
      const summariesWithAbsolute = availableSummaries(
        'kitman',
        'game_minutes',
        'number',
        true
      );
      expect(summaries).toEqual(standardOptions);
      expect(summariesWithAbsolute).toEqual(standardOptionsWithAbsolute);
    });

    it('has workload options for rpe_x_duration', () => {
      const summaries = availableSummaries(
        'kitman',
        'rpe_x_duration',
        'number'
      );
      const summariesWithAbsolute = availableSummaries(
        'kitman',
        'rpe_x_duration',
        'number',
        true
      );
      expect(summaries).toEqual(workloadOptions);
      expect(summariesWithAbsolute).toEqual(workloadOptionsWithAbsolute);
    });

    it('has workload options for game_rpe', () => {
      const summaries = availableSummaries('kitman', 'game_rpe', 'number');
      const summariesWithAbsolute = availableSummaries(
        'kitman',
        'game_rpe',
        'number',
        true
      );
      expect(summaries).toEqual(workloadOptions);
      expect(summariesWithAbsolute).toEqual(workloadOptionsWithAbsolute);
    });

    it('has workload options for training_session_rpe', () => {
      const summaries = availableSummaries(
        'kitman',
        'training_session_rpe',
        'number'
      );
      const summariesWithAbsolute = availableSummaries(
        'kitman',
        'training_session_rpe',
        'number',
        true
      );
      expect(summaries).toEqual(workloadOptions);
      expect(summariesWithAbsolute).toEqual(workloadOptionsWithAbsolute);
    });

    it('has workload options for training_session_minutes', () => {
      const summaries = availableSummaries(
        'kitman',
        'training_session_minutes',
        'number'
      );
      const summariesWithAbsolute = availableSummaries(
        'kitman',
        'training_session_minutes',
        'number',
        true
      );
      expect(summaries).toEqual(workloadOptions);
      expect(summariesWithAbsolute).toEqual(workloadOptionsWithAbsolute);
    });
  });

  describe('source is third party', () => {
    it('is third party options', () => {
      const summaries = availableSummaries('catapult', 'example', 'number');
      const summariesWithAbsolute = availableSummaries(
        'catapult',
        'example',
        'number',
        true
      );
      expect(summaries).toEqual(thirdPartyOptions);
      expect(summariesWithAbsolute).toEqual(thirdPartyOptionsWithAbsolute);
    });
  });

  describe('source is kitman dynamic movement', () => {
    it('is dynamic movement options', () => {
      const summaries = availableSummaries('kitman:ohs', 'example', 'number');
      const summariesWithAbsolute = availableSummaries(
        'kitman:ohs',
        'example',
        'number',
        true
      );

      expect(summaries).toEqual(dynamicMovementOptions);
      expect(summariesWithAbsolute).toEqual(dynamicMovementOptionsWithAbsolute);
    });
  });

  describe('source is kitman:custom', () => {
    it('is third party options', () => {
      const summaries = availableSummaries(
        'kitman:custom',
        'example',
        'number'
      );
      const summariesWithAbsolute = availableSummaries(
        'kitman:custom',
        'example',
        'number',
        true
      );

      expect(summaries).toEqual(thirdPartyOptions);
      expect(summariesWithAbsolute).toEqual(thirdPartyOptionsWithAbsolute);
    });
  });

  it('does not return the trainingEfficiencyIndex calculation when feature flag is off', () => {
    window.setFlag('training-efficiency-index', false);
    const summaries = availableSummaries('kitman', 'rpe_x_duration', 'number');

    expect(
      summaries.find(
        (calculation) => calculation.id === 'training_efficiency_index'
      )
    ).toEqual(undefined);
  });
});

describe('dateRangeTimePeriods', () => {
  it('returns correct date range options', () => {
    const expected = [
      'last_x_days',
      'today',
      'yesterday',
      'this_week',
      'last_week',
      'this_season_so_far',
      'this_season',
      'this_pre_season',
      'this_in_season',
      'custom_date_range',
    ];
    const periodKeys = dateRangeTimePeriods().map((tp) => tp.id);
    expect(periodKeys).toEqual(expected);
  });
});

describe('availableTimePeriods', () => {
  it('is daily and yesterday when summary is last', () => {
    const expected = ['last_x_days', 'today', 'yesterday'];
    const periodKeys = availableTimePeriods('last').map((tp) => tp.id);
    expect(periodKeys).toEqual(expected);
  });

  it('is default time period otherwise', () => {
    const expected = [
      'last_x_days',
      'today',
      'yesterday',
      'this_week',
      'last_week',
      'this_pre_season',
      'this_in_season',
      'this_season_so_far',
      'this_season',
    ];
    const periodKeys = availableTimePeriods('sum').map((tp) => tp.id);
    expect(periodKeys).toEqual(expected);
  });
});

describe('getTimePeriodName', () => {
  it('returns the time period name matching the key', () => {
    const periodName = getTimePeriodName('this_pre_season');
    expect(periodName).toEqual('This Pre-season');
  });

  it("return null if the key doesn't exist in the time period list", () => {
    const periodName = getTimePeriodName('unexisting_time_period_key');
    expect(periodName).toEqual(null);
  });

  it('returns the right time period name when the time period is last_x_days', () => {
    const periodName = getTimePeriodName('last_x_days', {}, 300, 100);
    expect(periodName).toEqual('Last 100 - 400 days');
  });

  it('returns the right time period name when the time period is last_x_days and their is an offset', () => {
    const periodName = getTimePeriodName('last_x_days', {}, 300);
    expect(periodName).toEqual('Last 300 days');
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('returns a single date when it is a custom_date_range of two dates that are the same day', () => {
      const periodName = getTimePeriodName('custom_date_range', {
        startDate: '2018-09-18T14:38:58+00:00',
        endDate: '2018-09-18T14:38:58+00:00',
      });
      expect(periodName).toEqual('18 Sep 2018');
    });

    it('returns the right time period name when the time period is custom_date_range', () => {
      const periodName = getTimePeriodName('custom_date_range', {
        startDate: '2018-09-17T14:38:58+00:00',
        endDate: '2018-09-18T14:38:58+00:00',
      });
      expect(periodName).toEqual('17 Sep 2018 - 18 Sep 2018');
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('returns the right time period name when the time period is custom_date_range', () => {
      const periodName = getTimePeriodName('custom_date_range', {
        startDate: '2018-09-17T14:38:58+00:00',
        endDate: '2018-09-18T14:38:58+00:00',
      });
      expect(periodName).toEqual('Sep 17, 2018 - Sep 18, 2018');
    });
  });
});

describe('getCalculationsByType', () => {
  const graphOverlay = [calculations.mean, calculations.max, calculations.min];
  const graphOverlayWithAbsolutes = [
    calculations.mean,
    calculations.max,
    calculations.maxAbsolute,
    calculations.min,
    calculations.minAbsolute,
  ];

  const simple = [
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.sum,
  ];

  const simpleWithAbsolutes = [
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.min,
    calculations.minAbsolute,
    calculations.count,
    calculations.countAbsolute,
    calculations.sum,
    calculations.sumAbsolute,
  ];

  const simpleAndLast = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.sum,
  ];

  const simpleAndLastWithAbsolutes = [
    calculations.last,
    calculations.max,
    calculations.maxAbsolute,
    calculations.mean,
    calculations.min,
    calculations.minAbsolute,
    calculations.count,
    calculations.countAbsolute,
    calculations.sum,
    calculations.sumAbsolute,
  ];

  const complex = [
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];

  beforeEach(() => {
    window.setFlag('training-efficiency-index', true);
  });

  it('returns graph_overlay calculations', () => {
    expect(getCalculationsByType('graph_overlay')).toEqual(graphOverlay);
  });

  it('returns simple calculations', () => {
    expect(getCalculationsByType('simple')).toEqual(simple);
  });

  it('returns simple and last calculations', () => {
    expect(getCalculationsByType('simple_and_last')).toEqual(simpleAndLast);
  });

  it('returns complex calculations', () => {
    expect(getCalculationsByType('complex')).toEqual(complex);
  });

  describe('when no argument provided', () => {
    it('returns all calculations', () => {
      expect(getCalculationsByType()).toEqual(simple.concat(complex));
    });
  });

  it('does not return trainingEfficiencyIndex calculation when feature flag is off', () => {
    window.setFlag('training-efficiency-index', false);
    const summariesExcludingTrainingEfficiencyIndex = simple
      .concat(complex)
      .filter((calculation) => calculation.id !== 'training_efficiency_index');
    expect(getCalculationsByType()).toEqual(
      summariesExcludingTrainingEfficiencyIndex
    );
  });

  describe('when the graph-pipeline-migration-summary flag is on', () => {
    beforeEach(() => {
      window.featureFlags['graph-pipeline-migration-summary'] = true;
    });

    afterEach(() => {
      window.featureFlags['graph-pipeline-migration-summary'] = false;
    });

    it('returns simple calculations with absolutes', () => {
      expect(getCalculationsByType('simple')).toEqual(simpleWithAbsolutes);
    });

    it('returns last calculation plus simple calculations with absolutes', () => {
      expect(getCalculationsByType('simple_and_last')).toEqual(
        simpleAndLastWithAbsolutes
      );
    });
  });

  describe('when the graph-pipeline-migration-summary_bar flag is on', () => {
    beforeEach(() => {
      window.setFlag('graph-pipeline-migration-summary_bar', true);
    });

    afterEach(() => {
      window.setFlag('graph-pipeline-migration-summary_bar', false);
    });

    it('returns graph_overlay calculations with absolutes', () => {
      expect(getCalculationsByType('graph_overlay')).toEqual(
        graphOverlayWithAbsolutes
      );
    });
  });

  describe('when the graph-pipeline-migration-longitudinal flag is on', () => {
    beforeEach(() => {
      window.setFlag('graph-pipeline-migration-longitudinal', true);
    });

    afterEach(() => {
      window.featureFlags['  graph-pipeline-migration-longitudinal'] = false;
    });

    it('returns graph_overlay calculations with absolutes', () => {
      expect(getCalculationsByType('graph_overlay')).toEqual(
        graphOverlayWithAbsolutes
      );
    });
  });
});
