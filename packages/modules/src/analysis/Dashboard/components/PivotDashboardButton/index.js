// @flow
import { InfoTooltip } from '@kitman/components';

type Props = {
  athletesText: string,
  onClick?: Function,
  datesText: string,
  defaultText: string,
  id?: ?string,
  isDisabled?: boolean,
};

const PivotDashboardButton = (props: Props) => {
  const getAthleteText = () => {
    const athleteTextArr = props.athletesText.split(', ');
    if (athleteTextArr) {
      if (athleteTextArr.length === 1) {
        return athleteTextArr[0];
      }

      return athleteTextArr.length;
    }

    return '';
  };

  return (
    <button
      type="button"
      id={props.id || null}
      className="pivotDashboardButton textButton--kitmanDesignSystem textButton--kitmanDesignSystem--secondary"
      onClick={props.onClick}
      disabled={props.isDisabled}
    >
      {props.datesText ? (
        <div className="pivotDashboardButton__datesSection">
          <span className="pivotDashboardButton__datesIcon icon-calendar" />
          <span className="pivotDashboardButton__selectedDates">
            {props.datesText}
          </span>
        </div>
      ) : null}
      {props.datesText && props.athletesText ? (
        <span className="pivotDashboardButton__dividerLine" />
      ) : null}
      {props.athletesText ? (
        <InfoTooltip content={props.athletesText}>
          <div className="pivotDashboardButton__athletesSection">
            <span className="pivotDashboardButton__athletesIcon icon-athletes" />
            <span className="pivotDashboardButton__selectedAthletes">
              {getAthleteText()}
            </span>
          </div>
        </InfoTooltip>
      ) : null}
      {!props.athletesText && !props.datesText ? props.defaultText : null}
    </button>
  );
};

export default PivotDashboardButton;
