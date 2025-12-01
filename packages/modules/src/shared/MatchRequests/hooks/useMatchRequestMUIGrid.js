/* eslint-disable camelcase */
// @flow
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment-timezone';
import { IconButton, TextButton } from '@kitman/components';
import { Box, Chip, Stack, Typography } from '@kitman/playbook/components';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import type {
  UserEventRequest,
  TransformedUserEventRequest,
} from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';
import FallbackCrest from '../../FixtureScheduleView/FallbackCrest';
import { getScoutAccessActionsHeader } from '../../FixtureScheduleView/grid/headerConfig';
import { menuButtonTypes } from '../../FixtureScheduleView/helpers';
import type { MenuButtonModalInfo } from '../../FixtureScheduleView/types';

type SetRejectRequestModalParams = {
  isOpen: boolean,
  requestIds: Array<number> | null,
};

type UseMatchRequestMUIGrid = {
  rowApiRequestStatus: string,
  userEventRequests: Array<UserEventRequest>,
  handleUserEventStatusActionUpdate: Function,
  setRejectRequestModal: (params: SetRejectRequestModalParams) => void,
  handleUserEventRequestAttachmentUpdate: (
    requestIds: Array<number> | null,
    uploadedFile: ?AttachedFile
  ) => Promise<void>,
  handleSetMenuButtonAction?: (data: MenuButtonModalInfo) => void,
};

export const useMatchRequestMUIGrid = ({
  rowApiRequestStatus,
  userEventRequests,
  handleUserEventStatusActionUpdate,
  setRejectRequestModal,
  handleUserEventRequestAttachmentUpdate,
  handleSetMenuButtonAction,
}: UseMatchRequestMUIGrid) => {
  const { organisationId } = useLeagueOperations();
  const { trackEvent } = useEventTracking();

  const renderAccessRequests = (request: TransformedUserEventRequest) => {
    if (request.status === userEventRequestStatuses.approved)
      return <Chip color="success" label={i18n.t('Approved')} />;

    if (request.status === userEventRequestStatuses.denied) {
      return <Chip color="error" label={i18n.t('Rejected')} />;
    }

    if (request.status === userEventRequestStatuses.expired) {
      return <Chip color="primary" label={i18n.t('Expired')} />;
    }

    if (!request.editable) {
      return <Chip color="secondary" label={i18n.t('Pending')} />;
    }

    return (
      <div className="status-action-area">
        <TextButton
          text={i18n.t('Approve')}
          kitmanDesignSystem
          type="primary"
          onClick={() => {
            handleUserEventStatusActionUpdate({
              status: userEventRequestStatuses.approved,
              requestIds: [request.id],
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
          isDisabled={rowApiRequestStatus === 'LOADING'}
        />
        <TextButton
          text={i18n.t('Reject')}
          kitmanDesignSystem
          type="destruct"
          onClick={() => {
            setRejectRequestModal({ isOpen: true, requestIds: [request.id] });
            trackEvent(
              leagueOperationsEventNames.scoutAccessRejected,
              getScoutAccessTrackingData({
                product: 'league-ops',
                productArea: 'scout-access-management',
                feature: 'scout-access-management',
              })
            );
          }}
          isDisabled={rowApiRequestStatus === 'LOADING'}
        />
      </div>
    );
  };

  const renderTeamInfoCell = (row: TransformedUserEventRequest) => (
    <Stack flexDirection="row" alignItems="center" gap={1}>
      {row?.teamIcon ? (
        <img src={row?.teamIcon} alt={row?.team} width={30} />
      ) : (
        <FallbackCrest />
      )}
      <Typography sx={{ whiteSpace: 'pre-line' }}>{row?.team}</Typography>
    </Stack>
  );

  const renderRequestAttachmentAction = (
    request: TransformedUserEventRequest
  ) => {
    if (!request?.editable) {
      return (
        <a
          href={request?.attachment?.url}
          download={request?.attachment?.filename}
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
      );
    }

    return (
      <TextButton
        onClick={() => {
          handleUserEventRequestAttachmentUpdate([request.id], null);
        }}
        iconBefore="icon-bin"
        type="subtle"
        kitmanDesignSystem
      />
    );
  };

  const renderScoutAttachmentField = (request: TransformedUserEventRequest) => {
    if (request.attachment) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {request.attachment.filename}
          </Typography>

          {renderRequestAttachmentAction(request)}
        </Box>
      );
    }

    return <div>-</div>;
  };

  const columns = [
    {
      field: 'scout',
      headerName: i18n.t('Scout'),
      flex: 0.75,
      sortable: false,
    },
    {
      field: 'team',
      headerName: i18n.t('Team'),
      flex: 0.75,
      sortable: false,
      renderCell: ({ row }: { row: TransformedUserEventRequest }) =>
        renderTeamInfoCell(row),
    },
    {
      field: 'requestDate',
      headerName: i18n.t('Request date'),
      flex: 0.75,
      sortable: false,
    },
    {
      field: 'requestTime',
      headerName: i18n.t('Request time'),
      flex: 0.75,
      sortable: false,
    },
    {
      field: 'reviewDate',
      headerName: i18n.t('Review date'),
      flex: 0.75,
      sortable: false,
    },
    {
      field: 'reviewTime',
      headerName: i18n.t('Review time'),
      flex: 0.75,
      sortable: false,
    },
    {
      field: 'accessRequests',
      headerName: i18n.t('Access requests'),
      flex: 1,
      sortable: false,
      renderCell: ({ row }: { row: TransformedUserEventRequest }) =>
        renderAccessRequests(row),
    },
    {
      field: 'scoutAttachment',
      headerName: i18n.t('Scout attachment'),
      flex: 1,
      sortable: false,
      renderCell: ({ row }: { row: TransformedUserEventRequest }) =>
        renderScoutAttachmentField(row),
    },
    getScoutAccessActionsHeader({ doesHaveExternalAccessActions: false }),
  ];

  const rows: Array<TransformedUserEventRequest> = userEventRequests.map(
    ({
      id,
      external_scout,
      is_external,
      user,
      created_at,
      reviewed_at,
      status,
      editable = false,
      attachment,
    }) => {
      const isRequestWithdrawlable =
        status === userEventRequestStatuses.approved ||
        status === userEventRequestStatuses.pending;
      const isRequestUserSameOrgAsAdmin =
        user?.organisations[0]?.id === organisationId;

      const isActionsVisible =
        isRequestUserSameOrgAsAdmin && isRequestWithdrawlable;
      return {
        id,
        scout:
          is_external && external_scout
            ? `${external_scout.scout_name} ${external_scout.scout_surname}`
            : user.fullname,
        team: user.organisations[0].name,
        teamIcon: user.organisations[0].logo_full_path,
        requestDate: moment(created_at).format('MMM DD, YYYY'),
        requestTime: moment(created_at).format('HH:mm A'),
        reviewDate: reviewed_at
          ? moment(reviewed_at).format('MMM DD, YYYY')
          : '',
        reviewTime: reviewed_at ? moment(reviewed_at).format('HH:mm A') : '',
        status,
        editable,
        attachment,
        actions: {
          isVisible: isActionsVisible,
          handleMenuButtonAction: () =>
            handleSetMenuButtonAction?.({ id, type: menuButtonTypes.withdraw }),
        },
      };
    }
  );

  return {
    columns,
    rows,
  };
};
