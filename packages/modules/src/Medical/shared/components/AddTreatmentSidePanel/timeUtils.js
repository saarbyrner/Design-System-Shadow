// @flow
import moment from 'moment-timezone';
import type { TreatmentTimeDate, DuplicateTreatmentSession } from './types';

export const getDuration = ({
  startTime,
  endTime,
}: {
  startTime: moment,
  endTime: moment,
}) => {
  let duration = '';

  if (startTime && endTime) {
    duration = moment.duration(endTime.diff(startTime)).asMinutes();
    return `${Math.round(duration)} mins`;
  }
  return duration;
};

// Take in duplicateTreatment obj, return start & end times with same treatment duration for the current date
export const getDuplicateTreatmentDateTime = (
  duplicateTreatment: DuplicateTreatmentSession
) => {
  // Grab start & end date of the treatment we are duplicating
  const startDate = moment(duplicateTreatment.start_time).tz(
    duplicateTreatment.timezone
  );

  const endDate = moment(duplicateTreatment.end_time).tz(
    duplicateTreatment.timezone
  );

  const treatmentLength = moment.duration(endDate.diff(startDate)).asMinutes();

  const treatmentLengthLabel = getDuration({
    endTime: endDate,
    startTime: startDate,
  });

  const startTime = moment().set({
    hour: startDate.get('hours'),
    minutes: startDate.get('minutes'),
    seconds: startDate.get('seconds'),
  });

  const endTime = moment(startTime).add(treatmentLength, 'minutes');

  return {
    startTime,
    endTime,
    treatmentLengthLabel,
    timezone: duplicateTreatment.timezone,
  };
};

export const endTimeSanityCheck = (
  startTime: moment,
  endTime: moment
): moment => {
  return endTime.isBefore(startTime) ? endTime : startTime;
};

export const startDateSanityCheck = (endDate: moment, currentDate: moment) => {
  if (endDate.isBefore(currentDate)) {
    return moment(currentDate).add(30, 'minutes');
  }
  return moment(endDate);
};

export const setEndDateOnStartDate = (startDate: moment, endDate: moment) => {
  if (endDate.isBefore(startDate)) return moment(startDate);
  return moment(endDate);
};

export const onTimeChangeSetDate = ({
  time,
  date,
}: {
  time: moment,
  date: moment,
}) => {
  return moment(time).set({
    year: date.get('year'),
    month: date.get('month'),
    day: date.get('day'),
  });
};

export const onDateChangeSetTime = ({
  time,
  date,
}: {
  time: moment,
  date: moment,
}) => {
  return moment(date).set({
    hour: time.get('hour'),
    minute: time.get('minute'),
    second: 0,
    millisecond: 0,
  });
};

// <DatePicker/> returns date only. We need to get the time value and update the date
// We also need to check that the endDate is not before the startDate and update if it is
export const onSetStartDate = (
  currentDateTime: TreatmentTimeDate,
  newStartDate: moment
): TreatmentTimeDate => {
  const startDate = onDateChangeSetTime({
    time: currentDateTime.startTime,
    date: moment(newStartDate),
  }).tz(currentDateTime.timezone);

  const startTime = startDate;

  const endDate = onDateChangeSetTime({
    time: currentDateTime.endTime,
    date: moment(setEndDateOnStartDate(newStartDate, currentDateTime.endDate)),
  }).tz(currentDateTime.timezone);

  const endTime = endDate;

  return {
    ...currentDateTime,
    startDate,
    startTime,
    endDate,
    endTime,
    duration: getDuration({ endTime, startTime }),
  };
};

// We just need to update the duration here as the <DatePicker/> has a min value set to be the start date
export const onSetEndDate = (
  newEndDate: moment,
  currentDateTime: TreatmentTimeDate
): TreatmentTimeDate => {
  let endDate = onDateChangeSetTime({
    time: currentDateTime.endTime,
    date: moment(newEndDate),
  }).tz(currentDateTime.timezone);

  const endTime = startDateSanityCheck(endDate, currentDateTime.startTime).tz(
    currentDateTime.timezone
  );

  endDate = endTime;

  return {
    ...currentDateTime,
    endDate,
    endTime,
    duration: getDuration({
      endTime,
      startTime: currentDateTime.startTime,
    }),
  };
};

// We update the <DatePicker/> date with the correct time
// We also need to check that the endTime is not before the startTime and update if it is
export const onSetStartTime = (
  setStartTime: moment,
  currentDateTime: TreatmentTimeDate
): TreatmentTimeDate => {
  const startDate = onTimeChangeSetDate({
    time: moment(setStartTime),
    date: currentDateTime.startDate,
  }).tz(currentDateTime.timezone);

  const startTime = startDate;

  const endDate = startDateSanityCheck(currentDateTime.endDate, startTime);

  const endTime = endDate;

  return {
    ...currentDateTime,
    startDate,
    endDate,
    startTime,
    endTime,
    duration: getDuration({
      endTime: endDate,
      startTime: startDate,
    }),
  };
};

// Again, <DatePicker/> only return the date. We need to assign the time to the enddate
// We also need to check that the startTime is not after the endTime, and update if it is
export const onSetEndTime = (
  currentDateTime: TreatmentTimeDate,
  setEndTime: moment
): TreatmentTimeDate => {
  const endDate = onTimeChangeSetDate({
    time: moment(setEndTime),
    date: currentDateTime.endDate,
  }).tz(currentDateTime.timezone);

  const startDate = endTimeSanityCheck(currentDateTime.startDate, endDate);

  return {
    ...currentDateTime,
    startDate,
    endDate,
    startTime: startDate,
    endTime: endDate,
    duration: getDuration({ endTime: endDate, startTime: startDate }),
  };
};
