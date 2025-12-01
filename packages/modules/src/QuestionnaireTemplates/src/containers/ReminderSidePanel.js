import { useSelector, useDispatch } from 'react-redux';
import {
  closeSidePanel,
  saveScheduleReminder,
  toggleNotifyAthletes,
  updateScheduleTime,
  updateLocalTimeZone,
  toggleDay,
} from '../actions';
import { ReminderSidePanelTranslated as ReminderSidePanel } from '../components/ReminderSidePanel';

const ReminderSidePanelContainer = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.reminderSidePanel.isOpen);
  const notifyAthletes = useSelector(
    (state) => state.reminderSidePanel.notifyAthletes
  );
  const scheduledTime = useSelector(
    (state) => state.reminderSidePanel.scheduledTime
  );
  const localTimeZone = useSelector(
    (state) => state.reminderSidePanel.localTimeZone
  );
  const scheduledDays = useSelector(
    (state) => state.reminderSidePanel.scheduledDays
  );

  return (
    <ReminderSidePanel
      isOpen={isOpen}
      notifyAthletes={notifyAthletes}
      scheduledTime={scheduledTime}
      localTimeZone={localTimeZone}
      scheduledDays={scheduledDays}
      onToggleNotifyAthletes={() => dispatch(toggleNotifyAthletes())}
      onChangeScheduleTime={(time) => dispatch(updateScheduleTime(time))}
      onChangeLocalTimeZone={(timezone) =>
        dispatch(updateLocalTimeZone(timezone))
      }
      onChangeScheduleDay={(day) => dispatch(toggleDay(day))}
      onClickCloseSidePanel={() => dispatch(closeSidePanel())}
      onClickSaveScheduleReminder={() => dispatch(saveScheduleReminder())}
    />
  );
};

export default ReminderSidePanelContainer;
