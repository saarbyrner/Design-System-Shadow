// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { getEventName } from '@kitman/common/src/utils/workload';
import type { InjuryMechanisms } from '@kitman/services/src/services/medical/getInjuryMechanisms';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { IssueContactTypes } from '@kitman/services/src/services/medical/getIssueContactTypes';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import PresentationViewItem from '@kitman/modules/src/Medical/shared/components/PresentationViewItem';
import { useIssue } from '../../../../shared/contexts/IssueContext';

import {
  getInjuryMechanismLabel,
  getFreetextValue,
  getIssueContactParentChildLabel,
  isInfoEvent,
} from '../../../../shared/utils';
import style from './styles/presentationView';

type Props = {
  isFieldVisible: Function,
  getFieldLabel: Function,
  injuryMechanisms: InjuryMechanisms,
  issueDate: string,
  organisation: Organisation,
  reportedDate: string,
  issueContactTypes: IssueContactTypes,
  highlightEmptyFields?: boolean,
};

const PresentationView = (props: I18nProps<Props>) => {
  const { issue, isChronicIssue, isContinuationIssue } = useIssue();

  const getGameName = () => {
    if (issue.game) {
      return getEventName(issue.game.event);
    }
    return props.t('Unlisted Game');
  };

  const getTrainingSessionName = () =>
    issue.training_session
      ? getEventName(issue.training_session.event)
      : props.t('Unlisted Training Session');

  const getOtherName = () => props.t('Other');

  const isGameOrTraining =
    isInfoEvent(issue.activity_type) && issue.activity_type;
  const isOtherEvent = issue.activity_type === 'other';
  const isNFLInjuryFlowFields = window.featureFlags['nfl-injury-flow-fields'];
  const codingSystemIsCI =
    props.organisation?.coding_system_key ===
    codingSystemKeys.CLINICAL_IMPRESSIONS;

  const renderReportedDateField = () => {
    return (
      <li>
        <PresentationViewItem
          label={props.t('Reported date')}
          value={DateFormatter.formatStandard({
            date: moment(props.reportedDate),
          })}
          highlightEmptyFields={props.highlightEmptyFields}
        />
      </li>
    );
  };

  const getTimeValue = () => {
    const difference = moment(issue.occurrence_date).diff(
      moment(issue.occurrence_date).startOf('day')
    );

    // Assuming a value at the start of the day is no time set
    if (difference === 0) {
      return '';
    }

    return DateFormatter.formatJustTime(moment(issue.occurrence_date));
  };

  const primaryMechanismFreetext = getFreetextValue(
    issue,
    'primary_mechanisms'
  );
  const presentationFreeText = getFreetextValue(issue, 'presentation_types');
  const primaryActivityFreetext = getFreetextValue(issue, 'injury_mechanisms');
  const issueContactFreeText = getFreetextValue(issue, 'issue_contact_types');

  const shouldRenderReportDateField = () => {
    return !isChronicIssue || props.isFieldVisible('reported_date');
  };

  const shouldRenderDateOfInjuryDatePicker =
    window.featureFlags['pm-editing-examination-and-date-of-injury'] !== true ||
    codingSystemIsCI;

  const getIssueDatesFields = () => (
    <>
      {shouldRenderDateOfInjuryDatePicker && (
        <li>
          <PresentationViewItem
            label={
              isChronicIssue ? props.t('Onset date') : props.t('Date of injury')
            }
            value={DateFormatter.formatStandard({
              date: moment(props.issueDate),
            })}
            highlightEmptyFields={props.highlightEmptyFields}
          />
        </li>
      )}
      {isNFLInjuryFlowFields &&
        shouldRenderReportDateField() &&
        renderReportedDateField()}
    </>
  );

  if (isContinuationIssue) {
    let disclaimerText = '';
    switch (issue.activity_type) {
      case 'game':
        disclaimerText = props.t('Game from a previous organization');
        break;
      case 'training':
        disclaimerText = props.t(
          'Training session from a previous organization'
        );
        break;
      default:
        disclaimerText = props.t('Other event from a previous organization');
    }

    return (
      <ul css={style.details}>
        {getIssueDatesFields()}
        <li
          style={{
            gridColumn: '1 / 4',
          }}
        >
          <PresentationViewItem
            label={props.t('Event information')}
            value={disclaimerText}
            highlightEmptyFields={props.highlightEmptyFields}
          />
        </li>
      </ul>
    );
  }

  const getEventIssueActivityTypeName = (issueActivityType) => {
    // TODO: FE strings here are bad practice. Refactor needed to get names from getGameAndTrainingOptions service
    switch (issueActivityType) {
      case 'game':
        return getGameName();
      case 'training':
        return getTrainingSessionName();
      case 'other':
        return getOtherName();
      case 'nonfootball':
        return props.t('Not Club Football-Related');
      case 'nonsport':
        return props.t('Not club activity');
      case 'prior':
        return isNFLInjuryFlowFields
          ? props.t('Injury Occurred Prior to/Outside of NFL')
          : props.t('Injury occurred prior to this club');
      default:
        return '';
    }
  };

  const renderFreetextInfo = (freetextLabel: string, freetextValue: string) => (
    <li>
      <PresentationViewItem
        label={props.t('Other - {{freetextLabel}}', { freetextLabel })}
        value={freetextValue}
        highlightEmptyFields={props.highlightEmptyFields}
      />
    </li>
  );

  const renderNFLView = () => (
    <>
      <li>
        <PresentationViewItem
          label={props.t('Position')}
          value={issue.position_when_injured}
          highlightEmptyFields={props.highlightEmptyFields}
        />
      </li>
      {props.isFieldVisible('presentation_type') && (
        <li>
          <PresentationViewItem
            label={props.t('Presentation')}
            value={issue.presentation_type?.name}
            highlightEmptyFields={props.highlightEmptyFields}
          />
        </li>
      )}
      {props.isFieldVisible('presentation_type') &&
        !!presentationFreeText &&
        renderFreetextInfo('Presentation', presentationFreeText)}
      {props.isFieldVisible('issue_contact_type') && (
        <li>
          <PresentationViewItem
            label={props.t('Contact Type')}
            value={getIssueContactParentChildLabel(
              props.issueContactTypes,
              issue.issue_contact_type
            )}
            highlightEmptyFields={props.highlightEmptyFields}
          />
        </li>
      )}
      {props.isFieldVisible('issue_contact_type') &&
        !!issueContactFreeText &&
        renderFreetextInfo('Contact Type', issueContactFreeText)}
      {props.isFieldVisible('injury_mechanism') && (
        <li>
          <PresentationViewItem
            label={props.getFieldLabel('injury_mechanism')}
            value={getInjuryMechanismLabel(
              issue.injury_mechanism_id,
              props.injuryMechanisms
            )}
            highlightEmptyFields={props.highlightEmptyFields}
          />
        </li>
      )}
      {props.isFieldVisible('injury_mechanism') &&
        primaryActivityFreetext &&
        renderFreetextInfo(
          props.getFieldLabel('injury_mechanism'),
          primaryActivityFreetext
        )}
      <li>
        <PresentationViewItem
          label={props.t(
            'Additional description of injury mechanism/circumstances'
          )}
          value={issue.mechanism_description}
        />
      </li>
    </>
  );

  const renderNonNFLView = () => (
    <>
      {props.isFieldVisible('session_completed') &&
        !window.featureFlags['chronic-conditions-updates'] && (
          <li>
            <PresentationViewItem
              label={props.t('Session completed')}
              value={issue.session_completed ? props.t('Yes') : props.t('No')}
            />
          </li>
        )}
      {isGameOrTraining && !isOtherEvent && (
        <>
          <li>
            <PresentationViewItem
              label={props.t('Position')}
              value={issue.position_when_injured}
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
          <li>
            <PresentationViewItem
              label={props.t('Time of injury')}
              value={
                window.featureFlags['injury-onset-time-selector']
                  ? getTimeValue()
                  : issue.occurrence_min
              }
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
        </>
      )}
    </>
  );

  return (
    <ul css={style.details}>
      {getIssueDatesFields()}
      {(!isChronicIssue ||
        !window.featureFlags['chronic-conditions-updated-fields']) && (
        <>
          <li>
            <PresentationViewItem
              label={props.t('Event')}
              value={getEventIssueActivityTypeName(issue.activity_type)}
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
          {(isGameOrTraining || isOtherEvent) && (
            <>
              <li>
                <PresentationViewItem
                  label={props.t('Mechanism')}
                  value={issue.activity}
                  highlightEmptyFields={props.highlightEmptyFields}
                />
              </li>
              {isNFLInjuryFlowFields &&
                primaryMechanismFreetext &&
                renderFreetextInfo('Mechanism', primaryMechanismFreetext)}
            </>
          )}
          {isNFLInjuryFlowFields && isGameOrTraining
            ? renderNFLView()
            : renderNonNFLView()}
        </>
      )}
    </ul>
  );
};

export const PresentationViewTranslated = withNamespaces()(PresentationView);
export default PresentationView;
