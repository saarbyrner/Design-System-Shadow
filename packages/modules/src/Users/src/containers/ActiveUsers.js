// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getUsers } from '../redux/selectors';
import UserTable from '../components/UserTable';

type Props = {};

function ActiveUsers(props: I18nProps<Props>) {
  const users = useSelector(getUsers);
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
      id: 'role',
      content: props.t('Role'),
    },
    {
      id: 'email',
      content: props.t('Email'),
    },
    {
      id: 'created',
      content: props.t('Creation Date'),
    },
  ];

  return (
    <UserTable
      title={props.t('Active users')}
      noResultsText={props.t('No active users found')}
      users={users}
      columns={columns}
    />
  );
}

export const ActiveUsersTranslated = withNamespaces()(ActiveUsers);
export default ActiveUsers;
