// @flow
// react/jsx-no-target-blank */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import {
  LegacyModal as Modal,
  RichTextDisplay,
  TextButton,
  Accordion,
  Checkbox,
} from '@kitman/components';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { Grades } from '@kitman/services/src/services/medical/getGrades';
import type {
  TreatmentSession,
  RehabSession,
  Treatment,
} from '@kitman/common/src/types/Treatments';
import {
  getOsicsPathologyName,
  getSide,
} from '@kitman/common/src/utils/issues';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { ActivityGroups } from '@kitman/services/src/services/medical/getActivityGroups';
import _flatten from 'lodash/flatten';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import initAthleteIssueEditor from '../../../athleteIssueEditor';
import { ActivityNameTranslated as ActivityName } from './ActivityName';
import { AthleteMedicationsTranslated as AthleteMedications } from './AthleteMedications';
import { AthleteAvailabilityHistoryDetailsTranslated as AthleteAvailabilityHistoryDetails } from './AthleteAvailabilityHistoryDetails';

import type { IssueStatusOption } from '../../../types/_common';

type Props = {
  athleteName: string,
  issueStatusOptions: Array<IssueStatusOption>,
  currentIssue: IssueOccurrenceRequested,
  osicsPathologies: Array<{ id: string, name: string }>,
  osicsClassifications: Array<{ id: string, name: string }>,
  osicsBodyAreas: Array<{ id: string, name: string }>,
  issueTypes: Array<{ id: string, name: string }>,
  sides: Array<{ id: string, name: string }>,
  positionGroups: Array<Object>,
  activityGroups: ActivityGroups,
  isIssueEditPermitted: boolean,
  periods: Array<Object>,
  periodTerm: string,
  formType: 'INJURY' | 'ILLNESS',
  bamicGrades: Grades,
};

