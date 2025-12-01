// @flow
import { useState, useContext, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import $ from 'jquery';
import { TrackEvent } from '@kitman/common/src/utils';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import Tippy from '@tippyjs/react';
import moment from 'moment-timezone';
import {
  AppStatus,
  InfoTooltip,
  RichTextDisplay,
  TooltipMenu,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getTimePeriodName,
  getCalculations,
} from '@kitman/common/src/utils/status_utils';
import type { StatusVariable } from '@kitman/common/src/types';
import ReorderHandle from './SortHandle';
import { StatusFormTranslated as StatusForm } from './StatusForm';
import PermissionsContext from '../../contexts/PermissionsContext';
import TimezonesContext from '../../contexts/TimezonesContext';
import type { Status as StatusType, User } from '../../types';

type Props = {
  assessmentId: number,
  selectedAthlete: number,
  status: StatusType,
  onClickDeleteStatus: Function,
  onClickSaveStatus: Function,
  users: Array<User>,
  statusVariables: Array<StatusVariable>,
  onClickStatusHeader: Function,
  showNotes: boolean,
  showReordering: boolean,
  isCurrentSquad: boolean,
};

const Status = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const timezones = useContext(TimezonesContext);
  const [requestStatus, setRequestStatus] = useState(null);
  const [statusValue, setStatusValue] = useState(null);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [showEditStatusForm, setShowEditStatusForm] = useState(false);

  const selectedVariable = useMemo(
    () =>
      props.statusVariables.find(
        (variable) =>
          variable.source_key ===
          `${props.status.source}|${props.status.variable}`
      ),
    [props.status]
  );

  /*
    When window.featureFlags['assessments-multiple-athletes'] is false, isCurrentSquad should be always false
    because when this FF is disabled, we consume the old endpoint: /ASSESSMENTS/SEARCH that does not retrieve
    the required squad data to compare with the current squad
  */
  const isCurrentSquad =
    !window.featureFlags['assessments-multiple-athletes'] ||
    (window.featureFlags['assessments-multiple-athletes'] &&
      props.isCurrentSquad);

  const isAssessmentGroups =
    window.featureFlags['assessments-multiple-athletes'];

  useEffect(() => {
    setStatusValue(null);
    setRequestStatus('PENDING');

    $.ajax({
      url: `/${isAssessmentGroups ? 'assessment_groups' : 'assessments'}/${
        props.assessmentId
      }/statuses/calculate_value`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        source: props.status.source,
        variable: props.status.variable,
        summary: props.status.summary,
        period_scope: props.status.period_scope,
        period_length: props.status.period_length,
        ...(isAssessmentGroups
          ? {
              athlete_id: props.selectedAthlete,
            }
          : {}),
      }),
    })
      .done((data) => {
        setRequestStatus(null);
        setStatusValue(data.value || '-');
      })
      .fail(() => {
        setRequestStatus('FAILURE');
      });
  }, [props.status]);

  const getCalculationName = () => {
    const summaryName = getCalculations()[props.status.summary]?.title;
    const timePeriodName = getTimePeriodName(
      props.status.period_scope,
      null,
      props.status.period_length
    );

    return `${summaryName} - ${timePeriodName}`;
  };

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
        showTime: true,
      });
    }

    return date.format('DD MMM YYYY [@] h:mm a');
  };

  return (
    <>
      <div className="assessmentsStatus">
        <header
          className={classnames('assessmentsStatus__header', {
            'assessmentsStatus__header--expandable':
              props.status.notes[0].note?.content,
          })}
        >
          {props.showReordering && <ReorderHandle />}

          <div
            className="assessmentsStatus__info"
            onClick={props.onClickStatusHeader}
          >
            <h2 className="assessmentsStatus__name">
              {selectedVariable?.name}
            </h2>

            <div className="assessmentsStatus__user">
              {props.status.notes[0].users[0]?.fullname}
            </div>

            <div className="assessmentsStatus__noteIcon">
              {props.status.notes[0].note?.content && (
                <span className="icon-comment" />
              )}
            </div>

            <div
              className={classnames('assessmentsStatus__score', {
                'assessmentsStatus__score--loading':
                  requestStatus === 'PENDING',
              })}
            >
              {requestStatus !== 'FAILURE' && (
                <Tippy
                  placement="top-end"
                  content={
                    <div className="assessmentsTooltip">
                      <div className="assessmentsTooltip__title">
                        {props.t('Calculation')}
                      </div>
                      <div className="assessmentsTooltip__text">
                        {getCalculationName()}
                      </div>
                    </div>
                  }
                  theme="blue-border-tooltip"
                >
                  <div className="assessmentsStatus__value">{statusValue}</div>
                </Tippy>
              )}

              {requestStatus === 'FAILURE' && (
                <InfoTooltip
                  placement="top-start"
                  content={props.t(
                    'An error occured when retrieving the score. Reload the page to try again.'
                  )}
                  errorStyle
                >
                  <div className="icon-error assessmentsStatus__fetchScoreError" />
                </InfoTooltip>
              )}
            </div>
          </div>

          {isCurrentSquad && (
            <TooltipMenu
              placement="bottom-start"
              offset={[0, 0]}
              menuItems={[
                {
                  description: props.t('Edit'),
                  onClick: () => {
                    setShowEditStatusForm(true);
                    TrackEvent('assessments', 'click', 'edit status');
                  },
                  isDisabled:
                    !permissions.editAssessment &&
                    !permissions.answerAssessment,
                },
                {
                  description: props.t('Delete'),
                  onClick: () => {
                    setShowConfirmDeletion(true);
                    TrackEvent('assessments', 'click', 'delete status');
                  },
                  isDestructive: true,
                  isDisabled: !permissions.deleteAssessment,
                },
              ]}
              tooltipTriggerElement={
                <button
                  type="button"
                  className={classnames('assessmentsStatus__dropdownMenuBtn', {
                    'assessmentsStatus__dropdownMenuBtn--disabled':
                      props.showReordering,
                  })}
                >
                  <i className="icon-more" />
                </button>
              }
              disabled={props.showReordering}
              kitmanDesignSystem
            />
          )}
        </header>

        {!showEditStatusForm &&
          props.showNotes &&
          props.status.notes[0].note?.content && (
            <div className="assessmentsStatus__noteContainer">
              <div className="assessmentsStatus__note">
                <header>
                  <h3 className="assessmentsStatus__noteTitle">
                    {props.t('Comment')}
                  </h3>
                  {isCurrentSquad && (
                    <div
                      className={classnames('assessmentsStatus__editButton', {
                        'assessmentsStatus__editButton--disabled':
                          !permissions.answerAssessment,
                      })}
                      onClick={() => {
                        if (!permissions.answerAssessment) {
                          return;
                        }
                        setShowEditStatusForm(true);
                      }}
                    >
                      {props.t('Edit')}
                    </div>
                  )}
                </header>
                <div className="assessmentsStatus__noteMeta">
                  {window.featureFlags['assessment-who-answered'] &&
                    props.status.notes[0].note.edit_history &&
                    props.t('{{date}} by {{user}}', {
                      date: formatDate(
                        moment.tz(
                          // $FlowFixMe edit_history exists at this point
                          props.status.notes[0].note.edit_history.date,
                          timezones.orgTimezone
                        )
                      ),
                      user:
                        // $FlowFixMe edit_history exists at this point
                        props.status.notes[0].note.edit_history.user.fullname,
                      interpolation: { escapeValue: false },
                    })}
                </div>
                {window.featureFlags['rich-text-editor'] ? (
                  <RichTextDisplay
                    value={props.status.notes[0].note.content}
                    isAbbreviated={false}
                  />
                ) : (
                  <div className="assessmentsStatus__noteText">
                    {props.status.notes[0].note.content}
                  </div>
                )}
              </div>
            </div>
          )}

        {showConfirmDeletion && (
          <AppStatus
            status="warning"
            message={props.t('Delete status?')}
            secondaryMessage={props.t(
              'Deleting this status will delete any note and user.'
            )}
            deleteAllButtonText={props.t('Delete')}
            hideConfirmation={() => {
              setShowConfirmDeletion(false);
            }}
            confirmAction={() => {
              setShowConfirmDeletion(false);
              props.onClickDeleteStatus();
            }}
          />
        )}
      </div>

      {showEditStatusForm && (
        <StatusForm
          assessmentId={props.assessmentId}
          selectedAthlete={props.selectedAthlete}
          status={props.status}
          onClickSaveStatus={(status) => {
            setShowEditStatusForm(false);
            props.onClickSaveStatus(status);
          }}
          onClickClose={() => {
            setShowEditStatusForm(false);
          }}
          users={props.users}
          statusVariables={props.statusVariables}
        />
      )}
    </>
  );
};

export default Status;
export const StatusTranslated = withNamespaces()(Status);
