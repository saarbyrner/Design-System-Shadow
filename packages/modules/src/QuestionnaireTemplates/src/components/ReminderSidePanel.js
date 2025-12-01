// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import {
  Dropdown,
  FormValidator,
  SlidingPanel,
  TextButton,
  TimePicker,
  ToggleSwitch,
  DaySelector,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import dayOptions from '../../resources/daySelectOptions';

type Props = {
  isOpen: boolean,
  notifyAthletes: boolean,
  scheduledTime: string,
  localTimeZone: string,
  scheduledDays: { [day: string]: boolean },
  onToggleNotifyAthletes: Function,
  onChangeScheduleTime: Function,
  onChangeLocalTimeZone: Function,
  onChangeScheduleDay: Function,
  onClickCloseSidePanel: Function,
  onClickSaveScheduleReminder: Function,
};

const ReminderSidePanel = (props: I18nProps<Props>) => {
  const getNotificationTime = () => {
    const isNotificationTimeValid =
      props.scheduledTime && props.scheduledTime.split(':').length === 3;

    if (isNotificationTimeValid) {
      const [hours, minutes, seconds] = props.scheduledTime.split(':');

      return moment().set({
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
        seconds: parseInt(seconds, 10),
      });
    }

    return null;
  };

  const getTimeZoneOptions = () => {
    const timeZonesList = momentTZ.tz.names();
    return timeZonesList.map((timezoneItem) => ({
      id: timezoneItem,
      name: timezoneItem,
    }));
  };

  const getItems = () => {
    if (props.scheduledDays != null) {
      return dayOptions.map((option) => {
        return { ...option, selected: props.scheduledDays[option.id] };
      });
    }

    return [];
  };

  return (
    <SlidingPanel
      isOpen={props.isOpen}
      title={props.t('Schedule Reminders')}
      togglePanel={() => {
        props.onClickCloseSidePanel();
      }}
    >
      <FormValidator
        successAction={() => props.onClickSaveScheduleReminder()}
        inputNamesToIgnore={props.notifyAthletes ? [] : ['scheduleTime']}
      >
        <div className="reminderSidePanel">
          <h3 className="reminderSidePanel__subtitle">
            {props.t('How do you want to schedule reminders for this form?')}
          </h3>
          <div className="reminderSidePanel__athleteAppSection">
            <h4 className="reminderSidePanel__sectionTitle">
              {props.t('Athlete App')}
            </h4>
            <div className="reminderSidePanel__toggleItem">
              {props.t('Schedule push notification')}
              <ToggleSwitch
                isSwitchedOn={props.notifyAthletes}
                toggle={props.onToggleNotifyAthletes}
              />
            </div>
            <div className="reminderSidePanel__timePicker">
              <TimePicker
                name="scheduleTime"
                value={getNotificationTime()}
                label={props.t('Time')}
                onChange={(time) =>
                  props.onChangeScheduleTime(
                    time.set({ second: 0 }).format('HH:mm:ss')
                  )
                }
                disabled={!props.notifyAthletes}
                minuteStep={15}
              />
              <div className="reminderSidePanel__timePickerInfo">
                {props.t('Repeats daily')}
              </div>
            </div>
            {window.featureFlags['timezone-form-scheduling'] && (
              <div className="reminderSidePanel__timeZonePicker">
                <Dropdown
                  onChange={(timezone) => props.onChangeLocalTimeZone(timezone)}
                  items={getTimeZoneOptions()}
                  label={props.t('Time Zone')}
                  value={props.localTimeZone}
                  disabled={!props.notifyAthletes}
                  searchable
                />
              </div>
            )}
            {props.notifyAthletes &&
              window.featureFlags['repeat-reminders'] && (
                <div className="reminderSidePanel__daySelector">
                  <DaySelector
                    label={props.t('Select days')}
                    items={getItems()}
                    onToggle={(day) => props.onChangeScheduleDay(day)}
                  />
                </div>
              )}
          </div>
          <div className="reminderSidePanel__footer">
            <TextButton type="primary" text={props.t('Save')} isSubmit />
          </div>
        </div>
      </FormValidator>
    </SlidingPanel>
  );
};

export default ReminderSidePanel;
export const ReminderSidePanelTranslated = withNamespaces()(ReminderSidePanel);
