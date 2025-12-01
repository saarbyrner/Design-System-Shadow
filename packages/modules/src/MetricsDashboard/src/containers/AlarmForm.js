import { connect } from 'react-redux';
import {
  setAlarmCondition,
  setAlarmValue,
  deleteAlarmDefinitionForStatus,
  setAlarmColour,
  updateShowAlarmOnMobile,
  setAlarmCalculation,
  setAlarmType,
  setAlarmPercentage,
  setAlarmPeriodScope,
  setAlarmPeriodLength,
} from '../actions';
import { AlarmFormTranslated as AlarmForm } from '../components/AlarmForm';

const mapStateToProps = (state, ownProps) => ({
  alarmValue: ownProps.value === 0 || ownProps.value ? ownProps.value : '',
  alarmColour: ownProps.colour,
  show_on_mobile: ownProps.show_on_mobile || false,
});

const mapDispatchToProps = (dispatch) => ({
  deleteAlarm: (index) => {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      ga('send', 'event', 'Dashboard', 'trigger_delete_alarm', 'Delete Alarm'); // eslint-disable-line no-undef
    }
    dispatch(deleteAlarmDefinitionForStatus(index));
  },
  setCondition: (condition, index) => {
    dispatch(setAlarmCondition(condition, index));
  },
  setValue: (value, index) => {
    dispatch(setAlarmValue(value, index));
  },
  setTimeValue: (value, index) => {
    dispatch(setAlarmValue(value, index));
  },
  setAlarmColour: (colour, index) => {
    dispatch(setAlarmColour(colour, index));
  },
  updateShowAlarmOnMobile: (alarmPosition, showOnMobile) => {
    dispatch(updateShowAlarmOnMobile(alarmPosition, showOnMobile));
  },
  setAlarmCalculation: (calculation, index) => {
    dispatch(setAlarmCalculation(calculation, index));
  },
  setAlarmType: (alarmType, index) => {
    dispatch(setAlarmType(alarmType, index));
  },
  setAlarmPercentage: (percentage, index) => {
    dispatch(setAlarmPercentage(percentage, index));
  },
  setAlarmPeriodScope: (periodScope, index) => {
    dispatch(setAlarmPeriodScope(periodScope, index));
  },
  setAlarmPeriodLength: (periodLength, index) => {
    dispatch(setAlarmPeriodLength(periodLength, index));
  },
});

const AlarmFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlarmForm);

export default AlarmFormContainer;
