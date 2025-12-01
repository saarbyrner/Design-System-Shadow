/* eslint-disable no-param-reassign */

// @flow
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { GridActionsCellItem } from '@kitman/playbook/components';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import type {
  AthleteRow,
  UserRow,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import {
  useExpireRegistrationMutation,
  useConvertNonRegistratedPlayerIntoRegistratedMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';

import {
  onToggleModal,
  onTogglePanel,
  setSelectedRow,
  onSetApprovalState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import { registrationGlobalApi } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  getSelectedRow,
  getApprovalState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';

import type { Dispatch } from '@kitman/common/src/types';
import type { CreateUserRegistrationStatusPayload } from '@kitman/modules/src/LeagueOperations/shared/services/createUserRegistrationStatus';
import type { Payload as UpdateUserRegistrationStatusPayload } from '@kitman/modules/src/LeagueOperations/shared/services/updateUserRegistrationStatus';
import { useFetchRegistrationHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { ModalAction } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getChangeStatusPanelTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getRegistrationChangeStatusPanelData';

type ReturnType = {
  actions: (row: AthleteRow | UserRow) => Array<React$Node>,
  onConfirm: (action: ModalAction) => void,
  handleModalClose: (isUserClick?: boolean) => void,
};

// This is the query name used in the api slice
// and the query name used in the updateQueryData function
// this is used to update the data in the cache
// after the mutation is successful
const queryOptions = {
  athlete: 'searchAthleteList',
  user: 'searchUserList',
};

type GridAction = {
  id: string,
  text: string,
  onCallAction: (row: AthleteRow | UserRow) => void,
  isVisible: boolean,
};

// todo: move out of here into a utils file
const createGridActions = ({
  preferences,
  permissions,
  dispatch,
  currentSquad,
  row,
}: {
  preferences: PreferenceType,
  permissions: PermissionsType,
  dispatch: Dispatch<{ type: string, payload: any }>,
  currentSquad: {
    division: Array<{ name: string }>,
    id: string,
    name: string,
  },
  row: AthleteRow | UserRow,
}): Array<GridAction> => {
  return [
    {
      id: 'expire_registration',
      text: i18n.t('Expire Registration'),
      onCallAction: () => {
        let nameInRow = '';
        if ('athlete' in row) {
          // $FlowIgnore[incompatible-use]
          nameInRow = Array.isArray(row.athlete) && row.athlete[0].text;
        } else {
          // $FlowIgnore[incompatible-use]
          nameInRow = Array.isArray(row.user) && row.user[0].text;
        }

        dispatch(setSelectedRow(row));
        dispatch(
          onToggleModal({
            isOpen: true,
            action: 'expire_registration',
            text: {
              header: i18n.t('Expire Registration'),
              body: i18n.t(
                'Click confirm to expire the {{division}} registration for {{user}}.',
                {
                  division: currentSquad?.division[0]?.name,
                  user: nameInRow,
                }
              ),
              secondaryBody: i18n.t(
                'Once expired, the registration is cleared, reset and ready to be filled out and resubmitted.'
              ),
            },
          })
        );
      },
      isVisible:
        window.getFlag('league-ops-expire-registration-profiles') &&
        preferences.registration_expire_enabled &&
        permissions.registration.status.expire &&
        row.registration_system_status?.type ===
          RegistrationStatusEnum.APPROVED,
    },
    {
      id: 'change_status',
      text: i18n.t('Change Status'),
      onCallAction: () => {
        dispatch(
          onSetApprovalState({
            status: undefined,
            reasonId: undefined,
            annotation: undefined,
          })
        );
        dispatch(setSelectedRow(row));
        dispatch(onTogglePanel({ isOpen: true }));
      },
      isVisible:
        permissions.registration.status.canManageUnapprove &&
        window.getFlag('league-ops-update-registration-status') &&
        (row.registration_system_status?.type ===
          RegistrationStatusEnum.APPROVED ||
          row.registration_system_status?.type ===
            RegistrationStatusEnum.UNAPPROVED),
    },
    {
      id: 'register_non_reg_player',
      text: i18n.t('Register player'),
      onCallAction: () => {
        dispatch(setSelectedRow(row));
        dispatch(
          onToggleModal({
            isOpen: true,
            action: 'register_non_reg_player',
            text: {
              header: i18n.t(
                'Convert a non-registered athlete to a registered athlete.'
              ),
              body: i18n.t('Converting an athlete to registered will:'),
              secondaryBody: `
              <ul>
                <li>${i18n.t(
                  'Start the registration process for the athlete in the system'
                )} </li>
                <li>${i18n.t(
                  'Once registered, they will be able to participate in games and be active on the roster.'
                )}</li>
              </ul>`,
              ctaText: i18n.t('Convert'),
            },
          })
        );
      },
      isVisible:
        permissions.homegrown.canManageHomegrown && !!row.non_registered,
    },
  ].filter((i) => i.isVisible);
};

const useGridActions = (): ReturnType => {
  const dispatch = useDispatch();
  const { preferences } = usePreferences();
  const { permissions } = usePermissions();
  const currentSquad = useSelector(getActiveSquad());
  const selectedRow = useSelector(getSelectedRow);
  const { status, annotation, reasonId } = useSelector(getApprovalState);

  const { trackEvent } = useEventTracking();

  const [expireRegistration] = useExpireRegistrationMutation();
  const [createUserRegistrationStatus] =
    registrationGlobalApi.useCreateUserRegistrationStatusMutation();
  const [updateUserRegistrationStatus] =
    registrationGlobalApi.useUpdateUserRegistrationStatusMutation();
  const [convertNonRegistratedPlayerIntoRegistrated] =
    useConvertNonRegistratedPlayerIntoRegistratedMutation();

  const userType = selectedRow?.athlete ? 'athlete' : 'staff';

  const username =
    userType === 'athlete'
      ? selectedRow.athlete?.[0]?.text || ''
      : selectedRow.user?.[0]?.text || '';

  // Check if the athlete has a registration
  const currentRegistration =
    selectedRow?.registrations &&
    selectedRow?.registrations.find((registration) => {
      return registration.division.id === currentSquad?.division[0].id;
    });

  // Check if the selected row is an athlete or a user
  const currentUserId = selectedRow?.athlete
    ? selectedRow.user_id
    : selectedRow.id;

  const { data: registrationHistory = undefined } =
    useFetchRegistrationHistoryQuery(
      {
        user_id: currentUserId,
        id: currentRegistration?.id,
      },
      { skip: !currentRegistration }
    );

  const handleModalClose = (isUserClick = false) => {
    dispatch(
      onToggleModal({
        isOpen: false,
        text: {
          header: '',
          body: '',
          secondaryBody: '',
        },
      })
    );
    if (isUserClick) {
      trackEvent('Change Status Modal - Cancel Button Clicked', {
        ...getChangeStatusPanelTrackingData({
          userType,
        }),
      });
    }
  };

  const handleDataUpdate = (action: string) => {
    const currentSearchQuery = selectedRow?.athlete
      ? queryOptions.athlete
      : queryOptions.user;

    dispatch(
      registrationGlobalApi.util.updateQueryData(
        currentSearchQuery,
        undefined,
        (draft) => {
          const safeDraft = Array.isArray(draft) ? draft : draft?.data;
          if (!Array.isArray(safeDraft)) return;

          safeDraft.forEach((item) => {
            if (item.id === selectedRow.id) {
              if (action === 'register_non_reg_player') {
                // Update non_registered property and remove all labels
                if (item.non_registered) {
                  item.non_registered = false;
                  item.labels = [];
                }
              }

              if (action === 'expire_registration') {
                // Update registration status
                item.registration_status = {
                  ...item.registration_status,
                  status: 'incomplete',
                };

                // Update registration requirement
                item.registrations = item.registrations.map((registration) => {
                  if (registration.id === currentRegistration.id) {
                    return {
                      ...registration,
                      status: 'incomplete',
                    };
                  }
                  return registration;
                });

                // Update registration_system_status
                item.registration_system_status = {
                  ...item.registration_system_status,
                  name: 'Incomplete',
                  type: 'incomplete',
                };
              }
            }
          });
        }
      )
    );
  };

  const handleExpireRegistration = () => {
    expireRegistration({
      userId: currentUserId,
      registrationId: currentRegistration.id,
    })
      .unwrap()
      .then(() => {
        handleDataUpdate('expire_registration');
        dispatch(
          add({
            id: 'EXPIRE_REGISTRATION_TOAST_ID',
            status: 'SUCCESS',
            title: i18n.t(
              'Registration successfully expired for {{username}}.',
              {
                username,
              }
            ),
          })
        );
        dispatch(setSelectedRow({}));
        handleModalClose();
      })
      .catch(() => {
        dispatch(
          add({
            id: 'EXPIRE_REGISTRATION_TOAST_ID',
            status: 'ERROR',
            title: i18n.t(
              'There was an error expiring the registration for this athlete.'
            ),
          })
        );
      });
  };
  const handleChangeApprovalStatus = () => {
    const isUserApproved = status === 'approved';
    const payload: CreateUserRegistrationStatusPayload = {
      status,
    };

    if (!isUserApproved) {
      payload.reason_id = reasonId;
      payload.annotation = annotation;
    }

    createUserRegistrationStatus({
      userType,
      userId: currentRegistration.user_id,
      userRegistrationId: currentRegistration.id,
      payload,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            id: 'CHANGE_APPROVAL_STATUS_TOAST_ID',
            status: 'SUCCESS',
            title: i18n.t('{{username}} has been {{status}}.', {
              username,
              status: isUserApproved ? 're-approved' : 'unapproved',
            }),
          })
        );
        dispatch(setSelectedRow({}));
        trackEvent('Change Status Modal - Confirm Button Clicked', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
      })
      .catch(() => {
        dispatch(
          add({
            id: 'CHANGE_APPROVAL_STATUS_TOAST_ID',
            status: 'ERROR',
            title: i18n.t(
              'There was an error changing the approval status for this user.'
            ),
          })
        );
      })
      .finally(() => {
        handleModalClose();
      });
  };

  const handleUpdateUnapprovalStatusAnnotation = () => {
    const mostRecentRegistrationStatus =
      registrationHistory?.status_history?.[0];

    if (mostRecentRegistrationStatus?.id === undefined) {
      return;
    }
    const payload: UpdateUserRegistrationStatusPayload = {
      annotation,
      registration_status_id: mostRecentRegistrationStatus?.id,
    };

    if (reasonId) {
      payload.registration_status_reason_id = reasonId;
    }

    updateUserRegistrationStatus({
      userId: currentRegistration.user_id,
      userRegistrationId: currentRegistration.id,
      payload,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            id: 'CHANGE_APPROVAL_STATUS_TOAST_ID',
            status: 'SUCCESS',
            title: i18n.t('{{username}} has been {{status}}.', {
              username,
              status: 'unapproved',
            }),
          })
        );
        dispatch(setSelectedRow({}));
        trackEvent('Change Status Modal - Confirm Button Clicked', {
          ...getChangeStatusPanelTrackingData({
            userType,
          }),
        });
      })
      .catch(() => {
        dispatch(
          add({
            id: 'CHANGE_APPROVAL_STATUS_TOAST_ID',
            status: 'ERROR',
            title: i18n.t(
              'There was an error updating the status for this user.'
            ),
          })
        );
      })
      .finally(() => {
        handleModalClose();
      });
  };

  const handleConvertingNonRegPlayerIntoRegistered = () => {
    convertNonRegistratedPlayerIntoRegistrated({
      athleteId: selectedRow.id,
    })
      .unwrap()
      .then(() => {
        handleDataUpdate('register_non_reg_player');
        dispatch(
          add({
            id: 'CHANGE_APPROVAL_STATUS_TOAST_ID',
            status: 'SUCCESS',
            title: i18n.t('{{username}} has been updated to registered user.', {
              username,
            }),
          })
        );
        dispatch(setSelectedRow({}));
      })
      .catch(() => {
        dispatch(
          add({
            id: 'CHANGE_APPROVAL_STATUS_TOAST_ID',
            status: 'ERROR',
            title: i18n.t(
              'There was an error changing the registration status for this user.'
            ),
          })
        );
      })
      .finally(() => {
        handleModalClose();
      });
  };

  const handleAction = (action: ModalAction) => {
    switch (action) {
      case 'expire_registration':
        return handleExpireRegistration();
      case 'change_approval_status':
        return handleChangeApprovalStatus();
      case 'update_unapproval_status_annotation':
        return handleUpdateUnapprovalStatusAnnotation();
      case 'register_non_reg_player':
        return handleConvertingNonRegPlayerIntoRegistered();
      default:
        return undefined;
    }
  };

  const getAthleteRowActions = (row): Array<React$Node> => {
    const actions = createGridActions({
      preferences,
      permissions,
      dispatch,
      trackEvent,
      currentSquad,
      row,
    });

    return actions.map(({ id: key, text, onCallAction }) => (
      <GridActionsCellItem
        label={text}
        onClick={() => onCallAction(row)}
        showInMenu
        key={key}
      />
    ));
  };

  return {
    actions: (row: AthleteRow | UserRow) => getAthleteRowActions(row),
    onConfirm: handleAction,
    handleModalClose,
  };
};

export default useGridActions;
