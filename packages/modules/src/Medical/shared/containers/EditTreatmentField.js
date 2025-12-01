// @flow
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import _get from 'lodash/get';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { setTreatmentFieldValue } from '../redux/actions';

type Props = {
  athleteId: number,
  fieldKey: string,
  render: Function,
};

type ReasonFieldProps = {
  athleteId: number,
  index: number,
  render: Function,
};

const getAthleteTreatment = (id) => (state) => {
  return _get(state, `treatmentCardList.athleteTreatments.${id}`, {});
};

const getTreatmentFieldValue = (id, field) => (state) => {
  return _get(getAthleteTreatment(id)(state), field);
};

const getReasonField = (athleteId, index) => (state) => {
  return {
    reason: getTreatmentFieldValue(
      athleteId,
      `treatments_attributes[${index}].reason`
    )(state),
    issue_id: getTreatmentFieldValue(
      athleteId,
      `treatments_attributes[${index}].issue_id`
    )(state),
    issue_type: getTreatmentFieldValue(
      athleteId,
      `treatments_attributes[${index}].issue_type`
    )(state),
  };
};

const EditTreatmentFieldContainer = (props: Props) => {
  const dispatch = useDispatch();

  const value = useSelector(
    getTreatmentFieldValue(props.athleteId, props.fieldKey)
  );
  const onChange = (newValue) => {
    dispatch(setTreatmentFieldValue(props.athleteId, props.fieldKey, newValue));
  };

  return props.render(value, onChange);
};

export const EditTreatmentFieldDateContainer = (props: Props) => {
  const dispatch = useDispatch();

  const value = useSelector(
    getTreatmentFieldValue(props.athleteId, props.fieldKey)
  );

  const currentTimezone = useSelector(
    getTreatmentFieldValue(props.athleteId, 'timezone')
  );

  const currentStartTime = useSelector(
    getTreatmentFieldValue(props.athleteId, 'start_time')
  );
  const currentStartTimeMoment = moment(currentStartTime);

  const currentEndTime = useSelector(
    getTreatmentFieldValue(props.athleteId, 'end_time')
  );
  const currentEndTimeMoment = moment(currentEndTime);

  const onChange = (newDate) => {
    // Create base moments with correct date and timezone
    const baseStartTimeDate = moment.tz(newDate, currentTimezone);
    const baseEndTimeDate = moment.tz(newDate, currentTimezone);

    // Apply the current time from startTime on top
    baseStartTimeDate.set({
      hour: currentStartTimeMoment.get('hour'),
      minute: currentStartTimeMoment.get('minute'),
    });

    // Apply the current time from endTime on top
    baseEndTimeDate.set({
      hour: currentEndTimeMoment.get('hour'),
      minute: currentEndTimeMoment.get('minute'),
    });

    // If endTime is before startTime we add a day to the date.
    // So if startTime as 23:50 (11:50pm) and baseEndTimeDate were 01:00 (1am)
    // Then endTime should be considered the next day
    if (baseEndTimeDate.isBefore(baseStartTimeDate)) {
      baseEndTimeDate.add(1, 'day');
    }

    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        'date',
        moment(newDate).format(dateTransferFormat)
      )
    );
    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        'start_time',
        moment(baseStartTimeDate).format(dateTransferFormat)
      )
    );
    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        'end_time',
        moment(baseEndTimeDate).format(dateTransferFormat)
      )
    );
  };

  return props.render(value, onChange);
};

