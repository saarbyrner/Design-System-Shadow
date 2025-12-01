// @flow
import { withNamespaces } from 'react-i18next';
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';

type Props = {
  timeRangeStart: string,
  timeRangeEnd: string,
  orgTimeZone: string,
};

const Header = (props: Props) => {
  const moment = extendMoment(Moment);
  // moment is reinitiated because of the use of the library moment-range, so the default
  // setting needs to be reinitiated again
  moment.tz.setDefault(props.orgTimeZone);

  const renderDates = () => {
    const startDate = moment(props.timeRangeStart);
    const endDate = moment(props.timeRangeEnd);
    const range = moment.range(startDate.endOf('day'), endDate.endOf('day'));
    const days = Array.from(range.by('day'));

    return days.map((day, index) => {
      if (
        days[index - 1] &&
        day.get('month') !== days[index - 1].get('month')
      ) {
        return (
          <div
            className="availabilityReportTable__headerCell"
            key={`date_${day.format()}`}
          >
            {days[index - 1] &&
            day.get('year') !== days[index - 1].get('year') ? (
              <span>
                {moment(day).format('DD')}
                <br />
                <span className="availabilityReportTable__month">
                  {moment(day).format('MMM YYYY')}
                </span>
              </span>
            ) : (
              <span>
                {moment(day).format('DD')}
                <br />
                <span className="availabilityReportTable__month">
                  {moment(day).format('MMM')}
                </span>
              </span>
            )}
          </div>
        );
      }
      return (
        <div
          className="availabilityReportTable__headerCell"
          key={`date_${day.format()}`}
        >
          <span>{moment(day).format('DD')}</span>
        </div>
      );
    });
  };

  return (
    <div className="availabilityReportTable__cellContainer js-scrollableTable__header">
      {renderDates()}
    </div>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
