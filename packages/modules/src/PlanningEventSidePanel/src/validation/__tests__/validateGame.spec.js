import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import validateGame from '../validateGame';

describe('PlanningEventSidePanel validateGame', () => {
  const invalidResult = {
    isInvalid: true,
  };

  const validResult = {
    isInvalid: false,
  };

  const seasonMarkerRange = ['2022-01-01T00:00:00Z', '2023-01-01T00:00:00Z'];

  let timer;

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    const fakeDate = moment('2022-04-24').toDate();
    timer = sinon.useFakeTimers(fakeDate);
  });

  afterEach(() => {
    // we must clean up when tampering with globals.
    moment.tz.setDefault();
    timer.restore();
  });

  it('validates correct data without issues', () => {
    const data = {
      start_time: '2022-04-20T07:00:48Z', // In season
      local_timezone: 'Europe/Dublin',
      duration: '10',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: 4,
      score: '5',
      opponent_score: '6',
      round_number: '7',
      turnaround_fixture: true,
    };

    const obj = validateGame(data, seasonMarkerRange);
    expect(obj.isValid).eq(true);

    const result = obj.validation;
    expect(result.venue_type_id).deep.eq(validResult);
    expect(result.competition_id).deep.eq(validResult);
    expect(result.organisation_team_id).deep.eq(validResult);
    expect(result.team_id).deep.eq(validResult);
    expect(result.score).deep.eq(validResult);
    expect(result.opponent_score).deep.eq(validResult);
    expect(result.round_number).deep.eq(validResult);
    expect(result.turnaround_fixture).deep.eq(validResult);
  });

  it('will not validate when season markers are not set', () => {
    const data = {
      start_time: '2022-04-20T07:00:48Z', // In season ( if we had set season marker range )
      local_timezone: 'Europe/Dublin',
      duration: '10',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: 4,
      score: undefined,
      opponent_score: undefined,
      round_number: '7',
      turnaround_fixture: true,
    };

    const obj = validateGame(data, null); // No season marker range
    expect(obj.isValid).eq(false);

    const result = obj.validation;

    // Out of season
    expect(result.start_time.isInvalid).eq(true);
    expect(result.start_time.messages.length).eq(1);
  });

  it('validates out of season future start_time', () => {
    const data = {
      start_time: '2023-04-20T07:00:48Z', // Future (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: 4,
      score: undefined,
      opponent_score: undefined,
      round_number: '7',
      turnaround_fixture: true,
    };

    const obj = validateGame(data, seasonMarkerRange);
    expect(obj.isValid).eq(false);

    const result = obj.validation;

    // Out of season
    expect(result.start_time.isInvalid).eq(true);
    expect(result.start_time.messages.length).eq(1);

    expect(result.venue_type_id).deep.eq(validResult);
    expect(result.competition_id).deep.eq(validResult);
    expect(result.organisation_team_id).deep.eq(validResult);
    expect(result.team_id).deep.eq(validResult);

    expect(result.score).deep.eq(validResult);

    expect(result.opponent_score).deep.eq(validResult);
    expect(result.round_number).deep.eq(validResult);
    expect(result.turnaround_fixture).deep.eq(validResult);
  });

  it('validates out of season past start_time', () => {
    const data = {
      start_time: '2021-04-20T07:00:48Z', // Past (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: 4,
      score: '5',
      opponent_score: '6',
      round_number: '7',
      turnaround_fixture: true,
    };

    const obj = validateGame(data, seasonMarkerRange);
    expect(obj.isValid).eq(false);

    const result = obj.validation;

    // Out of season
    expect(result.start_time.isInvalid).eq(true);
    expect(result.start_time.messages.length).eq(1);

    expect(result.venue_type_id).deep.eq(validResult);
    expect(result.competition_id).deep.eq(validResult);
    expect(result.organisation_team_id).deep.eq(validResult);
    expect(result.team_id).deep.eq(validResult);
    expect(result.score).deep.eq(validResult);
    expect(result.opponent_score).deep.eq(validResult);
    expect(result.round_number).deep.eq(validResult);
    expect(result.turnaround_fixture).deep.eq(validResult);
  });

  it('validates required values are present', () => {
    const data = {
      start_time: '2010-04-20T07:00:48Z', // Past (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      venue_type_id: undefined,
      competition_id: undefined,
      organisation_team_id: undefined,
      team_id: undefined,
      score: undefined,
      opponent_score: undefined,
      round_number: undefined,
      turnaround_fixture: undefined,
    };

    const obj = validateGame(data, seasonMarkerRange);
    expect(obj.isValid).eq(false);
    const result = obj.validation;
    expect(result.round_number).deep.eq(validResult); // Optional

    // Out of season
    expect(result.start_time.isInvalid).eq(true);
    expect(result.start_time.messages.length).eq(1);

    expect(result.venue_type_id).deep.eq(invalidResult);
    expect(result.competition_id).deep.eq(invalidResult);
    expect(result.organisation_team_id).deep.eq(invalidResult);
    expect(result.team_id).deep.eq(invalidResult);
    expect(result.score).deep.eq(invalidResult);
    expect(result.opponent_score).deep.eq(invalidResult);
    expect(result.turnaround_fixture).deep.eq(invalidResult);
  });

  it('validates scores are required if event in past', () => {
    const data = {
      start_time: '2010-04-20T07:00:48Z', // Past (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      // No score
      opponent_score: undefined,
    };

    let obj = validateGame(data, seasonMarkerRange);
    expect(obj.isValid).eq(false);

    let result = obj.validation;
    expect(result.score).deep.eq(invalidResult);
    expect(result.opponent_score).deep.eq(invalidResult);

    const data2 = {
      start_time: '2090-04-20T07:00:48Z', // Far Future (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      // No score
      opponent_score: undefined,
    };

    obj = validateGame(data2, seasonMarkerRange);
    expect(obj.isValid).eq(false);

    result = validateGame(data2, seasonMarkerRange).validation;
    expect(result.score).deep.eq(validResult);
    expect(result.opponent_score).deep.eq(validResult);
  });

  it('validates scores are mandatory if event is yesterday', () => {
    const data = {
      start_time: '2022-04-23T20:59:48Z', // late yesterday
      local_timezone: 'Europe/Dublin',
      duration: '10',
      // No score
      opponent_score: undefined,
    };

    let obj = validateGame(data, seasonMarkerRange);
    expect(obj.isValid).eq(false);

    let result = obj.validation;
    expect(result.score).deep.eq(invalidResult);
    expect(result.opponent_score).deep.eq(invalidResult);

    const data2 = {
      start_time: '2022-04-23T00:00:50Z', // early yesterday
      local_timezone: 'Europe/Dublin',
      duration: '10',
      // No score
      opponent_score: undefined,
    };

    obj = validateGame(data2, seasonMarkerRange);
    expect(obj.isValid).eq(false);

    result = validateGame(data2, seasonMarkerRange).validation;
    expect(result.score).deep.eq(invalidResult);
    expect(result.opponent_score).deep.eq(invalidResult);
  });

  describe('when the game-score-for-today-allowed Feature Flag is true', () => {
    beforeEach(() => {
      window.featureFlags['game-score-for-today-allowed'] = true;
    });

    afterEach(() => {
      window.featureFlags['game-score-for-today-allowed'] = false;
    });

    it('validates empty scores are accepted if event is today', () => {
      const data = {
        start_time: '2022-04-24T20:59:48Z', // late today
        local_timezone: 'Europe/Dublin',
        duration: '10',
      };

      let obj = validateGame(data, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      let result = obj.validation;
      expect(result.score).deep.eq(validResult);
      expect(result.opponent_score).deep.eq(validResult);

      const data2 = {
        start_time: '2022-04-24T00:00:48Z', // early today
        local_timezone: 'Europe/Dublin',
        duration: '10',
      };

      obj = validateGame(data2, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      result = validateGame(data2, seasonMarkerRange).validation;
      expect(result.score).deep.eq(validResult);
      expect(result.opponent_score).deep.eq(validResult);
    });

    it('validates scores are accepted if event is today', () => {
      const data = {
        start_time: '2022-04-24T20:59:48Z', // late today
        local_timezone: 'Europe/Dublin',
        duration: '10',
        score: '4',
        opponent_score: '22',
      };

      let obj = validateGame(data, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      let result = obj.validation;
      expect(result.score).deep.eq(validResult);
      expect(result.opponent_score).deep.eq(validResult);

      const data2 = {
        start_time: '2022-04-24T00:00:48Z', // early today
        local_timezone: 'Europe/Dublin',
        duration: '10',
        score: '4',
        opponent_score: '22',
      };

      obj = validateGame(data2, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      result = validateGame(data2, seasonMarkerRange).validation;
      expect(result.score).deep.eq(validResult);
      expect(result.opponent_score).deep.eq(validResult);
    });
  });

  describe('when the game-score-for-today-allowed Feature Flag is false', () => {
    beforeEach(() => {
      window.featureFlags['game-score-for-today-allowed'] = false;
    });

    it('validates empty scores are not accepted if event is today', () => {
      const data = {
        start_time: '2022-04-24T20:59:48Z', // late today
        local_timezone: 'Europe/Dublin',
        duration: '10',
      };

      let obj = validateGame(data, seasonMarkerRange);

      expect(obj.isValid).eq(false);

      let result = obj.validation;
      expect(result.score).deep.eq(invalidResult);
      expect(result.opponent_score).deep.eq(invalidResult);

      const data2 = {
        start_time: '2022-04-24T00:00:48Z', // early today
        local_timezone: 'Europe/Dublin',
        duration: '10',
      };

      obj = validateGame(data2, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      result = validateGame(data2, seasonMarkerRange).validation;
      expect(result.score).deep.eq(invalidResult);
      expect(result.opponent_score).deep.eq(invalidResult);
    });

    it('validates scores are accepted if event is today', () => {
      const data = {
        start_time: '2022-04-24T20:59:48Z', // late today
        local_timezone: 'Europe/Dublin',
        duration: '10',
        score: '4',
        opponent_score: '22',
      };

      let obj = validateGame(data, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      let result = obj.validation;
      expect(result.score).deep.eq(validResult);
      expect(result.opponent_score).deep.eq(validResult);

      const data2 = {
        start_time: '2022-04-24T00:00:48Z', // early today
        local_timezone: 'Europe/Dublin',
        duration: '10',
        score: '4',
        opponent_score: '22',
      };

      obj = validateGame(data2, seasonMarkerRange);
      expect(obj.isValid).eq(false);

      result = validateGame(data2, seasonMarkerRange).validation;
      expect(result.score).deep.eq(validResult);
      expect(result.opponent_score).deep.eq(validResult);
    });
  });

  it('validates numeric values need to be positive ints and not doubles', () => {
    const data = {
      start_time: '2010-04-20T07:00:48Z', // Past (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      score: '-5',
      opponent_score: '-6',
      round_number: '-7',
    };

    const result = validateGame(data, seasonMarkerRange).validation;
    expect(result.score).deep.eq(invalidResult);
    expect(result.opponent_score).deep.eq(invalidResult);
    expect(result.round_number).deep.eq(invalidResult);

    const data2 = {
      start_time: '2010-04-20T07:00:48Z', // Past (Out of season)
      local_timezone: 'Europe/Dublin',
      duration: '10',
      score: '5.5',
      opponent_score: '6.5',
      round_number: '7.5',
    };

    const result2 = validateGame(data2).validation;
    expect(result2.score).deep.eq(invalidResult);
    expect(result2.opponent_score).deep.eq(invalidResult);
    expect(result2.round_number).deep.eq(invalidResult);
  });

  it('validate surface type when isGameDetailsV2 and fas_game_key is defined ', () => {
    const data = {
      start_time: '2022-04-20T07:00:48Z',
      local_timezone: 'Europe/Dublin',
      duration: '90',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: 4,
      score: '5',
      opponent_score: '6',
      round_number: '7',
      turnaround_fixture: true,
      fas_game_key: 'some_value',
      surface_type: undefined,
    };
    const isGameDetailsV2 = true;
    const tempUnit = 'C';

    const obj = validateGame(
      data,
      seasonMarkerRange,
      tempUnit,
      isGameDetailsV2
    );

    expect(obj.isValid).eq(false);

    const result = obj.validation;
    expect(result.surface_type).deep.eq({
      isInvalid: true,
    });
  });

  it('validate custom_periods when isCustomPeriodDuration is true', () => {
    const data = {
      start_time: '2022-04-20T07:00:48Z',
      local_timezone: 'Europe/Dublin',
      duration: '90',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: 4,
      score: '5',
      opponent_score: '6',
      round_number: '7',
      turnaround_fixture: true,
      custom_periods: [{ duration: 0 }],
    };
    const isGameDetailsV2 = true;
    const isCustomPeriodDuration = true;
    const tempUnit = 'C';

    const obj = validateGame(
      data,
      seasonMarkerRange,
      tempUnit,
      isGameDetailsV2,
      isCustomPeriodDuration
    );

    expect(obj.isValid).eq(false);

    const result = obj.validation;
    expect(result.custom_periods).deep.eq({
      isInvalid: true,
    });
  });

  it('validate custom_opposition_name when manualOppositionNameAllowed is true', () => {
    const data = {
      start_time: '2022-04-20T07:00:48Z',
      local_timezone: 'Europe/Dublin',
      duration: '90',
      venue_type_id: 1,
      competition_id: 2,
      organisation_team_id: 3,
      team_id: -1,
      score: '5',
      opponent_score: '6',
      round_number: '7',
      turnaround_fixture: true,
      custom_opposition_name: '',
    };
    const isGameDetailsV2 = true;
    const manualOppositionNameAllowed = true;
    const tempUnit = 'C';

    const obj = validateGame(
      data,
      seasonMarkerRange,
      tempUnit,
      isGameDetailsV2,
      false,
      manualOppositionNameAllowed
    );

    expect(obj.isValid).eq(false);

    const result = obj.validation;
    expect(result.custom_opposition_name).deep.eq({
      isInvalid: true,
    });
  });
});
