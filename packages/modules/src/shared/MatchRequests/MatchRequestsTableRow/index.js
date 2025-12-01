// @flow

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import { useState } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { IconButton, TextButton, Checkbox } from '@kitman/components';
import { Chip } from '@kitman/playbook/components';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import FallbackCrest from '@kitman/modules/src/shared/FixtureScheduleView/FallbackCrest';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';
import requestStyles from '../styles';
import { SimpleAttachmentUploadModalTranslated as SimpleAttachmentUploadModal } from '../../SimpleAttachmentUploadModal';

type Props = {
  isSelected: boolean,
  setIsSelected: (isSelected: boolean) => void,
  userEventRequest: UserEventRequest,
  rowApiRequestStatus: string,
  isLastRow: boolean,
  updateUserEventRequests: ({
    actionType: string,
    requestId: number,
    reason?: string,
    attachment?: ?AttachedFile,
  }) => void,
  onRejectRequest: (number) => void,
};

const MatchRequestsTableRow = (props: I18nProps<Props>) => {
  const [uploadedFile, setUploadedFile] = useState<?AttachedFile>(null);
  const [isUploadModalForScoutOpen, setIsUploadModalForScoutOpen] =
    useState(false);

  const { trackEvent } = useEventTracking();

  const renderRequestStatusActionCell = () => {
    if (props.userEventRequest.status === userEventRequestStatuses.approved)
      return <Chip color="success" label={props.t('Approved')} />;

    if (props.userEventRequest.status === userEventRequestStatuses.denied) {
      return <Chip color="error" label={props.t('Rejected')} />;
    }

    if (!props.userEventRequest?.editable) {
      return <div>{props.t('Pending')}</div>;
    }

    return (
      <div className="status-action-area">
        <TextButton
          text={props.t('Approve')}
          kitmanDesignSystem
          type="primary"
          onClick={() => {
            props.updateUserEventRequests({
              actionType: userEventRequestStatuses.approved,
              requestId: props.userEventRequest.id,
            });
            trackEvent(
              leagueOperationsEventNames.scoutAccessApproved,
              getScoutAccessTrackingData({
                product: 'league-ops',
                productArea: 'scout-access-management',
                feature: 'scout-access-management',
              })
            );
          }}
          isDisabled={props.rowApiRequestStatus === 'LOADING'}
        />
        <TextButton
          text={props.t('Reject')}
          kitmanDesignSystem
          type="destruct"
          onClick={() => {
            props.onRejectRequest(props.userEventRequest.id);
            trackEvent(
              leagueOperationsEventNames.scoutAccessRejected,
              getScoutAccessTrackingData({
                product: 'league-ops',
                productArea: 'scout-access-management',
                feature: 'scout-access-management',
              })
            );
          }}
          isDisabled={props.rowApiRequestStatus === 'LOADING'}
        />
      </div>
    );
  };

  const renderRequestAttachmentAction = () => {
    if (!props.userEventRequest?.editable) {
      return (
        <>
          <a
            href={props.userEventRequest?.attachment?.url}
            download={props.userEventRequest?.attachment?.filename}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton
              type="textOnly"
              icon="icon-export"
              isSmall
              isBorderless
              isDarkIcon
              testId="download-file-button"
            />
          </a>
        </>
      );
    }

    return (
      <TextButton
        onClick={() =>
          props.updateUserEventRequests({
            actionType: 'UPLOAD',
            attachment: null,
            requestId: props.userEventRequest.id,
          })
        }
        iconBefore="icon-bin"
        type="subtle"
        kitmanDesignSystem
      />
    );
  };

  const renderMatchInformationCell = () => {
    if (props.userEventRequest.attachment) {
      return (
        <>
          <span className="matchRequestsFileName">
            {props.userEventRequest.attachment.filename}
          </span>
          {renderRequestAttachmentAction()}
        </>
      );
    }

    if (!props.userEventRequest?.editable) {
      return <div>-</div>;
    }

    return (
      <TextButton
        type="secondary"
        text={props.t('Upload')}
        iconAfter="icon-upload"
        kitmanDesignSystem
        onClick={() => setIsUploadModalForScoutOpen(true)}
      />
    );
  };

  const externalScout = props.userEventRequest?.external_scout;
  const fullName =
    props.userEventRequest.is_external && externalScout
      ? `${externalScout.scout_name} ${externalScout.scout_surname}`
      : props.userEventRequest.user.fullname;
  const reviewDate = props.userEventRequest.reviewed_at;
  return (
    <>
      <div css={requestStyles.matchRequestTableRow}>
        <div css={requestStyles.checkbox} data-table-cell="scoutName">
          <Checkbox.New
            id={`selected-event-${props.userEventRequest.id}`}
            checked={props.isSelected}
            onClick={() => props.setIsSelected(!props.isSelected)}
          />
        </div>
        <div css={requestStyles.mediumCellSize} data-table-cell="scoutName">
          <p>{fullName}</p>
        </div>
        <div css={requestStyles.largeCellSize} data-table-cell="teamName">
          {props.userEventRequest.user.organisations[0].logo_full_path ? (
            <img
              src={props.userEventRequest.user.organisations[0].logo_full_path}
              alt="scout flag"
              className="team-flag"
            />
          ) : (
            <FallbackCrest />
          )}
          <p>{props.userEventRequest.user.organisations[0].name}</p>
        </div>
        <div css={requestStyles.smallCellSize} data-table-cell="requestDate">
          <p>
            {moment(props.userEventRequest.created_at).format('MMM DD, YYYY')}
          </p>
        </div>
        <div css={requestStyles.mediumCellSize} data-table-cell="requestTime">
          <p>{moment(props.userEventRequest.created_at).format('HH:MM A')}</p>
        </div>
        <div css={requestStyles.smallCellSize} data-table-cell="reviewDate">
          <p>{reviewDate ? moment(reviewDate).format('MMM DD, YYYY') : null}</p>
        </div>
        <div css={requestStyles.mediumCellSize} data-table-cell="reviewTime">
          <p>{reviewDate ? moment(reviewDate).format('HH:MM A') : null}</p>
        </div>
        <div css={requestStyles.largeCellSize}>
          {renderRequestStatusActionCell()}
        </div>
        <div
          css={requestStyles.mediumCellSize}
          data-table-cell="matchInfoUpload"
        >
          {renderMatchInformationCell()}
        </div>
      </div>
      {!props.isLastRow && <hr />}
      <SimpleAttachmentUploadModal
        isOpen={isUploadModalForScoutOpen}
        onClose={() => setIsUploadModalForScoutOpen(false)}
        onUpload={(file) => {
          props.updateUserEventRequests({
            actionType: 'UPLOAD',
            attachment: file,
            requestId: props.userEventRequest.id,
          });
          setIsUploadModalForScoutOpen(false);
        }}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        uploadButtonText={props.t('Upload welcome pack information')}
      />
    </>
  );
};

export const MatchRequestsTableRowTranslated: ComponentType<Props> =
  withNamespaces()(MatchRequestsTableRow);
export default MatchRequestsTableRow;
