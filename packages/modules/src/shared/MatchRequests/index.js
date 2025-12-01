// @flow
import { useEffect, useState, Fragment } from 'react';
import type { ComponentType } from 'react';
import structuredClone from 'core-js/stable/structured-clone';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  AppStatus,
  Checkbox,
  DelayedLoadingFeedback,
} from '@kitman/components';
import { DataGrid } from '@kitman/playbook/components';
import getPlanningHubEvent from '@kitman/modules/src/PlanningHub/src/services/getPlanningHubEvent';
import type { ToastDispatch } from '@kitman/components/src/Toast/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import type { Option } from '@kitman/components/src/Select';
import {
  getUserEventRequests,
  updateUserEventRequest,
  getUserEventRequestRejectReasons,
  bulkUpdateEventRequests,
} from '@kitman/services';
import { useMatchRequestMUIGrid } from '@kitman/modules/src/shared/MatchRequests/hooks/useMatchRequestMUIGrid';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';
import matchStyles from '../MatchReport/styles';
import {
  getMatchReportEventName,
  formatMatchReportDate,
} from '../MatchReport/src/utils/matchReportUtils';
import { MatchRequestsTableRowTranslated as MatchRequestsTableRow } from './MatchRequestsTableRow';
import { MatchRequestRejectModalTranslated as MatchRequestRejectModal } from './MatchRequestRejectModal';
import requestStyles from './styles';
import { getFileInfo } from '../../KitMatrix/shared/utils';
import { FixtureActionModalTranslated as FixtureActionModal } from '../FixtureScheduleView/FixtureActionModal';
import type { MenuButtonModalInfo } from '../FixtureScheduleView/types';
import useScoutRequestAccess from '../FixtureScheduleView/hooks/useScoutRequestAccess';
import { MatchRequestsToolbarTranslated } from './MatchRequestsToolbar';
import { UploadFileModalTranslated } from './UploadFileModal';
import { menuButtonTypes } from '../FixtureScheduleView/helpers';

type Props = {
  eventId: number,
  toastDispatch: ToastDispatch<ToastAction>,
};

const DISABLED_BULK_STATUSES = [
  userEventRequestStatuses.denied,
  userEventRequestStatuses.rejected,
];

const MAX_TOASTS_PER_EVENT = 5;

