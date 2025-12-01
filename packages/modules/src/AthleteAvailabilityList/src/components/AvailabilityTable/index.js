// @flow
import { useLayoutEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import {
  injuryDetailsLinkClickHandler,
  illnessDetailsLinkClickHandler,
} from '@kitman/common/src/utils/issue_modals';
import {
  AvailabilityLabel,
  TooltipMenu,
  RichTextDisplay,
} from '@kitman/components';
import type { GroupBy } from '@kitman/common/src/types/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TrackEvent } from '@kitman/common/src/utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { IssueStatusOption } from '@kitman/modules/src/AthleteInjury/types/_common';
import IssueList from '../IssueList';
import type { Athlete } from '../../../types';

type Props = {
  athletes: ?{ [string]: Array<Athlete> },
  groupOrderingByType: { [GroupBy]: Array<string> },
  groupBy: GroupBy,
  groupingLabels: { string: string },
  absenceReasons: Array<{ id: number, reason: string, order: number }>,
  issueStatusOptions: Array<IssueStatusOption>,
  canViewIssues: boolean,
  canManageIssues: boolean,
  canViewAbsences: boolean,
  canManageAbsences: boolean,
  canManageMedicalNotes: boolean,
  canViewNotes: boolean,
  groupAvailability: { string: number },
  isNoteModalOpen: boolean,
  isModInfoModalOpen: boolean,
  openAddAbsenceModal: (Athlete) => void,
  openAddNoteModal: (Athlete) => void,
  openModInfoModal: (Athlete) => void,
  openRTPModal: (Athlete) => void,
  openDiagnosticModal: (Athlete) => void,
  openTreatmentModal: Function,
};

const AvailabilityTable = (props: I18nProps<Props>) => {
  useLayoutEffect(() => {
    injuryDetailsLinkClickHandler();
    illnessDetailsLinkClickHandler();
  }, [props.groupOrderingByType[props.groupBy]]);

  // It's easier to wrap the entire menu around the feature flag
  // then wrap the feature flag around each item. It makes for easier removal
  const renderNewMenu = (athlete: Athlete) => {
    const baseUrl = `/medical/athletes/${athlete.id}`;

    const menuItems = [];

    const getAddIssueItem = {
      description: props.t('Add Injury/Illness'),
      href: baseUrl,
    };

    if (props.canManageIssues) {
      menuItems.push(getAddIssueItem);
    }

    const getAddAbsenceItem = (
      <li
        className="tooltipMenu__listItem"
        onClick={() => {
          TrackEvent('availability', 'click', 'add absence');
          props.openAddAbsenceModal(athlete);
        }}
      >
        <span className="tooltipMenu__item">{props.t('Add Absence')}</span>
      </li>
    );

    if (props.canManageAbsences) {
      menuItems.push(getAddAbsenceItem);
    }

    const getAddNoteItem = {
      description: props.t('Add Note'),
      href: `${baseUrl}#medical_notes`,
    };

    if (props.canManageIssues) {
      menuItems.push(getAddNoteItem);
    }

    const getAddTreatmentItem = {
      description: props.t('Add Treatment'),
      href: `${baseUrl}#treatments`,
    };

    if (props.canManageMedicalNotes && props.canViewNotes) {
      menuItems.push(getAddTreatmentItem);
    }

    const getDiagnosticModalItem = {
      description: props.t('Add Diagnostic/Intervention'),
      href: `${baseUrl}#diagnostics`,
    };

    if (
      window.featureFlags['add-diagnostics-from-availability-sheet'] &&
      props.canManageIssues
    ) {
      menuItems.push(getDiagnosticModalItem);
    }

    const getChangeModificationInfo = {
      description: props.t('Change Modification/Info'),
      href: `${baseUrl}#modifications`,
    };

    const getUpdateRTPDateItem = {
      description: props.t('Update RTP date'),
      onClick: () => props.openRTPModal(athlete),
    };

    const viewIssuesItems = props.canViewIssues
      ? [
          {
            description: props.t('View Injuries'),
            href: `${baseUrl}`,
          },
          {
            description: props.t('View Illnesses'),
            href: `${baseUrl}`,
          },
        ]
      : [];

    const viewAbsenceItem = {
      description: props.t('View Absences'),
      href: `/athletes/${athlete.id}/absences`,
    };

    if (props.canViewAbsences) {
      menuItems.push(viewAbsenceItem);
    }

    return (
      <TooltipMenu
        placement="bottom-start"
        offset={[10, 14]}
        tooltipTriggerElement={<i className="icon-more" />}
        menuItems={[
          getAddIssueItem,
          getAddNoteItem,
          getAddTreatmentItem,
          getDiagnosticModalItem,
          getChangeModificationInfo,
          getUpdateRTPDateItem,
          ...viewIssuesItems,
          viewAbsenceItem,
        ]}
        externalItem={<>{getAddAbsenceItem}</>}
        externalItemOrder={0}
      />
    );
  };

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const renderAthleteRTP = (athlete: Athlete) => {
    if (athlete.rtp) {
      const twoWeeksAgo = moment().subtract(14, 'days');
      const rtpDate = moment(athlete.rtp);
      return rtpDate.isBefore(twoWeeksAgo)
        ? null
        : formatDate(moment(athlete.rtp, DateFormatter.dateTransferFormat));
    }

    return null;
  };

  const renderAthleteRows = (athletesInGroup) =>
    athletesInGroup.map((athlete) => (
      <div className="availabilityTable__row" key={athlete.id}>
        <div className="availabilityTable__cell availabilityTable__cell--name">
          <a
            className="availabilityTable__athleteName"
            href={`/athletes/${athlete.id}`}
          >
            {athlete.fullname}
          </a>
          <div className="availabilityTable__athleteAvailability">
            <AvailabilityLabel status={athlete.availability} />
            {athlete.availability !== 'available' ? (
              <span className="availabilityTable__unavailabilityLength">
                {athlete.unavailable_since}
              </span>
            ) : null}
          </div>
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--issues">
          <div className="availabilityTableIssues">
            {athlete.injuries?.length > 0 ||
            athlete.illnesses?.length > 0 ||
            athlete.absences?.length > 0 ? (
              <IssueList
                athlete={athlete}
                absenceReasons={props.absenceReasons}
                issueStatusOptions={props.issueStatusOptions}
                canViewIssues={props.canViewIssues}
                canManageIssues={props.canManageIssues}
                canViewAbsences={props.canViewAbsences}
              />
            ) : null}
          </div>
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--modinfo">
          {
            // Render RichTextDisplay for those with FF enabled, otherwise the default output
            window.featureFlags['rich-text-editor'] ? (
              <RichTextDisplay
                value={athlete.modification_info}
                isAbbreviated={false}
              />
            ) : (
              athlete?.modification_info
            )
          }
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--rtp">
          {renderAthleteRTP(athlete)}
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--menu">
          {renderNewMenu(athlete)}
        </div>
      </div>
    ));

  const renderAvailabilityLabel = (group) => {
    return props.groupBy === 'availability' ? (
      // when groupBy is 'availability' the groups can only
      // be 'available', 'unavailable', 'injured', 'returning'
      <AvailabilityLabel status={group} displayText={false} />
    ) : null;
  };

  const renderGroupAvailabilityPercentage = (group) =>
    props.groupBy === 'position' || props.groupBy === 'positionGroup' ? (
      <span className="availabilityTable__groupAvailability">
        {`(${props.groupAvailability[group]}%)`}
      </span>
    ) : null;

  const renderAthleteGroups = () =>
    props.groupOrderingByType[props.groupBy].map((group) => {
      const athletesInGroup = props.athletes ? props.athletes[group] : [];
      return athletesInGroup && athletesInGroup.length > 0 ? (
        <div className="availabilityTable__group" key={group}>
          <div className="availabilityTable__groupHeader">
            {renderAvailabilityLabel(group)}
            <span className="availabilityTable__groupHeaderName">
              {props.groupingLabels[group] || group}:
            </span>
            <span className="availabilityTable__groupCount">
              {athletesInGroup.length}
            </span>
            {renderGroupAvailabilityPercentage(group)}
          </div>
          {renderAthleteRows(athletesInGroup)}
        </div>
      ) : null;
    });

  return (
    <div className="availabilityTable">
      <div className="availabilityTable__header">
        <div className="availabilityTable__cell availabilityTable__cell--name">
          <span>{props.t('#sport_specific__Athlete')}</span>
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--issues">
          <span>{props.t('Issues')}</span>
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--modinfo">
          <span>{props.t('Modification/Info')}</span>
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--rtp">
          <span>{props.t('RTP')}</span>
        </div>
        <div className="availabilityTable__cell availabilityTable__cell--menu" />
      </div>
      {renderAthleteGroups()}
    </div>
  );
};

export default AvailabilityTable;
export const AvailabilityTableTranslated = withNamespaces()(AvailabilityTable);
