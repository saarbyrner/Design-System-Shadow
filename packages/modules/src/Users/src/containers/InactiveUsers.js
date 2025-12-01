// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getInactiveUsers } from '../redux/selectors';
import UserTable from '../components/UserTable';

type Props = {};

function InactiveUsers(props: I18nProps<Props>) {
  const { permissions } = usePermissions();

  const users = useSelector(getInactiveUsers);
  const columns = [
    {
      id: 'staff_name',
      content: props.t('Staff name'),
    },
    {
      id: 'username',
      content: props.t('Username'),
    },
    {
      id: 'email',
      content: props.t('Email'),
    },
    {
      id: 'created',
      content: props.t('Creation Date'),
    },
    {
      id: 'updated',
      content: props.t('Deactivation Date'),
    },
  ];

  if (
    window.featureFlags['confidential-notes'] &&
    permissions.medical.privateNotes.canAdmin
  ) {
    columns.push({
      id: 'orphaned_annotation_ids',
      content: props.t('Visibility Issues'),
    });
  }

  return (
    <UserTable
      title={props.t('Inactive users')}
      noResultsText={props.t('No inactive users found')}
      users={users}
      columns={columns}
    />
  );
}

export const InactiveUsersTranslated = withNamespaces()(InactiveUsers);
export default InactiveUsers;
