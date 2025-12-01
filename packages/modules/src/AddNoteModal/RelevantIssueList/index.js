// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import { Checkbox } from '@kitman/components';
import {
  getOsicsPathologyName,
  getSide,
} from '@kitman/common/src/utils/issues';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { NoteData } from '../types';

type Props = {
  type: $PropertyType<NoteData, 'note_type'>,
  injuries: Array<IssueOccurrenceRequested>,
  illnesses: Array<IssueOccurrenceRequested>,
  injuryOsicsPathologies: Array<{ id: string, name: string }>,
  illnessOsicsPathologies: Array<{ id: string, name: string }>,
  sides: Array<{ id: number, name: string }>,
  updateRelevantInjuries: (number) => void,
  updateRelevantIllnesses: (number) => void,
  relevantInjuryIds: Array<?number>,
  relevantIllnessIds: Array<?number>,
  injuryStatuses: InjuryStatuses,
};

const formatDate = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({ date });
  }

  return date.format('D MMM YYYY');
};

const RelevantIssueList = (props: I18nProps<Props>) => {
  const getPathologyName = (issueType, issue) => {
    if (window.featureFlags['emr-multiple-coding-systems']) {
      if (issue?.coding[codingSystemKeys.ICD]) {
        return issue?.coding[codingSystemKeys.ICD].diagnosis;
      }

      if (issue?.coding[codingSystemKeys.DATALYS]) {
        return issue?.coding[codingSystemKeys.DATALYS].pathology;
      }

      if (issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
        return issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS].pathology;
      }
    }

    return getOsicsPathologyName(
      props.injuryOsicsPathologies,
      props.illnessOsicsPathologies,
      issueType,
      issue
    );
  };

  const getRelevantIssues = (issueType) => {
    const issues = issueType === 'INJURY' ? props.injuries : props.illnesses;
    return issues && issues.length > 0 ? (
      issues.map((issue) => {
        const lastEventId = issue.events_order[issue.events_order.length - 1];
        const lastEvent = issue.events.find(
          (event) => event.id === lastEventId
        );
        const firstEvent = issue.events.find(
          (event) => event.id === issue.events_order[0]
        );
        const relevantIssueIds =
          issueType === 'INJURY'
            ? props.relevantInjuryIds
            : props.relevantIllnessIds;
        const isIssueSelected = relevantIssueIds.indexOf(issue.issue_id) !== -1;
        const updateCallback =
          issueType === 'INJURY'
            ? props.updateRelevantInjuries
            : props.updateRelevantIllnesses;
        // The last item in the system is always the closer, it's ID is its position.
        // Can't use ID as the closer event can be different for each system,
        // eg ID 3 might not be a closer for all systems.
        const injuryStatusSystemCloserId = props.injuryStatuses.slice(-1)[0].id;
        return (
          <div
            className="athleteNoteRelevantIssues__relevantIssue"
            key={issue.id}
          >
            <div className="athleteNoteRelevantIssues__checkboxContainer">
              <Checkbox
                id={`isSelectedIssue_${issue.issue_id}`}
                isChecked={isIssueSelected}
                toggle={() => updateCallback(issue.issue_id)}
                name="athleteNoteRelevantIssues__checkbox"
              />
            </div>
            <span className="athleteNoteRelevantIssues__issueDate">
              {firstEvent
                ? formatDate(
                    moment(
                      firstEvent.event_date,
                      DateFormatter.dateTransferFormat
                    )
                  )
                : null}
            </span>
            <span className="athleteNoteRelevantIssues__issueName">
              {getPathologyName(issueType, issue)}
            </span>
            {getSide(
              'athleteNoteRelevantIssues__issueSide',
              props.sides,
              issue.side_id
            )}
            {lastEvent &&
            lastEvent.injury_status_id !== injuryStatusSystemCloserId ? (
              <span className="athleteNoteRelevantIssues__currentLabel">
                {props.t('Current')}
              </span>
            ) : null}
          </div>
        );
      })
    ) : (
      <p className="athleteNoteRelevantIssues__emptyText">
        {props.t('#sport_specific__There_are_no_issues_for_this_athlete.')}
      </p>
    );
  };

  const getRelevantInjuriesForm = () => (
    <div className="athleteNoteRelevantIssues__container">
      <h6>{props.t('Relevant Injuries')}</h6>
      <div className="athleteNoteRelevantIssues__issueContainer checkboxGroup">
        {getRelevantIssues('INJURY')}
      </div>
    </div>
  );

  const getRelevantIllnessesForm = () => (
    <div className="athleteNoteRelevantIssues__container">
      <h6>{props.t('Relevant Illnesses')}</h6>
      <div className="athleteNoteRelevantIssues__issueContainer checkboxGroup">
        {getRelevantIssues('ILLNESS')}
      </div>
    </div>
  );

  switch (props.type) {
    case 1:
      return (
        <div className="athleteNoteRelevantIssues">
          {getRelevantInjuriesForm()}
        </div>
      );
    case 2:
      return (
        <div className="athleteNoteRelevantIssues">
          {getRelevantIllnessesForm()}
        </div>
      );
    case 3:
      return (
        <div className="athleteNoteRelevantIssues">
          {getRelevantInjuriesForm()}
          {getRelevantIllnessesForm()}
        </div>
      );
    default:
      return null;
  }
};

export const RelevantIssueListTranslated = withNamespaces()(RelevantIssueList);
export default RelevantIssueList;
