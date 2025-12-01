import moment from 'moment-timezone';

import {
  getDuration,
  getDuplicateTreatmentDateTime,
  onTimeChangeSetDate,
  onDateChangeSetTime,
  onSetStartDate,
  onSetStartTime,
  onSetEndDate,
  onSetEndTime,
} from '../timeUtils';

import mockDuplicateTreatment from '../mocks/mockDuplicateTreatment';

describe('AddTreatmentSidePanel timeutils', () => {
  let dateState;

  beforeEach(() => {
    document.body.dataset.timezone = 'Europe/Dublin';
    moment.tz.setDefault('Europe/Dublin');
    const startDate = moment('2022-08-23T16:00:00.000');
    const startTime = moment('2022-08-23T16:00:00.000');
    const endDate = moment('2022-08-23T16:30:00.000');
    const endTime = moment('2022-08-23T16:30:00.000');
    dateState = {
      startDate,
      endDate,
      startTime,
      endTime,
      duration: '30 mins',
      timezone: 'Europe/Dublin',
    };
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('calculates the duration correctly', () => {
    const result = getDuration({
      startTime: moment('2020-10-16T01:20:00'),
      endTime: moment('2020-10-16T02:22:00'),
    });
    expect(result).toBe('62 mins');
  });

  it('updates the date.startDate', () => {
    const result = onSetStartDate(
      dateState,
      moment('2022-08-24T08:00:00+01:00')
    );

    expect(result.duration).toBe('30 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.startDate).format()).toBe('2022-08-24T16:00:00+01:00');
    expect(moment(result.endDate).format()).toBe('2022-08-24T16:30:00+01:00');
    expect(moment(result.startTime).format()).toBe('2022-08-24T16:00:00+01:00');
    expect(moment(result.endTime).format()).toBe('2022-08-24T16:30:00+01:00');
  });

  it('updates the date.startTime', () => {
    const result = onSetStartTime(
      moment('2022-08-23T09:30:00+01:00'),
      dateState
    );

    expect(result.duration).toBe('420 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.startDate).format()).toBe('2022-08-23T09:30:00+01:00');
    expect(moment(result.startTime).format()).toBe('2022-08-23T09:30:00+01:00');
    expect(moment(result.endDate).format()).toBe('2022-08-23T16:30:00+01:00');
    expect(moment(result.endTime).format()).toBe('2022-08-23T16:30:00+01:00');
  });

  it('updates the date.endTime if the startTime is after the date.endTime', () => {
    const result = onSetStartTime(
      moment('2022-08-23T17:30:00+01:00'),
      dateState
    );

    expect(result.duration).toBe('30 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.startDate).format()).toBe('2022-08-23T17:30:00+01:00');
    expect(moment(result.startTime).format()).toBe('2022-08-23T17:30:00+01:00');
    expect(moment(result.endDate).format()).toBe('2022-08-23T18:00:00+01:00');
    expect(moment(result.endTime).format()).toBe('2022-08-23T18:00:00+01:00');
  });

  it('updates the date.startTime if the startTime is after the date.endTime', () => {
    const result = onSetEndTime(dateState, moment('2022-08-27T09:27:00+01:00'));

    expect(result.duration).toBe('0 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.startDate).format()).toBe('2022-08-23T09:27:00+01:00');
    expect(moment(result.startTime).format()).toBe('2022-08-23T09:27:00+01:00');
    expect(moment(result.endDate).format()).toBe('2022-08-23T09:27:00+01:00');
    expect(moment(result.endTime).format()).toBe('2022-08-23T09:27:00+01:00');
  });

  it('updates the date.endDate', () => {
    const result = onSetEndDate(moment('2022-08-24T13:03:00+01:00'), dateState);

    expect(result.duration).toBe('1470 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.startDate).format()).toBe('2022-08-23T16:00:00+01:00');
    expect(moment(result.startTime).format()).toBe('2022-08-23T16:00:00+01:00');
    expect(moment(result.endDate).format()).toBe('2022-08-24T16:30:00+01:00');
    expect(moment(result.endTime).format()).toBe('2022-08-24T16:30:00+01:00');
  });

  it('updates the date.endTime', () => {
    const result = onSetEndTime(dateState, moment('2022-08-26T13:37:00+01:00'));

    expect(result.duration).toBe('0 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.endDate).format()).toBe('2022-08-23T13:37:00+01:00');
  });

  it('updates the date when onTimeChangeSetDate is invoked', () => {
    const result = onTimeChangeSetDate({
      time: moment('2022-08-23T12:33:00.000'),
      date: moment('2022-08-23T16:00:00.000'),
    });
    expect(moment(result).format()).toBe('2022-08-23T12:33:00+01:00');
  });

  it('updates the time when onDateChangeSetTime is invoked', () => {
    const result = onDateChangeSetTime({
      time: moment('2022-08-23T12:33:00.000'),
      date: moment('2022-08-28T16:00:00.000'),
    });
    expect(moment(result).format()).toBe('2022-08-28T12:33:00+01:00');
  });

  it('returns the correct current startDay when duplicating', () => {
    const currentDay = moment().format('YYYY-MM-DD');
    const result = getDuplicateTreatmentDateTime(mockDuplicateTreatment);
    const startDay = moment(result.treatmentStartTime).format('YYYY-MM-DD');
    expect(startDay).toBe(currentDay);
  });

  it('returns the correct duration when startTime is set to be after endTime', () => {
    const result = onSetStartTime(
      moment('2022-08-23T16:40:00+01:00'),
      dateState
    );

    expect(result.duration).toBe('30 mins');
    expect(result.timezone).toBe('Europe/Dublin');
    expect(moment(result.startDate).format()).toBe('2022-08-23T16:40:00+01:00');
    expect(moment(result.startTime).format()).toBe('2022-08-23T16:40:00+01:00');
    expect(moment(result.endDate).format()).toBe('2022-08-23T17:10:00+01:00');
    expect(moment(result.endTime).format()).toBe('2022-08-23T17:10:00+01:00');
  });
});
