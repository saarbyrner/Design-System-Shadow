// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { Link } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  Athlete,
  AvailabilityIssue,
  ExpandedAthlete,
} from '../../../types';

type Props = {
  athletes: Array<Athlete>,
  canViewIssues: boolean,
  canViewAbsence: boolean,
  rightShadowPos: number,
  expandedAthleteData: { string: ExpandedAthlete },
  onExpandAthleteClick: Function,
};

const SideBar = (props: I18nProps<Props>) => {
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

    const url = (issueType: $PropertyType<AvailabilityIssue, 'type'>) => {
      switch (issueType) {
        case 'absence':
          return `/athletes/${expandedAthleteData.id}/absences`;
        case 'illness':
          return `/athletes/${expandedAthleteData.id}/illnesses`;
        default:
          return `/athletes/${expandedAthleteData.id}/injuries`;
      }
    };

    return (
      allIssues.length > 0 &&
      allIssues.map((issue) => {
        // if you have the permission to view athletes, you have to have access to absences
        if (issue.type !== 'absence' && !props.canViewIssues) {
          return (
            <div className="availabilityReportTable__sideBarRow" key={issue.id}>
              <span>{props.t('Medical Issue')}</span>
              <span
                className="availabilityReportTable__sideBarRowShadow"
                style={{ right: -props.rightShadowPos }}
              />
            </div>
          );
        }
        if (issue.type === 'absence' && !props.canViewAbsence) {
          return (
            <div className="availabilityReportTable__sideBarRow" key={issue.id}>
              <span>{props.t('Absence')}</span>
              <span
                className="availabilityReportTable__sideBarRowShadow"
                style={{ right: -props.rightShadowPos }}
              />
            </div>
          );
        }
        return (
          <div
            className="availabilityReportTable__sideBarRow"
            key={issue.id}
            data-testid="sidebar-row"
          >
            <i
              className={classNames('availabilityReportTable__sideBarRowIcon', {
                'icon-calendar': issue.type === 'absence',
                'icon-healthcare': issue.type === 'injury',
                'icon-thermometer': issue.type === 'illness',
              })}
            />
            <Link href={url(issue.type)} title={issue.title}>
              {issue.title}
            </Link>
            <span
              className="availabilityReportTable__sideBarRowShadow"
              style={{ right: -props.rightShadowPos }}
            />
          </div>
        );
      })
    );
  };

  const renderSideBarRows = () => {
    const expandedAthleteIds = Object.keys(props.expandedAthleteData);
    return props.athletes.map((athlete) => (
      <div
        className={classNames('availabilityReportTable__sideBarRow', {
          'availabilityReportTable__sideBarRow--expanded':
            expandedAthleteIds.indexOf(athlete.id) !== -1,
        })}
        key={athlete.id}
        data-testid="sidebar-row"
      >
        <div className="availabilityReportTable__athlete">
          {athlete.availabilities.indexOf('unavailable') !== -1 ||
          athlete.availabilities.indexOf('medical_attention') !== -1 ? (
            <span
              className="availabilityReportTable__athleteOpener"
              onClick={() => props.onExpandAthleteClick(athlete.id)}
            >
              <i className="icon-next-right" data-testid="icon-next-right" />
              {athlete.full_name}
            </span>
          ) : (
            <span>{athlete.full_name}</span>
          )}
        </div>
        {expandedAthleteIds.indexOf(athlete.id) !== -1 && (
          <div className="availabilityReportTable__sideBarRowExpansion">
            {renderExpandedRows(props.expandedAthleteData[athlete.id])}
          </div>
        )}
        <span
          className="availabilityReportTable__sideBarRowShadow"
          style={{ right: -props.rightShadowPos }}
        />
      </div>
    ));
  };

  return (
    <div className="availabilityReportTable__sideBar">
      <div className="availabilityReportTable__sideBarSection">
        {renderSideBarRows()}
      </div>
    </div>
  );
};

export const SideBarTranslated = withNamespaces()(SideBar);
export default SideBar;
