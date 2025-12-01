// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { TimePicker } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSettings } from '../utils/hooks';
import styles, { dayHoursError } from '../utils/styles';
import { checkHoursValidity } from '../utils/helpers';
import type { CheckFormValidtyForField } from '../utils/types';

type Props = { checkFormValidity: CheckFormValidtyForField };

type TranslatedProps = I18nProps<Props>;
const DayHours = ({ t, checkFormValidity }: TranslatedProps) => {
  const { settings: dayStartingHour, setSettings: setDayStartingHour } =
    useSettings('dayStartingHour');
  const { settings: dayEndingHour, setSettings: setDayEndingHour } =
    useSettings('dayEndingHour');

  const transformDate = (dateTime: moment) => {
    const timeSource = moment(dateTime);

    const formattedTime = timeSource.format(DateFormatter.dateTransferFormat);
    return formattedTime;
  };

  const dayStartingHourMoment = moment(dayStartingHour);
  const dayEndingHourMoment = moment(dayEndingHour);

  const areHoursInvalid = !checkHoursValidity({
    dayEndingHour: dayEndingHourMoment,
    dayStartingHour: dayStartingHourMoment,
  });
  return (
    <div css={[styles.dayHoursContainer, areHoursInvalid ? dayHoursError : {}]}>
      <TimePicker
        name="start_time"
        value={dayStartingHourMoment}
        label={t('Day starts at')}
        onChange={(value) => {
          if (!value) return;
          const transformedDate = transformDate(value);
          setDayStartingHour(transformedDate);
          checkFormValidity();
        }}
        kitmanDesignSystem
      />
      <TimePicker
        name="end_time"
        value={dayEndingHourMoment}
        label={t('Day ends at')}
        onChange={(value) => {
          if (!value) return;
          const transformedDate = transformDate(value);
          setDayEndingHour(transformedDate);
          checkFormValidity();
        }}
        kitmanDesignSystem
      />
    </div>
  );
};

export const DayHoursTranslated = withNamespaces()(DayHours);
export default DayHours;
