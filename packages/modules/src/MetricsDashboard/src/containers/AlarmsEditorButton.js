import { connect } from 'react-redux';
import {
  showAlarmsEditorModal,
  setAlarmDefinitionsForStatus,
} from '../actions';
import { AlarmsEditorButtonTranslated as AlarmsEditorButton } from '../components/AlarmsEditorButton';

const mapStateToProps = (state, ownProps) => ({
  alarmCount: state.alarmDefinitions[ownProps.statusId]
    ? state.alarmDefinitions[ownProps.statusId].length
    : null,
  alarmsForStatus: state.alarmDefinitions[ownProps.statusId] || null,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  show: () => {
    dispatch(showAlarmsEditorModal(ownProps.statusId));
  },
  setAlarms: (alarms) => {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      ga('send', 'event', 'Dashboard', 'trigger_add_alarm', 'Add Alarm'); // eslint-disable-line no-undef
    }
    dispatch(setAlarmDefinitionsForStatus(alarms));
  },
});

const AlarmsEditorButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlarmsEditorButton);

export default AlarmsEditorButtonContainer;