const MatchRequests = (props: I18nProps<Props>) => {
  const { eventId, toastDispatch, t } = props;
  const { trackEvent } = useEventTracking();

  const { handleCancelUserEventRequestApi } = useScoutRequestAccess();
  const shouldAllowApprovedRejectedStatusesToBeChanged = window.getFlag(
    'league-ops-change-scout-request'
  );

  const [event, setEvent] = useState<?Object>();
  const [userEventRequests, setUserEventRequests] = useState<
    Array<UserEventRequest>
  >([]);
  const [eventRequestStatus, setEventRequestStatus] =
    useState<string>('PENDING');
  const [rowApiRequestStatus, setRowApiRequestStatus] = useState('SUCCESS');
  const [rejectReasonOptions, setRejectReasonOptions] = useState([]);
  const [rejectRequestModal, setRejectRequestModal] = useState<{
    isOpen: boolean,
    requestIds: Array<number> | null,
  }>({
    isOpen: false,
    requestIds: null,
  });
  const [menuButtonActionInfo, setMenuButtonActionInfo] =
    useState<MenuButtonModalInfo>({
      id: null,
      type: '',
    });
  const [isProcessingMenuButtonAction, setIsProcessingMenuButtonAction] =
    useState(false);
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean,
    requestIds: Array<number> | null,
  }>({
    isOpen: false,
    requestIds: null,
  });
  const [selectedIds, setSelectedIds] = useState<Array<number>>([]);
  const isRequestLoading = rowApiRequestStatus === 'LOADING';

  // Temporary flag until we test the new MUI grid
  const renderMUIGrid = window.getFlag('league-ops-matchday-lineup-refactor');

  const isBulkModeActive = userEventRequests.some(
    (userRequest) => userRequest.editable
  );

  useEffect(() => {
    if (eventId)
      getPlanningHubEvent({
        eventId,
        showAthletesAndStaff: true,
        supervisorView: true,
      })
        .then(async (eventResponse: Object) => {
          setEvent(eventResponse.event);

          const results = await getUserEventRequests({ eventId });
          setUserEventRequests(results);

          const rejectReasonResults = await getUserEventRequestRejectReasons();
          setRejectReasonOptions(getSelectOptions(rejectReasonResults));

          setEventRequestStatus('SUCCESS');
        })
        .catch(() => setEventRequestStatus('FAILURE'));
  }, [eventId]);

  const refreshUserEventRequests = async () => {
    try {
      const results = await getUserEventRequests({ eventId });
      setUserEventRequests(results);
    } catch {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: t('Failed to refresh match requests.'),
          status: 'ERROR',
        },
      });
    }
  };

  const showSuccessToasts = (requestIds: Array<number>, status: string) => {
    const translatedAction =
      status === userEventRequestStatuses.approved
        ? t('approved')
        : t('rejected');

    if (requestIds.length > MAX_TOASTS_PER_EVENT) {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: t(`Requests has been {{action}}.`, {
            action: translatedAction,
          }),
          status: 'SUCCESS',
        },
      });
    }

    requestIds.forEach((requestId) => {
      const foundEvent = userEventRequests.find(
        (item) => item.id === requestId
      );

      if (!foundEvent) {
        return;
      }

      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: requestId,
          title: t('{{userName}} request has been {{action}}.', {
            userName: `${foundEvent.user.firstname} ${foundEvent.user.lastname}`,
            action: translatedAction,
          }),
          status: 'SUCCESS',
        },
      });
    });
  };

  const localUpdateEventRequests = ({
    requestIds,
    updates,
  }: {
    requestIds: number[],
    updates: {
      rejectOption?: Option,
      status?: string,
      attachment?: Object | null,
    },
  }) => {
    const updatedRequests = structuredClone(userEventRequests).map(
      (request) => {
        const shouldBeUpdated = requestIds.includes(request.id);
        if (!shouldBeUpdated) {
          return request;
        }

        return {
          ...request,
          ...updates,
        };
      }
    );

    setUserEventRequests(updatedRequests);
  };

  const updateEvents = async ({
    status,
    requestIds,
    rejectOption,
  }: {
    status: string,
    requestIds: Array<number>,
    rejectOption?: Option,
  }) => {
    setRowApiRequestStatus('LOADING');

    const isBulkAction = requestIds.length > 1;

    try {
      if (isBulkAction) {
        const requests = requestIds.map((id) => {
          const result: any = {
            id,
            status,
          };

          if (rejectOption?.value) {
            result.rejection_reason_id = rejectOption.value;
          }

          if (rejectOption?.requiresText) {
            result.reason = rejectOption.label;
          }

          return result;
        });

        await bulkUpdateEventRequests({
          eventId,
          requests,
        });
      } else {
        await updateUserEventRequest({
          id: requestIds[0],
          status,
          rejectOption,
        });
      }

      await refreshUserEventRequests();

      if (rejectRequestModal.isOpen) {
        setRejectRequestModal({ isOpen: false, requestIds: null });
      }

      setSelectedIds([]);

      showSuccessToasts(requestIds, status);
      setRowApiRequestStatus('SUCCESS');
    } catch (err) {
      setRowApiRequestStatus('FAILED');
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: t(`Scout access action failed`),
          status: 'ERROR',
        },
      });
    }
  };

  const onWithdrawRequestAction = async () => {
    setIsProcessingMenuButtonAction(true);
    trackEvent(
      leagueOperationsEventNames.withdrawRequestSubmitted,
      getScoutAccessTrackingData({
        product: 'league-ops',
        productArea: 'scout-access-management',
        feature: 'scout-access-management',
      })
    );
    await handleCancelUserEventRequestApi({
      userEventRequests,
      setUserEventRequests,
      userEventRequestId: +menuButtonActionInfo.id,
      useScoutName: true,
    });
    setMenuButtonActionInfo({
      id: null,
      type: '',
    });
    setIsProcessingMenuButtonAction(false);
  };

  const removeSingleFile = async (requestId: number) => {
    try {
      await updateUserEventRequest({
        id: requestId,
        attachment: null,
      });

      localUpdateEventRequests({
        requestIds: [requestId],
        updates: {
          attachment: null,
        },
      });

      setSelectedIds([]);

      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: t(`Document has been removed.`),
          status: 'SUCCESS',
        },
      });
    } catch {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: t(`Failed to remove document.`),
          status: 'ERROR',
        },
      });
    }
  };

  const handleUserEventRequestAttachmentUpdate = async (
    requestIds: Array<number> | null,
    _uploadedFile: ?AttachedFile
  ): Promise<void> => {
    if (!requestIds?.length) {
      return;
    }

    if (!_uploadedFile) {
      // delete action, only 1 file selected
      await removeSingleFile(requestIds[0]);
      return;
    }

    let formattedFileToUpload = {
      name: '',
      type: '',
      url: '',
    };

    const currentFileInfo = await getFileInfo(_uploadedFile.file);
    if (typeof currentFileInfo !== 'string') {
      formattedFileToUpload = {
        ...currentFileInfo,
        url: currentFileInfo.url.split(',')?.[1],
      };
    }

    const requests =
      requestIds.map((id) => {
        const currentEventDetails = userEventRequests.find(
          (item) => item.id === id
        );

        const data: any = {
          id,
          status: currentEventDetails?.status,
          reason: currentEventDetails?.reason,
          rejection_reason_id: currentEventDetails?.rejection_reason_id,
        };

        return data;
      }) ?? [];

    try {
      await bulkUpdateEventRequests({
        eventId,
        attachment: formattedFileToUpload,
        requests,
      });

      localUpdateEventRequests({
        requestIds,
        updates: {
          attachment: {
            filename: formattedFileToUpload.name,
            filetype: formattedFileToUpload.type,
            url: formattedFileToUpload.url,
          },
        },
      });

      setRejectRequestModal({ isOpen: false, requestIds: null });
      setSelectedIds([]);

      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 2,
          title: t(`Document has been uploaded.`),
          status: 'SUCCESS',
        },
      });
    } catch {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: t(`Failed to upload document.`),
          status: 'ERROR',
        },
      });
    }
  };

  const getEventDateTimeInfo = () => {
    const startOrgDate = moment.tz(event?.start_date, event?.local_timezone);
    const endOrgTime = moment
      .tz(event?.end_date, event?.local_timezone)
      .format('hh:mm A');
    return (
      <div css={matchStyles.eventTime}>
        {formatMatchReportDate(startOrgDate)} - {endOrgTime}
      </div>
    );
  };

  const renderAppHeader = () => (
    <header css={matchStyles.matchReportHeader}>
      <div css={matchStyles.eventTitleWrapper}>
        <h1 css={matchStyles.eventTitle}>{getMatchReportEventName(event)}</h1>
      </div>
      {getEventDateTimeInfo()}
    </header>
  );

  const renderToolbar = () => {
    return (
      <MatchRequestsToolbarTranslated
        selectedIds={selectedIds}
        userEventRequests={userEventRequests}
        handleUploadAttachment={() => {
          setUploadModal({ isOpen: true, requestIds: selectedIds });
          trackEvent(
            leagueOperationsEventNames.scoutAccessBulkUploadAttachmentClicked,
            getScoutAccessTrackingData({
              product: 'league-ops',
              productArea: 'scout-access-management',
              feature: 'scout-access-management',
              isBulkAction: true,
            })
          );
        }}
        handleApprove={() => {
          updateEvents({
            status: userEventRequestStatuses.approved,
            requestIds: selectedIds,
          });
          trackEvent(
            leagueOperationsEventNames.scoutAccessBulkApproved,
            getScoutAccessTrackingData({
              product: 'league-ops',
              productArea: 'scout-access-management',
              feature: 'scout-access-management',
              isBulkAction: true,
            })
          );
        }}
        handleReject={() => {
          setRejectRequestModal({ isOpen: true, requestIds: selectedIds });
          trackEvent(
            leagueOperationsEventNames.scoutAccessBulkRejected,
            getScoutAccessTrackingData({
              product: 'league-ops',
              productArea: 'scout-access-management',
              feature: 'scout-access-management',
              isBulkAction: true,
            })
          );
        }}
        isLoading={isRequestLoading}
      />
    );
  };

  const handleMatchRequestTableCheckboxClick = (
    requestId: number,
    value: boolean
  ) => {
    if (value) {
      setSelectedIds([...selectedIds, requestId]);
      return;
    }
    setSelectedIds(selectedIds.filter((id) => id !== requestId));
  };

  const handleMatchRequestTableMasterCheckboxClick = () => {
    if (selectedIds.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(userEventRequests.map((request) => request.id));
  };

  const renderMatchRequestsTable = () => (
    <Fragment>
      {renderToolbar()}
      <div css={requestStyles.matchRequestTable} data-testid="table">
        {/* HEADER */}
        <div className="table-header">
          {isBulkModeActive && (
            <p css={requestStyles.checkbox}>
              <Checkbox.New
                id="selected-events"
                checked={selectedIds.length === userEventRequests.length}
                indeterminate={
                  !!selectedIds.length &&
                  selectedIds.length < userEventRequests.length
                }
                onClick={handleMatchRequestTableMasterCheckboxClick}
              />
            </p>
          )}
          <p css={requestStyles.mediumCellSize}>{t('Scout')}</p>
          <p css={requestStyles.largeCellSize}>{t('Team')}</p>
          <p css={requestStyles.smallCellSize}>{t('Request date')}</p>
          <p css={requestStyles.mediumCellSize}>{t('Request time')}</p>
          <p css={requestStyles.smallCellSize}>{t('Review date')}</p>
          <p css={requestStyles.mediumCellSize}>{t('Review time')}</p>
          <p css={requestStyles.largeCellSize}>{t('Access requests')}</p>
          <p css={requestStyles.mediumCellSize}>{t('Match information')}</p>
        </div>
        <div className="table-body">
          {userEventRequests.map((request, index) => (
            <Fragment key={request.id}>
              <MatchRequestsTableRow
                isSelected={!!selectedIds.find((id) => id === request.id)}
                setIsSelected={(value) =>
                  handleMatchRequestTableCheckboxClick(request.id, value)
                }
                userEventRequest={request}
                rowApiRequestStatus={rowApiRequestStatus}
                updateUserEventRequests={({
                  actionType,
                  requestId,
                  attachment,
                }) => {
                  if (actionType === 'UPLOAD') {
                    handleUserEventRequestAttachmentUpdate(
                      [requestId],
                      attachment
                    );
                  } else {
                    updateEvents({
                      status: actionType,
                      requestIds: [requestId],
                    });
                  }
                }}
                isLastRow={index === userEventRequests.length - 1}
                onRejectRequest={(requestId) =>
                  setRejectRequestModal({
                    isOpen: true,
                    requestIds: [requestId],
                  })
                }
                toastDispatch={toastDispatch}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );

  const { columns, rows } = useMatchRequestMUIGrid({
    rowApiRequestStatus,
    userEventRequests,
    handleUserEventStatusActionUpdate: updateEvents,
    setRejectRequestModal,
    setUploadModal,
    handleUserEventRequestAttachmentUpdate,
    handleSetMenuButtonAction: ({ id, type }: MenuButtonModalInfo) => {
      if (type === menuButtonTypes.withdraw) {
        trackEvent(
          leagueOperationsEventNames.withdrawRequestClicked,
          getScoutAccessTrackingData({
            product: 'league-ops',
            productArea: 'scout-access-management',
            feature: 'scout-access-management',
          })
        );
      }
      setMenuButtonActionInfo({ id, type });
    },
  });

  const renderMatchRequestsRejectionsModal = () => (
    <MatchRequestRejectModal
      isOpen={rejectRequestModal.isOpen}
      rejectOptions={rejectReasonOptions}
      onReject={(rejectOption): Promise<void> =>
        updateEvents({
          status: userEventRequestStatuses.denied,
          requestIds: rejectRequestModal?.requestIds ?? [],
          rejectOption,
        })
      }
      closeModal={() =>
        setRejectRequestModal({ isOpen: false, requestIds: null })
      }
    />
  );

  const renderFixtureActionModal = () => (
    <FixtureActionModal
      actionId={menuButtonActionInfo.id}
      actionType={menuButtonActionInfo.type}
      clearActionInfo={() => setMenuButtonActionInfo({ id: null, type: '' })}
      onFixtureMenuActionSuccess={onWithdrawRequestAction}
      isLoading={isProcessingMenuButtonAction}
    />
  );

  const renderSimpleAttachmentUploadModal = () => (
    <UploadFileModalTranslated
      isOpen={uploadModal.isOpen}
      onClose={() => setUploadModal({ isOpen: false, requestIds: null })}
      onSubmit={(file) => {
        handleUserEventRequestAttachmentUpdate(uploadModal.requestIds, file);
        setUploadModal({ isOpen: false, requestIds: null });
      }}
    />
  );

  // Updated data grid
  const renderMatchRequestsDataGrid = () => (
    <Fragment>
      {renderToolbar()}
      <DataGrid
        columns={columns}
        rows={rows}
        hideFooter
        checkboxSelection={isBulkModeActive}
        rowSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={setSelectedIds}
        isRowSelectable={({ row }) => {
          if (shouldAllowApprovedRejectedStatusesToBeChanged) {
            return row.editable;
          }
          return !DISABLED_BULK_STATUSES.includes(row.status) && row.editable;
        }}
      />
    </Fragment>
  );

  if (eventRequestStatus === 'PENDING') return <DelayedLoadingFeedback />;
  if (eventRequestStatus === 'FAILURE')
    return <AppStatus status="error" isEmbed />;

  return (
    <div data-testid="MatchRequests">
      {renderAppHeader()}
      <div css={requestStyles.matchRequestMainBody}>
        {selectedIds.length ? null : <h4>{t('Access Requests')}</h4>}
        {renderMUIGrid
          ? renderMatchRequestsDataGrid()
          : renderMatchRequestsTable()}
      </div>

      {renderMatchRequestsRejectionsModal()}
      {renderMUIGrid && renderFixtureActionModal()}
      {renderMUIGrid && renderSimpleAttachmentUploadModal()}
    </div>
  );
};

export const MatchRequestsTranslated: ComponentType<Props> =
  withNamespaces()(MatchRequests);
export default MatchRequests;
