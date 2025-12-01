// @flow
import { useState, useEffect } from 'react';
import type { Node } from 'react';
import moment from 'moment';

import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  TextButton,
  ToggleSwitch,
  AppStatus,
  LineLoader,
  InfoTooltip,
} from '@kitman/components';
import { savePlayerHasLeftClub } from '@kitman/services';
import type {
  TransferRecord,
  AthleteData,
} from '@kitman/services/src/services/getAthleteData';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import type { RequestStatus } from '../../../../shared/types';

const style = {
  wrapper: css`
    color: ${colors.white};
    position: relative;
  `,
  form: css`
    background: ${colors.grey_200};
    padding: 18px;
    color: ${colors.white};
    display: flex;
    flex-direction: row;
    gap: 8px;
    i {
      &.icon-info-active {
        font-size: 24px;
      }
      &.icon-tick-active {
        font-size: 24px;
      }
    }
    margin-bottom: 8px;
    .toggleSwitch__label {
      margin: 4px 8px 0 0;
      color: ${colors.white};
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }
    .toggleSwitch {
      margin-bottom: 10px;
      width: 100%;
    }
    .toggleSwitch--kitmanDesignSystem .toggleSwitch__slider {
      border-color: ${colors.neutral_400};
      background-color: ${colors.neutral_400};
    }
    .toggleSwitch--kitmanDesignSystem
      .toggleSwitch__input:checked
      + .toggleSwitch__slider {
      border-color: ${colors.grey_100_50};
      background-color: ${colors.grey_100_50};
    }
  `,
  formBeforePlayerLeftClub: css`
    color: ${colors.s18};
    background: ${colors.white};
    border: 1px solid ${colors.neutral_300};

    .toggleSwitch__label {
      color: ${colors.s18};
    }
  `,
  messageWrapper: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  `,
  title: css`
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
  `,
  message: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  `,
  actions: css`
    display: flex;
    flex-direction: row;
    gap: 16px;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};

type Props = {
  issueHasOutstandingFields: boolean,
  playerTransferRecord: TransferRecord,
  athleteData: AthleteData,
};

const UpdateWrapper = (props: {
  shouldDisplayTooltip: boolean,
  tooltipContent: string,
  children: Node,
}) => {
  if (props.shouldDisplayTooltip) {
    return (
      <InfoTooltip content={props.tooltipContent} placement="top">
        <div>{props.children}</div>
      </InfoTooltip>
    );
  }

  return props.children;
};

const PlayerLeftForm = (props: I18nProps<Props>) => {
  const { isIssueTabLoading, updateIssueTabRequestStatus } =
    useIssueTabRequestStatus();

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date });
    }

    return date.format('D MMM YYYY');
  };

  const { issue, updateIssue, issueType } = useIssue();
  const { organisation } = useOrganisation();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [playerLeftClub, setPlayerLeftClub] = useState(issue.player_left_club);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState<boolean>(false);
  const isAthleteOnTrial =
    props.athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE';

  const onClickCancel = () => {
    setIsUpdating(false);
    setPlayerLeftClub(issue.player_left_club);
    setRequestStatus(null);
    updateIssueTabRequestStatus('DORMANT');
  };

  const onClickSave = (): void => {
    setRequestStatus('PENDING');
    updateIssueTabRequestStatus('PENDING');
    savePlayerHasLeftClub({
      athleteId: issue.athlete_id,
      issueOccurenceId: issue.id,
      issueType,
      playerHasLeftClub: playerLeftClub || false,
    })
      .then((response) => {
        setRequestStatus(null);
        updateIssue({
          ...issue,
          player_left_club: response.player_left_club,
        });
        setIsUpdating(false);
        updateIssueTabRequestStatus('DORMANT');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        updateIssueTabRequestStatus('DORMANT');
      });
  };

  useEffect(() => {
    if (
      window.featureFlags['preliminary-injury-illness'] &&
      window.featureFlags['disable-plc-if-outstanding-questions']
    ) {
      if (props.issueHasOutstandingFields) {
        setIsUpdateDisabled(true);
      } else {
        setIsUpdateDisabled(false);
      }
    }
  }, [props.issueHasOutstandingFields]);

  const canRenderActions = issue.organisation_id === organisation.id;
  const displayPlayerLeftClubForAllInjuries =
    window.featureFlags['display-plc-for-all-injuries'] &&
    !props.playerTransferRecord?.left_at;

  const renderUpdateRequiredState = () => {
    return (
      <>
        {!displayPlayerLeftClubForAllInjuries && (
          <div>
            <i className="icon-info-active" />
          </div>
        )}
        <div
          css={style.messageWrapper}
          data-testid="PlayerLeftForm|UpdateRequiredState"
        >
          {!displayPlayerLeftClubForAllInjuries && (
            <div css={style.title}>{props.t('Action Required')}</div>
          )}
          <div css={style.message}>
            {displayPlayerLeftClubForAllInjuries
              ? props.t(
                  'Ensure all statuses are added and mark "Player left Club" if injury not Resolved when player moved'
                )
              : props.t(
                  'Player moved on {{departedDate}}. Update status or mark as player left club.',
                  {
                    departedDate: formatDate(
                      moment(props.playerTransferRecord?.left_at)
                    ),
                  }
                )}
          </div>
        </div>
        {canRenderActions && (
          <div css={style.actions}>
            <UpdateWrapper
              shouldDisplayTooltip={isUpdateDisabled}
              tooltipContent={props.t(
                'Issues cannot be resolved while in a preliminary state'
              )}
            >
              <TextButton
                text={props.t('Update')}
                type="secondary"
                onClick={() => setIsUpdating(true)}
                isDisabled={isUpdateDisabled}
                kitmanDesignSystem
              />
            </UpdateWrapper>
          </div>
        )}
      </>
    );
  };

  const renderUpdatingState = () => {
    return (
      <>
        <div
          css={style.messageWrapper}
          data-testid="PlayerLeftForm|UpdatingState"
        >
          <ToggleSwitch
            label={props.t('Player left club')}
            name="playerHasLeftClubToggle"
            labelPlacement="left"
            kitmanDesignSystem
            isSwitchedOn={playerLeftClub}
            toggle={() => setPlayerLeftClub((value) => !value)}
          />
          <div css={style.message}>
            {props.t(
              'Mark that this injury/illness was unresolved when the player left the club'
            )}
          </div>
        </div>
        {canRenderActions && (
          <div css={style.actions}>
            <TextButton
              text={props.t('Cancel')}
              type="secondary"
              onClick={onClickCancel}
              kitmanDesignSystem
            />
            <TextButton
              text={props.t('Save')}
              type="secondary"
              onClick={onClickSave}
              isDisabled={
                window.featureFlags['disable-parallel-injury-edits']
                  ? isIssueTabLoading
                  : // currently there is no 'disabled state'
                    false
              }
              kitmanDesignSystem
            />
          </div>
        )}
      </>
    );
  };

  const renderHasLeftClubState = () => {
    return (
      <>
        <div>
          <i className="icon-tick-active" />
        </div>
        <div css={style.messageWrapper}>
          <div css={style.title}>{props.t('Player left club')}</div>
        </div>
        {canRenderActions && (
          <div css={style.actions}>
            <TextButton
              text={props.t('Edit')}
              type="secondary"
              onClick={() => setIsUpdating(true)}
              kitmanDesignSystem
            />
          </div>
        )}
      </>
    );
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <div css={style.wrapper}>
      {!isAthleteOnTrial &&
        (playerLeftClub ? (
          <div
            css={[
              style.form,
              displayPlayerLeftClubForAllInjuries &&
                style.formBeforePlayerLeftClub,
            ]}
            data-testid="PlayerLeftForm|LeftClubState"
          >
            {!isUpdating && renderHasLeftClubState()}
            {isUpdating && renderUpdatingState()}
          </div>
        ) : (
          <div
            css={[
              style.form,
              displayPlayerLeftClubForAllInjuries &&
                style.formBeforePlayerLeftClub,
            ]}
            data-testid="PlayerLeftForm|Wrapper"
          >
            {!isUpdating && renderUpdateRequiredState()}
            {isUpdating && renderUpdatingState()}
          </div>
        ))}

      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="IssueDetailsLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </div>
  );
};

export const PlayerLeftFormTranslated = withNamespaces()(PlayerLeftForm);
export default PlayerLeftForm;
