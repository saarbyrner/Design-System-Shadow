// @flow
import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getApprovalState,
  getSelectedRow,
  getPanel,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import {
  type ApprovalState,
  type ApprovalStatus,
  onTogglePanel,
  onToggleModal,
  onSetApprovalState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import { useFetchRegistrationStatusReasonsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { useFetchRegistrationHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi';
import i18n from '@kitman/common/src/utils/i18n';
import {
  RegistrationStatusEnum,
  type RegistrationHistory,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getChangeStatusPanelTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getRegistrationChangeStatusPanelData';

type ModalBody = {
  header: string,
  body: string,
  ctaText: string,
} | null;

type HandleStatusChange = <TKey: $Keys<ApprovalState>>({
  key: TKey,
  value: $ElementType<ApprovalState, TKey>,
  shouldTrack?: boolean,
}) => void;

type TrackingAction =
  | $Keys<ApprovalState>
  | 'open_side_panel'
  | 'cancel_side_panel'
  | 'save_side_panel'
  | 'history';

type HandleTracking = (
  action: TrackingAction,
  data?: {
    status?: $PropertyType<ApprovalState, 'status'>,
    reasonId?: $PropertyType<ApprovalState, 'reasonId'>,
  }
) => void;

type ReturnType = {
  handleOnClose: () => void,
  onSave: () => void,
  reasons: Array<{ id: string, name: string }>,
  username: string,
  isUserUnapproved: boolean,
  isUnapprovingUser: boolean,
  isPanelStateValid: boolean,
  panelState: ApprovalState,
  modalBody: ModalBody,
  registrationHistory?: RegistrationHistory,
  handleTracking: HandleTracking,
  handleStatusChange: HandleStatusChange,
};

const getModalBody = (
  approvalStatus: ApprovalStatus,
  username: string
): ModalBody => {
  if (!approvalStatus) {
    return null;
  }
  const config = {
    approved: {
      header: i18n.t('Approve user'),
      body: i18n.t(
        `{{username}} will be approved. He will now be able to be placed on rosters and active in the system.`,
        { username }
      ),
      ctaText: i18n.t('Approve'),
    },
    unapproved: {
      header: i18n.t('Unapprove user'),
      body: i18n.t(
        `{{username}} will be unapproved indefinitely. He will not be able to be placed on rosters or active in the system.`,
        { username }
      ),
      ctaText: i18n.t('Unapprove'),
    },
  };
  return config[approvalStatus];
};

const getUsername = (selectedRow) => {
  if (!selectedRow) return '';
  return 'athlete' in selectedRow
    ? selectedRow?.athlete?.[0]?.text ?? ''
    : selectedRow?.user?.[0]?.text ?? '';
};

const useChangeStatusPanel = (): ReturnType => {
  const approvalState = useSelector(getApprovalState);
  const selectedRow = useSelector(getSelectedRow);
  const isOpen = useSelector(getPanel)?.isOpen;
  const currentSquad = useSelector(getActiveSquad());

  const dispatch = useDispatch();
  const { data: reasons = [] } = useFetchRegistrationStatusReasonsQuery(
    {},
    {
      skip: !isOpen,
    }
  );

  const userType = selectedRow?.athlete ? 'athlete' : 'staff';
  const userId = userType === 'athlete' ? selectedRow.user_id : selectedRow.id;

  const currentRegistration = useMemo(
    () =>
      selectedRow?.registrations?.find(
        (registration) =>
          registration.division.id === currentSquad?.division[0].id
      ),
    [selectedRow?.registrations, currentSquad?.division]
  );

  const { data: registrationHistory = undefined } =
    useFetchRegistrationHistoryQuery(
      {
        user_id: userId,
        id: currentRegistration?.id,
      },
      { skip: !currentRegistration }
    );

  const mostRecentAnnotation =
    registrationHistory?.status_history?.[0]?.annotations?.[0];
  const username = getUsername(selectedRow);
  const currentUnapprovalReasonId = selectedRow?.registration_status_reason?.id;
  const userStatus = selectedRow?.registration_system_status?.type;
  const isUserApproved = userStatus === RegistrationStatusEnum.APPROVED;
  const isUserUnapproved = userStatus === RegistrationStatusEnum.UNAPPROVED;

  const [panelState, setPanelState] = useState<ApprovalState>({
    ...approvalState,
    status: userStatus,
  });

  const isApprovingUser = panelState.status
    ? panelState.status === RegistrationStatusEnum.APPROVED
    : isUserApproved;
  const isUnapprovingUser = panelState.status
    ? panelState.status === RegistrationStatusEnum.UNAPPROVED
    : isUserUnapproved;
  const isUpdatingUnapprovedStatus = isUserUnapproved && isUnapprovingUser;
  const isChangingStatusToUnapprovedWithReason =
    isUserApproved && isUnapprovingUser && !!panelState.reasonId;
  const isChangingStatusToApproved = isUserUnapproved && isApprovingUser;
  const isUpdatingUnapprovedStatusWithChanges =
    isUpdatingUnapprovedStatus &&
    !!panelState.annotation &&
    (panelState.annotation !== mostRecentAnnotation?.content ||
      panelState.reasonId !== currentUnapprovalReasonId);
  const isPanelStateValid =
    isChangingStatusToUnapprovedWithReason ||
    isChangingStatusToApproved ||
    isUpdatingUnapprovedStatusWithChanges;

  const { trackEvent } = useEventTracking();

  const handleTracking: HandleTracking = (action, data) => {
    switch (action) {
      case 'open_side_panel':
        trackEvent('Change Status Panel - Open Side Panel', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
        break;
      case 'status':
        if (data?.status) {
          trackEvent('Change Status Panel - Registration Status Changed', {
            ...getChangeStatusPanelTrackingData({
              userType,
              status: data.status,
            }),
          });
        }
        break;
      case 'reasonId':
        if (data?.reasonId) {
          trackEvent('Change Status Panel - Registration Reason Selected', {
            ...getChangeStatusPanelTrackingData({
              userType,
              reason: reasons.find((reason) => reason.id === data.reasonId)
                ?.name,
            }),
          });
        }
        break;
      case 'annotation':
        trackEvent('Change Status Panel - Registration Notes Interaction', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
        break;
      case 'history':
        trackEvent('Change Status Panel - Registration History Viewed', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
        break;
      case 'cancel_side_panel':
        trackEvent('Change Status Panel - Cancel Side Panel', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
        break;
      case 'save_side_panel':
        trackEvent('Change Status Panel - Save Side Panel', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleTracking('open_side_panel');
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentUnapprovalReasonId) {
      setPanelState((prevPanelState) => ({
        ...prevPanelState,
        reasonId: currentUnapprovalReasonId,
      }));
    }
  }, [currentUnapprovalReasonId]);

  useEffect(() => {
    if (isUpdatingUnapprovedStatus && mostRecentAnnotation) {
      setPanelState((prevPanelState) => ({
        ...prevPanelState,
        annotation: mostRecentAnnotation.content,
      }));
    }
  }, [mostRecentAnnotation, isUpdatingUnapprovedStatus]);

  const handleStatusChange: HandleStatusChange = ({
    key,
    value,
    shouldTrack = true,
  }) => {
    const updates = { ...panelState };
    // $FlowIgnore -- computed keys are not supported by flow
    updates[key] = value;
    setPanelState(updates);
    if (shouldTrack) {
      handleTracking(key, {
        // $FlowIgnore -- computed keys are not supported by flow
        [key]: value,
      });
    }
  };

  const handleOnClose = () => {
    dispatch(onTogglePanel({ isOpen: false }));
    handleTracking('cancel_side_panel');
  };

  const modalBody = getModalBody(panelState.status, username);

  const onSave = () => {
    if (!modalBody) {
      return;
    }

    dispatch(onSetApprovalState(panelState));
    dispatch(onTogglePanel({ isOpen: false }));

    dispatch(
      onToggleModal({
        isOpen: true,
        action: isUpdatingUnapprovedStatusWithChanges
          ? 'update_unapproval_status_annotation'
          : 'change_approval_status',
        text: {
          header: modalBody.header,
          body: modalBody.body,
          ctaText: modalBody.ctaText,
        },
      })
    );
    handleTracking('save_side_panel');
  };

  return {
    handleOnClose,
    handleStatusChange,
    handleTracking,
    onSave,
    reasons,
    username,
    panelState,
    isUserUnapproved,
    isUnapprovingUser,
    isPanelStateValid,
    modalBody,
    registrationHistory,
  };
};

export default useChangeStatusPanel;
