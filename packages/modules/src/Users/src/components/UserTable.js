// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import { DataGrid, Link, UserAvatar } from '@kitman/components';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { setActiveUsers } from '@kitman/modules/src/Users/src/redux/actions';
import unlockAccess from '@kitman/services/src/services/unlockAccess';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import UnlockButton from './UnlockButton';
import type { User, Users } from '../types';
import { extractFullName, updateUserById } from '../utils';
import { VisibilityIssuesColumnTranslated as VisibilityIssuesColumn } from './VisibilityIssuesColumn';
import { FiltersTranslated as Filters } from './Filters';
import UnlockUserModal from './UnlockUserModal';

type Column = {
  id:
    | 'staff_name'
    | 'username'
    | 'updated'
    | 'email'
    | 'role'
    | 'created'
    | 'edit'
    | 'orphaned_annotation_ids',
  content: string,
};

type Props = {
  title: string,
  users: Users,
  noResultsText: string,
  columns: Array<Column>,
};

const NameColumn = ({
  user,
  permissions,
}: {
  user: User,
  permissions: PermissionsType,
}) => {
  const firstLastName = extractFullName(user);
  const staffProfileUrl = window.featureFlags['form-based-staff-profile']
    ? `/administration/staff/${user.id}`
    : `/users/${user.id}/edit`;

  const renderContent = () => (
    <>
      <UserAvatar
        url={user.avatar}
        firstname={user.firstname}
        lastname={user.lastname}
        displayInitialsAsFallback
        displayPointerCursor={false}
        size="EXTRA_SMALL"
      />
      <span>{firstLastName}</span>
    </>
  );

  return (
    <div className="users__userTableName">
      {window.featureFlags['form-based-staff-profile'] &&
      !permissions.settings.canViewStaffUsers ? (
        <div>{renderContent()}</div>
      ) : (
        <Link className="textLink" href={staffProfileUrl}>
          {renderContent()}
        </Link>
      )}
    </div>
  );
};

function UserTable(props: Props) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userToUnlock, setUserToUnlock] = useState<string>('');
  const { toasts, toastDispatch } = useToasts();
  const { permissions } = usePermissions();
  const dispatch = useDispatch();

  const allowConfidentialNote =
    window.featureFlags['confidential-notes'] &&
    permissions.medical.privateNotes.canAdmin;

  const columns = [
    ...props.columns,
    {
      id: 'access_locked',
      content: '',
    },
    {
      id: 'edit',
      content: '',
    },
  ];

  // trigger the modal to unlock user account
  const handleUnlockUser = (userName: string) => {
    setUserToUnlock(userName);
    setShowModal(true);
  };

  const unlockUserAccess = async () => {
    unlockAccess(userToUnlock).then(() => {
      // This will update the current user to reflect the update access account of the user.
      const updatedUsers = updateUserById(props.users, userToUnlock);
      dispatch(setActiveUsers(updatedUsers));
      setUserToUnlock('');
      setShowModal(false);
      toastDispatch({
        type: 'CREATE_TOAST',
        toast: {
          id: 1,
          title: i18n.t('Account unlocked'),
          status: 'SUCCESS',
        },
      });
    });
  };

  const canUnlockAccounts =
    window?.ipForGovernment && permissions?.userAccounts?.canUnlock;

  const rows = props.users.map((user) => {
    const staffProfileUrl = window.featureFlags['form-based-staff-profile']
      ? `/administration/staff/${user.id}`
      : `/users/${user.id}/edit`;

    return {
      id: user.id,
      cells: columns.map((column) => {
        let content = null;

        if (canUnlockAccounts && column.id === 'access_locked') {
          content = (
            <UnlockButton
              username={user.username}
              accessLocked={user.access_locked}
              handleUnlockUser={handleUnlockUser}
            />
          );
        } else if (column.id === 'staff_name') {
          content = <NameColumn user={user} permissions={permissions} />;
        } else if (column.id === 'edit') {
          content =
            user.current ||
            (window.featureFlags['form-based-staff-profile'] &&
              !permissions.settings.canViewStaffUsers) ? null : (
              <Link href={staffProfileUrl}>
                <i className="users__userTableEdit icon-edit" />
              </Link>
            );
        } else if (column.id === 'created' || column.id === 'updated') {
          content = formatStandard({
            date: moment(user[column.id]),
            displayLongDate: true,
          });
        } else if (
          allowConfidentialNote &&
          column.id === 'orphaned_annotation_ids'
        ) {
          content = <VisibilityIssuesColumn user={user} />;
        } else {
          content = user[column.id];
        }

        return {
          id: `${column.id}_${user.id}`,
          content,
        };
      }),
    };
  });

  return (
    <div className="users__userTable">
      <h3 className="users__userTableHeader">{props.title}</h3>
      <Filters />
      <DataGrid columns={columns} rows={rows} isLoading={false} />

      {props.users.length === 0 && (
        <div className="users__userTableNoResults">{props.noResultsText}</div>
      )}
      <UnlockUserModal
        isOpen={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        onUnlock={() => unlockUserAccess()}
      />
      <ToastDialog
        toasts={toasts}
        onCloseToast={(id) => {
          toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id,
          });
        }}
      />
    </div>
  );
}

export default UserTable;
