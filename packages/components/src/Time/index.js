// @flow
import { withNamespaces, setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

type Props = {
  mins?: number,
  onSelect: Function,
  limit?: number,
};

const formatTimeHoursMins = (min: number = 0) => {
  let hours = Math.floor(min / 60);
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = min % 60;
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return { hours, minutes };
};

const formatTimeMins = (hours, min) => {
  const minsFromHours = Math.floor(parseInt(hours, 10) * 60);
  return minsFromHours + parseInt(min, 10);
};

const Time = (props: I18nProps<Props>) => {
  const hours = [];
  const hoursAvailable = props.limit || 23;

  for (let i = 0; i <= hoursAvailable; i++) {
    let y = i.toString();
    if (y.length === 1) {
      y = `0${y}`;
    }
    hours.push(y);
  }

  const time = formatTimeHoursMins(props.mins);

  return (
    <div className="timeSelector">
      <div className="timeSelector__hours">
        <div className="dropdown customDropdown _customDropdown">
          <button
            className="btn btn-default"
            type="button"
            data-toggle="dropdown"
            data-flip="false"
            aria-haspopup="true"
            aria-expanded="true"
          >
            <div className="timeSelector__content">
              <span className="timeSelector__digits">{time.hours}</span>
              <span className="timeSelector__timeunit">{props.t('hrs')}</span>
              <span className="caret customDropdown__caret" />
            </div>
          </button>
          <ul
            className="dropdown-menu customDropdown__menu"
            aria-labelledby="timeDropdown"
          >
            {hours.map((hour) => (
              <li key={`hour_${hour}`}>
                <span
                  className="customDropdown__textwrap"
                  onClick={() =>
                    props.onSelect(formatTimeMins(hour, time.minutes))
                  }
                >
                  {hour}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="timeSelector__mins">
        <div className="dropdown customDropdown _customDropdown ">
          <button
            className="btn btn-default"
            type="button"
            data-toggle="dropdown"
            data-flip="false"
            aria-haspopup="true"
            aria-expanded="true"
          >
            <div className="timeSelector__content">
              <span className="timeSelector__digits">{time.minutes}</span>
              <span className="timeSelector__timeunit">{props.t('mins')}</span>
              <span className="caret customDropdown__caret" />
            </div>
          </button>
          <ul
            className="dropdown-menu customDropdown__menu"
            aria-labelledby="timeDropdown"
          >
            {['00', '15', '30', '45'].map((mins) => (
              <li key={`min_${mins}`}>
                <span
                  className="customDropdown__textwrap"
                  onClick={() =>
                    props.onSelect(formatTimeMins(time.hours, mins))
                  }
                >
                  {mins}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Time;
export const TimeTranslated = withNamespaces()(Time);