const App = (props: I18nProps<Props>) => {
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isEventDetailSectionOpen, setIsEventDetailSectionOpen] =
    useState(true);
  const [
    isAvailabilityHistorySectionOpen,
    setIsAvailabilityHistorySectionOpen,
  ] = useState(true);
  const [isDiagnosticsSectionOpen, setIsDiagnosticsSectionOpen] =
    useState(false);
  const [isMedicationsSectionOpen, setIsMedicationsSectionOpen] =
    useState(false);
  const [isNotesSectionOpen, setIsNotesSectionOpen] = useState(false);
  const [isTreatmentsSectionOpen, setIsTreatmentsSectionOpen] = useState(false);
  const [isRehabsSectionOpen, setIsRehabsSectionOpen] = useState(false);
  const [isModInfoSectionOpen, setIsModInfoSectionOpen] = useState(false);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const allSectionStates = [
    isEventDetailSectionOpen,
    isAvailabilityHistorySectionOpen,
    isDiagnosticsSectionOpen,
    isMedicationsSectionOpen,
    isNotesSectionOpen,
    isTreatmentsSectionOpen,
    isRehabsSectionOpen,
    isModInfoSectionOpen,
  ];

  const handlePrint = (pdfName: string) => {
    /* $FlowFixMe  */
    document.querySelector('.reactModal__closeBtn').style.display = 'none';
    setIsPrintMode(true);

    const opts = {
      margin: 1,
      filename: pdfName,
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: {
        unit: 'in',
        orientation: 'portrait',
      },
    };

    /* $FlowFixMe  */
    html2pdf()
      .set(opts)
      .from(document.querySelector('.reactModal__content'))
      .save()
      .then(() => {
        setIsPrintMode(false);
        /* $FlowFixMe  */
        document.querySelector('.reactModal__closeBtn').style.display = 'block';
      });
  };

  const getPositionWhenInjured = (positionWhenInjuredId) => {
    let positionWhenInjured = '';
    props.positionGroups.forEach((positionGroup) => {
      positionGroup.positions.forEach((position) => {
        if (position.id === positionWhenInjuredId) {
          positionWhenInjured = position.name;
        }
      });
    });
    return positionWhenInjured;
  };

  const closeModal = () => {
    // To be able to close the modal from outside the React app
    // while keeping it self-contained, unmount it
    ReactDOM.unmountComponentAtNode(
      document.getElementById('athleteIssueDetailsContainer')
    );
    document.removeEventListener('keydown', escClose, false); // eslint-disable-line no-use-before-define
  };

  const escClose = (event: any) => {
    if (event.keyCode === 27) {
      closeModal();
    }
  };
  // because we are mounting the component when the modal "opens",
  // we can't rely on shouldCloseOnEsc prop of the react-modal
  document.addEventListener('keydown', escClose, false);

  const renderOccurrenceMins = () =>
    props.currentIssue.occurrence_min ? (
      <span className="athleteIssueDetails__minutes">{`(${
        props.currentIssue.occurrence_min
      } ${props.t('min')})`}</span>
    ) : null;

  const getActivityTypeName = (activityId) => {
    const activities = _flatten(
      props.activityGroups.map((activityGroup) => activityGroup.activities)
    );
    return activities.find((activity) => activity.id === activityId)?.name;
  };

  const renderActivityType = () => (
    <span>
      {`${getActivityTypeName(props.currentIssue.activity_id)} `}
      {renderOccurrenceMins()}
    </span>
  );

  const renderActivityName = () => {
    return (
      <div className="athleteIssueDetails__cell">
        <span className="athleteIssueDetails__label">
          {props.currentIssue.activity_type === 'game'
            ? props.t('Game')
            : props.t('Training session')}
        </span>
        <ActivityName
          athleteId={props.currentIssue.athlete_id}
          occurrenceDate={props.currentIssue.occurrence_date}
          activityType={props.currentIssue.activity_type}
          gameId={props.currentIssue.game_id}
          trainingSessionId={props.currentIssue.training_session_id}
        />
        {props.currentIssue.session_completed ? (
          <span className="athleteIssueDetails__isCompleted">{` (${props.t(
            'completed'
          )})`}</span>
        ) : null}
      </div>
    );
  };

  const renderPositionWhenInjured = () =>
    props.currentIssue.position_when_injured_id ? (
      <div className="athleteIssueDetails__cell">
        <span className="athleteIssueDetails__label">
          {props.t('#sport_specific__Position_when_Injured')}
        </span>
        <span>
          {getPositionWhenInjured(props.currentIssue.position_when_injured_id)}
        </span>
      </div>
    ) : null;

  const issueStatusOptionsById = () => {
    const optionsLookup = {};
    props.issueStatusOptions.forEach((option) => {
      optionsLookup[option.id] = {
        description: option.description,
        cause_unavailability: option.cause_unavailability,
      };
    });
    return optionsLookup;
  };

  const buildEventsInOrder = () => {
    const events = props.currentIssue.events;
    const issueStatusOptions = issueStatusOptionsById();

    return events.map((event) => ({
      id: event.id,
      date: event.date,
      description: issueStatusOptions[event.injury_status_id]
        ? issueStatusOptions[event.injury_status_id].description
        : '',
      injury_status_id: event.injury_status_id,
      cause_unavailability: issueStatusOptions[event.injury_status_id]
        ? issueStatusOptions[event.injury_status_id].cause_unavailability
        : false,
    }));
  };

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const renderAttachments = (diagnostic) => {
    return (
      <>
        {diagnostic.attachments.map((attachment) => (
          <div
            className="athleteIssueDetails__attachment"
            key={`attachment_${attachment.id}`}
          >
            <i className="icon-attachment" />
            <a
              target="_blank"
              href={attachment.url}
              rel="noreferrer"
            >{`${diagnostic.type} (${attachment.filename})`}</a>
            <span className="athleteIssueDetails__date">{`(${formatDate(
              moment(
                diagnostic.diagnostic_date,
                DateFormatter.dateTransferFormat
              )
            )})`}</span>
            {attachment.audio_file ? (
              <audio // eslint-disable-line jsx-a11y/media-has-caption
                controls
                src={attachment.url}
              >
                {props.t('Your browser does not support embedded audio files.')}
              </audio>
            ) : null}
          </div>
        ))}
        {diagnostic.attached_links.map((attachedLink) => (
          <div
            className="athleteIssueDetails__attachment"
            key={`attachedLink_${attachedLink.id}`}
          >
            <i className="icon-link" />
            <a
              target="_blank"
              href={attachedLink.uri}
              rel="noreferrer"
            >{`${diagnostic.type} (${attachedLink.title})`}</a>
            <span className="athleteIssueDetails__date">{`${props.t(
              'Added by {{name}}',
              { name: attachedLink.created_by.fullname }
            )} (${formatDate(
              moment(
                diagnostic.diagnostic_date,
                DateFormatter.dateTransferFormat
              )
            )})`}</span>
          </div>
        ))}
      </>
    );
  };

  const renderOnlyDiagnostic = (diagnostic) => (
    <div className="athleteIssueDetails__attachment" key={diagnostic.id}>
      <i className="icon-attachment" />
      <span>{diagnostic.type}</span>
      <span className="athleteIssueDetails__date">{`(${formatDate(
        moment(diagnostic.diagnostic_date, DateFormatter.dateTransferFormat)
      )})`}</span>
    </div>
  );

  const renderDiagnostics = () => {
    if (
      !props.currentIssue.diagnostics ||
      props.currentIssue.diagnostics.length === 0
    ) {
      const emptyMessage =
        props.formType === 'INJURY'
          ? props.t(
              'No Diagnostic / Intervention Attachments added to this injury occurrence.'
            )
          : props.t(
              'No Diagnostic / Intervention Attachments added to this illness.'
            );
      return (
        <span className="athleteIssueDetails__emptyMessage">
          {emptyMessage}
        </span>
      );
    }

    return props.currentIssue.diagnostics.map((diagnostic) => {
      if (
        diagnostic.attachments.length === 0 &&
        diagnostic.attached_links.length === 0
      ) {
        return (
          <React.Fragment key={diagnostic.id}>
            {renderOnlyDiagnostic(diagnostic)}
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={diagnostic.id}>
          {renderAttachments(diagnostic)}
        </React.Fragment>
      );
    });
  };

  const renderMedications = () => {
    const emptyMessage =
      props.formType === 'INJURY'
        ? props.t('No Medications added to this injury occurrence.')
        : props.t('No Medications added to this illness.');

    if (
      !props.currentIssue.diagnostics ||
      props.currentIssue.diagnostics.length === 0
    ) {
      return (
        <span className="athleteIssueDetails__emptyMessage">
          {emptyMessage}
        </span>
      );
    }

    return props.currentIssue.diagnostics.map((diagnostic) =>
      diagnostic.is_medication ? (
        <AthleteMedications
          diagnostic={diagnostic}
          emptyMessage={emptyMessage}
          key={`medication_${diagnostic.id}`}
        />
      ) : null
    );
  };

  const formatDateWithTime = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
        showTime: true,
      });
    }

    return date.format('D MMM YYYY, HH:mm a');
  };

  const formatJustTime = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatJustTime(date, true);
    }

    return date.format('HH:mm a');
  };

  const creationDate = formatDateWithTime(
    moment(props.currentIssue.created_at, DateFormatter.dateTransferFormat)
  );

  const renderNotes = () => {
    if (!props.currentIssue.notes || props.currentIssue.notes.length === 0) {
      const emptyMessage =
        props.formType === 'INJURY'
          ? props.t('There are no notes added for this injury occurrence.')
          : props.t('There are no notes added for this illness.');
      return (
        <span className="athleteIssueDetails__emptyMessage">
          {emptyMessage}
        </span>
      );
    }
    return props.currentIssue.notes.map((note) => (
      <div className="athleteIssueDetails__note" key={note.id}>
        <p>{note.note}</p>
        <p>
          {note.restricted || note.psych_only ? (
            <i className="icon-lock" />
          ) : null}
          {` ${formatDateWithTime(
            moment(note.date, DateFormatter.dateTransferFormat)
          )}`}
          <span className="athleteIssueDetails__userName">{` ${props.t(
            'by {{- user}}',
            { user: note.created_by, interpolation: { escapeValue: false } }
          )}`}</span>
        </p>
      </div>
    ));
  };

  const renderModificationInfo = () => {
    if (
      !props.currentIssue.modification_info ||
      props.currentIssue.modification_info === ''
    ) {
      return (
        <span className="athleteIssueDetails__emptyMessage">
          {props.t(
            '#sport_specific__There_are_no_modifications/info_added_for_this_athlete.'
          )}
        </span>
      );
    }
    return (
      <div>
        <p>{props.currentIssue.modification_info}</p>
      </div>
    );
  };

  // flag to prevent the animation from appearing (eg the modal is opened
  // and closed too quickly, before 2 seconds passes)
  let enableLoadingAnimation = false;

  const showLoading = (loaderClassName) => {
    const $loader = $(`.${loaderClassName}`);
    // only show the loading animation if the modal doesn't appear in 2 seconds
    setTimeout(() => {
      if (enableLoadingAnimation) {
        $loader.show();
      }
    }, 2000);
  };

  const hideLoading = (loaderClassName) => {
    enableLoadingAnimation = false;
    $(`.${loaderClassName}`).hide();
  };

  const openIssueEditor = () => {
    const formMode = 'EDIT';
    const formType = props.formType;
    enableLoadingAnimation = true;

    showLoading('js-athleteInjuryEditLoader');
    const athlete = {
      id: props.currentIssue.athlete_id,
      full_name: props.athleteName,
      modification_info: props.currentIssue.modification_info,
    };
    initAthleteIssueEditor(
      formMode,
      formType,
      athlete,
      props.currentIssue.id,
      hideLoading
    );
    closeModal();
  };

  const getOsicsClassification = (classificationId) => {
    const classificationsById = props.osicsClassifications.reduce(
      (hash, classification) => {
        Object.assign(hash, { [classification.id]: classification.name });
        return hash;
      },
      {}
    );
    return classificationsById[classificationId];
  };

  const getOsicsBodyArea = (bodyAreaId) => {
    const bodyAreasById = props.osicsBodyAreas.reduce((hash, bodyArea) => {
      Object.assign(hash, { [bodyArea.id]: bodyArea.name });
      return hash;
    }, {});
    return bodyAreasById[bodyAreaId];
  };

  const getTypeName = (typeId) => {
    const filteredIssueType = props.issueTypes.filter(
      (issueType) => issueType.id === typeId
    )[0];
    return filteredIssueType ? filteredIssueType.name : '';
  };

  const getIssueTypeCell = () => {
    let issueType = '';
    if (props.formType === 'INJURY') {
      issueType = getTypeName(props.currentIssue.type_id);
    } else if (props.formType === 'ILLNESS') {
      issueType = getTypeName(props.currentIssue.onset_id);
    }

    return (
      <div className="athleteIssueDetails__cell">
        <span className="athleteIssueDetails__label">{props.t('Onset')}</span>
        <span>{issueType}</span>
      </div>
    );
  };

  const getBamicCell = () => {
    if (
      window.featureFlags['include-bamic-on-injury'] &&
      props.formType === 'INJURY'
    ) {
      const bamicGrade = props.currentIssue.bamic_grade_id
        ? props.bamicGrades.find(
            ({ id }) => id === props.currentIssue.bamic_grade_id
          )
        : null;
      return (
        <div className="athleteIssueDetails__cell">
          <span className="athleteIssueDetails__label">
            {props.t('Grade (site)')}
          </span>
          <span>
            {bamicGrade ? bamicGrade?.name : ''} (
            {bamicGrade
              ? bamicGrade.sites.find(
                  ({ id }) => id === props.currentIssue.bamic_site_id
                )?.name
              : ''}
            )
          </span>
        </div>
      );
    }

    return null;
  };

  const getPeriodsById = () => {
    const periodsById = {};
    props.periods.forEach((period) => {
      if (!periodsById[period.id]) {
        periodsById[period.id] = period;
      }
    });
    return periodsById;
  };

  const renderPeriod = () => {
    const periodsById = getPeriodsById();
    const period = props.currentIssue.association_period_id
      ? periodsById[props.currentIssue.association_period_id]
      : null;
    return period && window.featureFlags['injury-game-period'] ? (
      <div className="athleteIssueDetails__cell">
        <span className="athleteIssueDetails__label">
          {props.periodTerm || props.t('Period')}
        </span>
        <span>{period.name}</span>
      </div>
    ) : null;
  };

  const renderIssueEventDetails = () =>
    props.formType === 'INJURY' ? (
      <div>
        <div className="athleteIssueDetails__cell">
          <span className="athleteIssueDetails__label">
            {props.t('Activity')}
          </span>
          {renderActivityType()}
        </div>
        {renderActivityName()}
        {renderPeriod()}
        {renderPositionWhenInjured()}
      </div>
    ) : null;

  const renderFooter = () =>
    props.isIssueEditPermitted && !isPrintMode ? (
      <div className="km-datagrid-modalFooter">
        {!props.currentIssue.read_only && (
          <TextButton
            text={props.t('Edit')}
            type="primary"
            onClick={() => openIssueEditor()}
          />
        )}
        {window.featureFlags['print-treatment-rehab-modals'] && (
          <TextButton
            text="Print"
            type="secondary"
            onClick={() =>
              handlePrint(
                `Issue Details - ${props.athleteName} - ${creationDate}.pdf`
              )
            }
          />
        )}
      </div>
    ) : null;

  const renderTitle = () => {
    // the parent issue has at least 1 recurrence and the viewed issue is the first occurrence
    if (
      props.currentIssue.has_recurrence &&
      props.currentIssue.is_first_occurrence
    ) {
      return props.formType === 'INJURY'
        ? props.t('Issue Details (This injury has a Recurrence)')
        : props.t('Issue Details (This illness has a Recurrence)');
    }
    // the parent issue has at least 1 recurrence and the viewed issue is NOT the first occurrence
    if (props.currentIssue.has_recurrence) {
      return props.t('Issue Details (Recurrence)');
    }
    // the parent issue has only 1 occurrence
    return props.t('Issue Details');
  };

  const renderAuthorDetails = () =>
    props.currentIssue.created_by && props.currentIssue.created_by !== '' ? (
      <div className="athleteIssueDetails__creatorDetails">
        {props.t('Added on {{date}} by {{- author}}', {
          date: creationDate,
          author: props.currentIssue.created_by,
          interpolation: { escapeValue: false },
        })}
      </div>
    ) : (
      <div className="athleteIssueDetails__creatorDetails">
        {props.t('Added on {{date}}', {
          date: creationDate,
        })}
      </div>
    );

  const getTreatmentBodyAreas = (sessionAction: Treatment) => {
    return sessionAction.treatment_body_areas.map((bodyArea) => (
      <span
        className="athleteIssueDetails__sessionActionBodyArea"
        key={bodyArea.id}
      >
        {bodyArea.name}
      </span>
    ));
  };

  const renderSessionRows = (session: TreatmentSession | RehabSession) => {
    // $FlowFixMe sessionAction is either treatment or rehab
    const isTreatment = !!session.treatments;
    const sessionActions = isTreatment
      ? // $FlowFixMe sessionAction is either treatment or rehab
        session.treatments
      : // $FlowFixMe sessionAction is either treatment or rehab
        session.rehab_session_exercises;
    // $FlowFixMe sessionAction is either treatment or rehab
    return sessionActions.map((sessionAction, index) => (
      <div
        className="athleteIssueDetails__sessionAction"
        key={sessionAction.id}
      >
        <div className="athleteIssueDetails__sessionActionData">
          <span className="athleteIssueDetails__sessionActionIndex">
            {index + 1}
          </span>
          <div className="athleteIssueDetails__sessionActionDetail">
            <span>
              {isTreatment ? props.t('Modality:') : props.t('Exercise:')}
            </span>
            <span>
              {isTreatment // $FlowFixMe sessionAction is either treatment or rehab
                ? sessionAction.treatment_modality.name // $FlowFixMe sessionAction is either treatment or rehab
                : sessionAction.rehab_exercise.name}
            </span>
          </div>
          {isTreatment && (
            <div className="athleteIssueDetails__sessionActionDetail">
              <span>{props.t('Body Area:')}</span>
              <span>
                {
                  // $FlowFixMe sessionAction is either treatment
                  getTreatmentBodyAreas(sessionAction)
                }
              </span>
            </div>
          )}
          {/* $FlowFixMe sessionAction must have duration if it's a treatment */}
          {isTreatment ? (
            <div className="athleteIssueDetails__sessionActionDetail">
              <span>{props.t('Duration:')}</span>
              {/* $FlowFixMe sessionAction must be treatment here */}
              <span>{`${sessionAction.duration} mins`}</span>
            </div>
          ) : (
            <>
              <div className="athleteIssueDetails__sessionActionDetail">
                <span>{props.t('Sets:')}</span>
                {/* $FlowFixMe sessionAction must be treatment here */}
                <span>{sessionAction.sets}</span>
              </div>
              <div className="athleteIssueDetails__sessionActionDetail">
                <span>{props.t('Reps:')}</span>
                {/* $FlowFixMe sessionAction must be treatment here */}
                <span>{sessionAction.reps}</span>
              </div>
            </>
          )}
          {/* Temporarily hidden */}
          {/* <div className="athleteIssueDetails__sessionActionNoteLink">
            <span>{props.t('View Note')}</span>
          </div> */}
        </div>
        {sessionAction.note && (
          <div className="athleteIssueDetails__sessionActionNote">
            <span>{props.t('Note:')}</span> {sessionAction.note}
          </div>
        )}
      </div>
    ));
  };

  const renderSessionTable = (
    sessionArray: Array<TreatmentSession | RehabSession>
  ) => {
    return sessionArray.map((session) => (
      <div className="athleteIssueDetails__sessionTable" key={session.id}>
        <div className="athleteIssueDetails__sessionTableHeader">
          <span className="athleteIssueDetails__sessionTitle">
            {session.title}
          </span>
          <div className="athleteIssueDetails__sessionPractitioner">
            <span>{props.t('Practitioner:')}</span>
            <span>{session.created_by.fullname}</span>
          </div>
          <div className="athleteIssueDetails__sessionDate">
            <span>{props.t('Date:')}</span>
            <span>
              {`${formatDate(
                moment(session.start_time, DateFormatter.dateTransferFormat)
              )} - ${formatDate(
                moment(session.end_time, DateFormatter.dateTransferFormat)
              )}`}
            </span>
          </div>
          <div className="athleteIssueDetails__sessionTime">
            <span>{props.t('Time:')}</span>
            <span>
              {`${formatJustTime(
                moment(session.start_time, DateFormatter.dateTransferFormat)
              )} - ${formatJustTime(
                moment(session.end_time, DateFormatter.dateTransferFormat)
              )}`}
            </span>
          </div>
          {/* Temporarily hidden */}
          {/* <span className="athleteIssueDetails__sessionNoteLink">
            {props.t('View treatment note')}
          </span> */}
        </div>
        {session.annotation?.content && (
          <div className="athleteIssueDetails__sessionNote">
            <span>{props.t('Note:')}</span>{' '}
            {window.featureFlags['rich-text-editor'] ? (
              <RichTextDisplay
                value={session.annotation?.content}
                isAbbreviated={false}
              />
            ) : (
              session.annotation?.content
            )}
          </div>
        )}
        {renderSessionRows(session)}
      </div>
    ));
  };

  const renderTreatments = () => {
    return (
      window.featureFlags['treatment-on-view-issue'] && (
        <div className="athleteIssueDetails__section athleteIssueDetails__section--treatments">
          {!window.featureFlags['issue-collapsable-reorder'] && (
            <span className="athleteIssueDetails__sectionTitle">
              {props.t('Treatments')}
            </span>
          )}
          {props.currentIssue.treatment_sessions &&
          props.currentIssue.treatment_sessions.length === 0 ? (
            <span className="athleteIssueDetails__emptyMessage">
              {props.t(
                '#sport_specific__There_are_no_treatments_added_for_this_athlete.'
              )}
            </span>
          ) : (
            // $FlowFixMe sessionAction is either treatment or rehab
            renderSessionTable(props.currentIssue.treatment_sessions)
          )}
        </div>
      )
    );
  };

  const renderRehabs = () => {
    return (
      window.featureFlags['rehab-tracker'] && (
        <div className="athleteIssueDetails__section athleteIssueDetails__section--rehabs">
          {!window.featureFlags['issue-collapsable-reorder'] && (
            <span className="athleteIssueDetails__sectionTitle">
              {props.t('Rehab')}
            </span>
          )}
          {!props.currentIssue.rehab_sessions ||
          props.currentIssue.rehab_sessions.length === 0 ? (
            <span className="athleteIssueDetails__emptyMessage">
              {props.t(
                '#sport_specific__There_are_no_rehabs_added_for_this_athlete.'
              )}
            </span>
          ) : (
            // $FlowFixMe sessionAction is either treatment or rehab
            renderSessionTable(props.currentIssue.rehab_sessions)
          )}
        </div>
      )
    );
  };

  const renderExaminationDateDetails = () =>
    props.currentIssue.examination_date && (
      <div className="athleteIssueDetails__examinationDate mt-1">
        {props.t('Examined on {{date}}', {
          date: formatDate(
            moment(
              props.currentIssue.examination_date,
              DateFormatter.dateTransferFormat
            )
          ),
        })}
      </div>
    );

  const getMedications = () =>
    props.currentIssue.diagnostics.filter(
      (diagnostic) => diagnostic.is_medication
    );

  const checkIsAllExpanded = () => {
    const currentState = allSectionStates.filter(
      (sectionState) => sectionState === true
    );
    return currentState.length === allSectionStates.length;
  };

  const expandAllSections = (isChecked: boolean) => {
    setIsEventDetailSectionOpen(isChecked);
    setIsAvailabilityHistorySectionOpen(isChecked);
    setIsDiagnosticsSectionOpen(isChecked);
    setIsMedicationsSectionOpen(isChecked);
    setIsNotesSectionOpen(isChecked);
    setIsTreatmentsSectionOpen(isChecked);
    setIsRehabsSectionOpen(isChecked);
    setIsModInfoSectionOpen(isChecked);
    setIsAllExpanded(isChecked);
  };

  return (
    <div>
      <Modal isOpen width={1024} close={closeModal}>
        <div className="row-fluid athleteIssueDetails">
          <div className="athleteIssueDetails__title">
            {props.athleteName}
            <span>
              &nbsp;
              {renderTitle()}
            </span>
          </div>
          {renderAuthorDetails()}
          {renderExaminationDateDetails()}
          <div
            className={classNames('athleteIssueDetails__section', {
              'athleteIssueDetails__section--sixCells':
                window.featureFlags['include-bamic-on-injury'] &&
                props.formType === 'INJURY',
            })}
          >
            <h5 className="athleteIssueDetails__sectionTitle">
              {props.formType === 'INJURY'
                ? props.t('Nature of Injury')
                : props.t('Nature of Illness')}
            </h5>
            <div className="athleteIssueDetails__cell">
              <span className="athleteIssueDetails__label">
                {props.t('Pathology')}
              </span>
              <span>
                {getOsicsPathologyName(
                  props.osicsPathologies,
                  props.osicsPathologies,
                  props.formType,
                  props.currentIssue
                )}
              </span>
            </div>
            <div className="athleteIssueDetails__cell">
              <span className="athleteIssueDetails__label">
                {props.t('Classification')}
              </span>
              <span>
                {getOsicsClassification(
                  props.currentIssue.osics.osics_classification_id
                )}
              </span>
            </div>
            <div className="athleteIssueDetails__cell">
              <span className="athleteIssueDetails__label">
                {props.t('Body Area')}
              </span>
              <span>
                {getOsicsBodyArea(props.currentIssue.osics.osics_body_area_id)}
                {getSide(
                  'athleteIssueDetails__bodySide',
                  props.sides,
                  props.currentIssue.side_id
                )}
              </span>
            </div>
            <div className="athleteIssueDetails__cell">
              <span className="athleteIssueDetails__label">
                {props.t('Code')}
              </span>
              <div className="athleteIssueDetails__osicsCode">
                OSICS: {props.currentIssue.osics.osics_id || props.t('None')}
              </div>
              <div className="athleteIssueDetails__osicsCode">
                ICD11: {props.currentIssue.osics.icd || props.t('None')}
              </div>
            </div>
            {getIssueTypeCell()}
            {getBamicCell()}
          </div>

          {window.featureFlags['issue-collapsable-reorder'] && (
            <div className="athleteIssueDetails__expandAll">
              <Checkbox
                id="expandAll"
                label={
                  isAllExpanded
                    ? props.t('Collapse All')
                    : props.t('Expand All')
                }
                isChecked={isAllExpanded}
                toggle={(checkbox) => {
                  expandAllSections(checkbox.checked);
                }}
              />
            </div>
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Event Details')}
                  </div>
                }
                key="event_details"
                content={
                  <>
                    <div className="athleteIssueDetails__cell">
                      <span className="athleteIssueDetails__label">
                        {props.formType === 'INJURY'
                          ? props.t('Date of Injury')
                          : props.t('Date of Illness')}
                      </span>
                      <span>
                        {formatDate(
                          moment(
                            props.currentIssue.occurrence_date,
                            DateFormatter.dateTransferFormat
                          )
                        )}
                      </span>
                    </div>
                    {renderIssueEventDetails()}
                  </>
                }
                onChange={() => {
                  setIsEventDetailSectionOpen(!isEventDetailSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isEventDetailSectionOpen}
              />
            </div>
          ) : (
            <div className="athleteIssueDetails__section">
              <h5 className="athleteIssueDetails__sectionTitle">
                {props.t('Event')}
              </h5>
              <div className="athleteIssueDetails__cell">
                <span className="athleteIssueDetails__label">
                  {props.formType === 'INJURY'
                    ? props.t('Date of Injury')
                    : props.t('Date of Illness')}
                </span>
                <span>
                  {formatDate(
                    moment(
                      props.currentIssue.occurrence_date,
                      DateFormatter.dateTransferFormat
                    )
                  )}
                </span>
              </div>
              {renderIssueEventDetails()}
            </div>
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Availability History')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      (
                      {props.t('{{statusChangeSum}} status changes', {
                        statusChangeSum: props.currentIssue.events.length,
                      })}
                      )
                    </span>
                  </div>
                }
                key="availability_history"
                content={
                  <AthleteAvailabilityHistoryDetails
                    eventsDuration={props.currentIssue.events_duration}
                    unavailabilityDuration={
                      props.currentIssue.unavailability_duration
                    }
                    totalDuration={props.currentIssue.total_duration}
                    events={buildEventsInOrder()}
                    isIssueClosed={props.currentIssue.closed}
                  />
                }
                onChange={() => {
                  setIsAvailabilityHistorySectionOpen(
                    !isAvailabilityHistorySectionOpen
                  );
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isAvailabilityHistorySectionOpen}
              />
            </div>
          ) : (
            <div className="athleteIssueDetails__section">
              <AthleteAvailabilityHistoryDetails
                eventsDuration={props.currentIssue.events_duration}
                unavailabilityDuration={
                  props.currentIssue.unavailability_duration
                }
                totalDuration={props.currentIssue.total_duration}
                events={buildEventsInOrder()}
                isIssueClosed={props.currentIssue.closed}
              />
            </div>
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.formType === 'INJURY'
                      ? props.t('Injury Notes')
                      : props.t('Illness Notes')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      ({props.currentIssue.notes.length})
                    </span>
                  </div>
                }
                key="notes"
                content={renderNotes()}
                onChange={() => {
                  setIsNotesSectionOpen(!isNotesSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isNotesSectionOpen}
              />
            </div>
          ) : (
            <div className="athleteIssueDetails__section">
              <span className="athleteIssueDetails__sectionTitle">
                {props.formType === 'INJURY'
                  ? props.t('Injury Notes')
                  : props.t('Illness Notes')}
              </span>
              {renderNotes()}
            </div>
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Treatments')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      (
                      {props.currentIssue.treatment_sessions
                        ? props.currentIssue.treatment_sessions.length
                        : ' - '}
                      )
                    </span>
                  </div>
                }
                key="treatments"
                content={renderTreatments()}
                onChange={() => {
                  setIsTreatmentsSectionOpen(!isTreatmentsSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isTreatmentsSectionOpen}
              />
            </div>
          ) : (
            renderTreatments()
          )}

          {window.featureFlags['issue-collapsable-reorder'] &&
          window.featureFlags['rehab-tracker'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Rehabs')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      ({props.currentIssue.rehab_sessions?.length ?? 0})
                    </span>
                  </div>
                }
                key="rehabs"
                content={renderRehabs()}
                onChange={() => {
                  setIsRehabsSectionOpen(!isRehabsSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isRehabsSectionOpen}
              />
            </div>
          ) : (
            renderRehabs()
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Modifications/Info')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      ({props.currentIssue.modification_info === '' ? 0 : 1})
                    </span>
                  </div>
                }
                key="mod_info"
                content={renderModificationInfo()}
                onChange={() => {
                  setIsModInfoSectionOpen(!isModInfoSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isModInfoSectionOpen}
              />
            </div>
          ) : (
            <div className="athleteIssueDetails__section">
              <span className="athleteIssueDetails__sectionTitle">
                {props.t('Modifications/Info')}
              </span>
              {renderModificationInfo()}
            </div>
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div className="athleteIssueDetails__section athleteIssueDetails__section--accordion">
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Medications')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      ({getMedications().length})
                    </span>
                  </div>
                }
                key="medications"
                content={renderMedications()}
                onChange={() => {
                  setIsMedicationsSectionOpen(!isMedicationsSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isMedicationsSectionOpen}
              />
            </div>
          ) : (
            <div className="athleteIssueDetails__section">
              <span className="athleteIssueDetails__sectionTitle">
                {props.t('Medications')}
              </span>
              {renderMedications()}
            </div>
          )}

          {window.featureFlags['issue-collapsable-reorder'] ? (
            <div
              className={`athleteIssueDetails__section athleteIssueDetails__section--accordion ${
                props.isIssueEditPermitted
                  ? 'athleteIssueDetails__section--last'
                  : 'athleteIssueDetails__section--noFooter'
              }`}
            >
              <Accordion
                title={
                  <div className="athleteIssueDetails__accordionTitle">
                    {props.t('Diagnostic / Intervention Attachments')}
                    <span className="athleteIssueDetails__accordionSubTitle">
                      ({props.currentIssue.diagnostics.length})
                    </span>
                  </div>
                }
                key="diagnostics"
                content={renderDiagnostics()}
                onChange={() => {
                  setIsDiagnosticsSectionOpen(!isDiagnosticsSectionOpen);
                  setIsAllExpanded(checkIsAllExpanded());
                }}
                isOpen={isDiagnosticsSectionOpen}
              />
            </div>
          ) : (
            <div
              className={`athleteIssueDetails__section ${
                props.isIssueEditPermitted
                  ? 'athleteIssueDetails__section--last'
                  : 'athleteIssueDetails__section--noFooter'
              }`}
            >
              <span className="athleteIssueDetails__sectionTitle">
                {props.t('Diagnostic / Intervention Attachments')}
              </span>
              {renderDiagnostics()}
            </div>
          )}

          {renderFooter()}
        </div>
      </Modal>
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
