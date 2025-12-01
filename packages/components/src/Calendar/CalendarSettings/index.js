// @flow
import { useEffect, type ComponentType, useContext, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { ReactReduxContext, useDispatch } from 'react-redux';
import moment from 'moment';

import { SlidingPanel, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  WeekStartDayTranslated as WeekStartDay,
  DayHoursTranslated as DayHours,
  DefaultEventDurationTranslated as DefaultEventDuration,
} from './components';
import { fetchSettings } from './redux/slices/settings';
import { useUpdateSettingsMutation } from './redux/services/settings';
import styles from './utils/styles';
import { reducerKey } from './redux/consts';
import type { Settings } from './redux/types';
import { calendarSettingsTabHref, settingsButtonTestId } from './utils/consts';
import {
  checkDefaultEventDurationValidity,
  checkWeekStartDayValidity,
  checkHoursValidity,
} from './utils/helpers';

type Props = {
  isPanelOpen: boolean,
  togglePanel: () => void,
};
export type TranslatedProps = I18nProps<Props>;

const CalendarSettings = ({ t, isPanelOpen, togglePanel }: TranslatedProps) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const dispatch = useDispatch();
  const [updateSettings] = useUpdateSettingsMutation();
  const { store } = useContext(ReactReduxContext);

  useEffect(() => {
    fetchSettings(dispatch);
  }, [dispatch]);

  const getFormValues = () => store.getState()[reducerKey];

  const checkFormValidity = () => {
    const {
      defaultEventDurationMins,
      weekStartDay,
      dayEndingHour,
      dayStartingHour,
    }: Settings = getFormValues();
    const isFormValidLocal =
      checkWeekStartDayValidity(weekStartDay) &&
      checkDefaultEventDurationValidity(defaultEventDurationMins) &&
      checkHoursValidity({
        dayEndingHour: moment(dayEndingHour),
        dayStartingHour: moment(dayStartingHour),
      });

    setIsFormValid(isFormValidLocal);
  };

  return (
    <SlidingPanel
      isOpen={isPanelOpen}
      title={t('Calendar Settings')}
      kitmanDesignSystem
      width={460}
      togglePanel={togglePanel}
    >
      <div css={styles.settingsContainer}>
        <WeekStartDay checkFormValidity={checkFormValidity} />
        <DayHours checkFormValidity={checkFormValidity} />
        <DefaultEventDuration checkFormValidity={checkFormValidity} />
      </div>
      <div css={styles.actionButtonsContainer}>
        <a href={calendarSettingsTabHref} data-testid={settingsButtonTestId}>
          <TextButton
            kitmanDesignSystem
            iconAfter="icon-arrow-right"
            text={t('Advanced settings')}
            type="subtle"
          />
        </a>
        <TextButton
          text={t('Save')}
          onClick={() => updateSettings(getFormValues())}
          kitmanDesignSystem
          type="primary"
          isDisabled={!isFormValid}
        />
      </div>
    </SlidingPanel>
  );
};

export const CalendarSettingsTranslated: ComponentType<Props> =
  withNamespaces()(CalendarSettings);
export default CalendarSettings;