export const EditTreatmentFieldTimeContainer = (props: Props) => {
  const dispatch = useDispatch();

  const value = useSelector(
    getTreatmentFieldValue(props.athleteId, props.fieldKey)
  );

  const currentTimezone = useSelector(
    getTreatmentFieldValue(props.athleteId, 'timezone')
  );

  const currentStartTime = useSelector(
    getTreatmentFieldValue(props.athleteId, 'start_time')
  );

  const onChange = (newTime) => {
    const startPlusDuration = moment
      .tz(newTime, currentTimezone)
      .add(30, 'minutes');
    const baseEndTimeDate = moment.tz(newTime, currentTimezone);

    if (props.fieldKey === 'start_time') {
      dispatch(
        setTreatmentFieldValue(
          props.athleteId,
          props.fieldKey,
          moment(newTime).format(dateTransferFormat)
        )
      );
      // we need to update the end_time
      dispatch(
        setTreatmentFieldValue(
          props.athleteId,
          'end_time',
          moment(startPlusDuration).format(dateTransferFormat)
        )
      );
    } else if (props.fieldKey === 'end_time') {
      // If endTime is before startTime we add a day to the date.
      // So if startTime as 23:50 (11:50pm) and baseEndTimeDate were 01:00 (1am)
      // Then endTime should be considered the next day
      if (baseEndTimeDate.isBefore(currentStartTime)) {
        baseEndTimeDate.add(1, 'day');
      }

      dispatch(
        setTreatmentFieldValue(
          props.athleteId,
          'end_time',
          moment(baseEndTimeDate).format(dateTransferFormat)
        )
      );
    }
  };

  return props.render(value, onChange);
};

export const EditTreatmentFieldTimezoneContainer = (props: Props) => {
  const dispatch = useDispatch();

  const value = useSelector(
    getTreatmentFieldValue(props.athleteId, props.fieldKey)
  );

  const currentStartTime = useSelector(
    getTreatmentFieldValue(props.athleteId, 'start_time')
  );
  const currentStartTimeMoment = moment(currentStartTime);

  const currentEndTime = useSelector(
    getTreatmentFieldValue(props.athleteId, 'end_time')
  );
  const currentEndTimeMoment = moment(currentEndTime);

  const onChange = (newTimezone) => {
    // We don't convert/offset the time to the new timezone
    // Instead if it was 3pm in original timezone, make the new start time 3pm in the new timezone
    const startTimeWithTimezone = moment(new Date()).tz(newTimezone);
    const endTimeWithTimezone = moment(new Date()).tz(newTimezone);

    startTimeWithTimezone.set({
      year: currentStartTimeMoment.get('year'),
      month: currentStartTimeMoment.get('month'),
      date: currentStartTimeMoment.get('date'),
      hour: currentStartTimeMoment.get('hour'),
      minute: currentStartTimeMoment.get('minute'),
      second: 0,
      millisecond: 0,
    });

    endTimeWithTimezone.set({
      year: currentEndTimeMoment.get('year'),
      month: currentEndTimeMoment.get('month'),
      date: currentEndTimeMoment.get('date'),
      hour: currentEndTimeMoment.get('hour'),
      minute: currentEndTimeMoment.get('minute'),
      second: 0,
      millisecond: 0,
    });

    dispatch(
      setTreatmentFieldValue(props.athleteId, props.fieldKey, newTimezone)
    );

    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        'start_time',
        moment(startTimeWithTimezone).format(dateTransferFormat)
      )
    );

    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        'end_time',
        moment(endTimeWithTimezone).format(dateTransferFormat)
      )
    );
  };

  return props.render(value, onChange);
};

export const EditTreatmentFieldReasonContainer = (props: ReasonFieldProps) => {
  const dispatch = useDispatch();

  const value = useSelector(getReasonField(props.athleteId, props.index));

  const onChange = (newValue) => {
    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        `treatments_attributes[${props.index}].reason`,
        newValue.reason
      )
    );
    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        `treatments_attributes[${props.index}].issue_id`,
        newValue.issue_id
      )
    );
    dispatch(
      setTreatmentFieldValue(
        props.athleteId,
        `treatments_attributes[${props.index}].issue_type`,
        newValue.issue_type
      )
    );
  };

  return props.render(value, onChange);
};

export default EditTreatmentFieldContainer;
