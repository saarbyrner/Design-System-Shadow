// @flow
import { withNamespaces } from 'react-i18next';
import Moment from 'moment-timezone';
import classNames from 'classnames';
import { extendMoment } from 'moment-range';
import { InfoTooltip } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  Athlete,
  ExpandedAthlete,
  AvailabilityIssue,
} from '../../../types';
import type { Event } from '../App';

type Props = {
  athletes: Array<Athlete>,
  expandedAthleteData: { string: ExpandedAthlete },
  timeRangeStart: string,
  timeRangeEnd: string,
  orgTimeZone: string,
  sessionDataByAthleteId: {
    string: { games: Event, training_sessions: Event },
  },
};

const SidePanel = (props: I18nProps<Props>) => {
  const moment = extendMoment(Moment);
  // moment is reinitiated because of the use of the library moment-range, so the default
  // setting needs to be reinitiated again
  moment.tz.setDefault(props.orgTimeZone);

  const getDays = () => {
    const startDate = moment(props.timeRangeStart);
    const endDate = moment(props.timeRangeEnd);
    const range = moment.range(startDate.endOf('day'), endDate.endOf('day'));
    return Array.from(range.by('day'));
  };

  const getUnavailableDays = (item: Object) =>
    item.availabilities.filter(
      (availability) =>
        availability === 'unavailable' ||
        availability === 'status_1' ||
        (availability !== 'available' && item.type === 'absence')
    );

  const calculateDaysMissed = (athlete: Athlete) =>
    `${getUnavailableDays(athlete).length} / ${getDays().length}`;

  const calculateGamesMissed = (athleteId: string) =>
    props.sessionDataByAthleteId[athleteId]
      ? `${props.sessionDataByAthleteId[athleteId].games.missed} / ${props.sessionDataByAthleteId[athleteId].games.total}`
      : null;
  const calculateTrainingsMissed = (athleteId: string) =>
    props.sessionDataByAthleteId[athleteId]
      ? `${props.sessionDataByAthleteId[athleteId].training_sessions.missed} / ${props.sessionDataByAthleteId[athleteId].training_sessions.total}`
      : null;

  const calculateDaysMissedPerIssue = (issue: AvailabilityIssue) =>
    `${getUnavailableDays(issue).length} / ${getDays().length}`;

  const calculateMissedDaysPercentage = (athlete: Athlete) =>
    Math.round((getUnavailableDays(athlete).length / getDays().length) * 100);

  const calculateMissedDaysPercentagePerIssue = (issue: AvailabilityIssue) =>
    Math.round((getUnavailableDays(issue).length / getDays().length) * 100);

  const renderExpandedRows = (expandedAthleteData: ExpandedAthlete) => {
    const allIssues = [];
    if (expandedAthleteData.absences.length > 0) {
      expandedAthleteData.absences.forEach((issue) => {
        allIssues.push(issue);
      });
    }
    if (expandedAthleteData.injuries.length > 0) {
      expandedAthleteData.injuries.forEach((issue) => {
        allIssues.push(issue);
      });
    }
    if (expandedAthleteData.illnesses.length > 0) {
      expandedAthleteData.illnesses.forEach((issue) => {
        allIssues.push(issue);
      });
    }
    return (
      allIssues.length > 0 &&
      allIssues.map((issue) => (
        <div
          className="availabilityReportTable__sidePanelRow"
          key={issue.id}
          data-testid="siderow"
        >
          <div
            className="availabilityReportTable__sidePanelCell"
            data-testid="sidecell"
          >
            <span>{calculateDaysMissedPerIssue(issue)}</span>
            <span className="availabilityReportTable__sidePanelPercentage">
              ({calculateMissedDaysPercentagePerIssue(issue)}%)
            </span>
          </div>
          {window.getFlag('missing-games-ts-availability-report') && (
            <>
              <div className="availabilityReportTable__sidePanelCell" />
              <div className="availabilityReportTable__sidePanelCell" />
            </>
          )}
        </div>
      ))
    );
  };

  const renderRows = () => {
    return props.athletes.map((athlete) => (
      <div
        key={athlete.id}
        className={classNames('availabilityReportTable__sidePanelRowWrapper', {
          'availabilityReportTable__sidePanelRowWrapper--expanded':
            Object.keys(props.expandedAthleteData).indexOf(athlete.id) !== -1,
        })}
        data-testid="siderow-wrapper"
      >
        <div className="availabilityReportTable__sidePanelRow">
          <div
            className="availabilityReportTable__sidePanelCell"
            data-testid="sidecell"
          >
            <span>{calculateDaysMissed(athlete)}</span>
            <span className="availabilityReportTable__sidePanelPercentage">
              ({calculateMissedDaysPercentage(athlete)}%)
            </span>
          </div>
          {window.getFlag('missing-games-ts-availability-report') && (
            <>
              <div className="availabilityReportTable__sidePanelCell">
                <span>{calculateGamesMissed(athlete.id)}</span>
                <span className="availabilityReportTable__sidePanelPercentage">
                  {`(${
                    props.sessionDataByAthleteId[athlete.id]?.games?.percentage
                  } %)`}
                </span>
              </div>
              <div className="availabilityReportTable__sidePanelCell">
                <span>{calculateTrainingsMissed(athlete.id)}</span>
                <span className="availabilityReportTable__sidePanelPercentage">
                  {`(${
                    props.sessionDataByAthleteId[athlete.id]?.training_sessions
                      ?.percentage
                  } %)`}
                </span>
              </div>
            </>
          )}
        </div>
        {Object.keys(props.expandedAthleteData).indexOf(athlete.id) !== -1 && (
          <div className="availabilityReportTable__sidePanelRowExpansion">
            {renderExpandedRows(props.expandedAthleteData[athlete.id])}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div
      className={classNames(
        'availabilityReportTable__sidePanel',
        'js-stickyHeaderTable',
        {
          'availabilityReportTable__sidePanel--withGamesAndSessions':
            !!window.getFlag('missing-games-ts-availability-report'),
        }
      )}
    >
      <div
        className={classNames('availabilityReportTable__sidePanelHeader', {
          'availabilityReportTable__sidePanelHeader--withGamesAndSessions':
            !!window.getFlag('missing-games-ts-availability-report'),
        })}
      >
        <div className="availabilityReportTable__sidePanelHeaderCell">
          <InfoTooltip
            placement="top-start"
            content={props.t(
              'Total time lost for each athlete in selected time period'
            )}
          >
            {window.getFlag('missing-games-ts-availability-report') ? (
              <span>{props.t('Unavailability')}</span>
            ) : (
              <i className="availabilityReportTable__sidePanelHeaderIcon icon-clock" />
            )}
          </InfoTooltip>
        </div>
        {window.getFlag('missing-games-ts-availability-report') && (
          <>
            <div className="availabilityReportTable__sidePanelHeaderCell">
              <InfoTooltip
                placement="top-start"
                content={props.t('Games Missed')}
              >
                <span>{props.t('Games Missed')}</span>
              </InfoTooltip>
            </div>
            <div className="availabilityReportTable__sidePanelHeaderCell">
              <InfoTooltip
                placement="top-start"
                content={props.t('Practices Missed')}
              >
                <span>{props.t('Practices Missed')}</span>
              </InfoTooltip>
            </div>
          </>
        )}
      </div>
      <div className="availabilityReportTable__sidePanelSection">
        {renderRows()}
      </div>
    </div>
  );
};

export const SidePanelTranslated = withNamespaces()(SidePanel);
export default SidePanel;
