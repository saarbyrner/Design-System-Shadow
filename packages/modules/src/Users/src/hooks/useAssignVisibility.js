// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import type { ToastLink } from '@kitman/components/src/types';
import { setAssignVisibilityModal } from '../redux/actions';
import { getInactiveUsersWithVisibilityIssues } from '../redux/selectors';
import type { User } from '../types';

const useDiagnostics = () => {
  const dispatch = useDispatch();
  const hash = useLocationHash();

  const { toasts, toastDispatch } = useToasts();
  const [userId, setUserId] = useState<?number>(null);
  const [user, setUser] = useState<?User>(null);

  const inactiveUsersWithVisibilityIssues = useSelector(
    getInactiveUsersWithVisibilityIssues
  );

  const updateUserId = (id: number | null) => {
    setUserId(id);
  };

  const updateUser = (userObj: User | null) => {
    setUser(userObj);
  };

  useEffect(() => {
    if (hash.includes('#user_updated=')) {
      updateUserId(parseInt(hash.replace('#user_updated=', ''), 10));
    }
  }, []);

  useEffect(() => {
    const inactiveUsersWithVisibilityIssuesUpdated =
      inactiveUsersWithVisibilityIssues.filter(
        (inactiveUser) => inactiveUser.id === userId
      );

    if (inactiveUsersWithVisibilityIssuesUpdated.length) {
      updateUser(inactiveUsersWithVisibilityIssuesUpdated[0]);
    }
  }, [inactiveUsersWithVisibilityIssues, userId]);

  useEffect(() => {
    if (userId) {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: userId,
          title: i18n.t('User updated successfully'),
          status: 'SUCCESS',
        },
      });
    }

    if (user) {
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 'assignVisibilityToast',
          title: i18n.t('Private items losing visibility'),
          description: `${
            user.orphaned_annotation_ids.length === 1
              ? i18n.t('There is {{count}} private note', {
                  count: user.orphaned_annotation_ids.length,
                })
              : i18n.t('There are {{count}} private notes', {
                  count: user.orphaned_annotation_ids.length,
                })
          } visible to the user. If visibility is not assigned to them, they will be lost.`,
          status: 'WARNING',
          links: [
            {
              id: 1,
              text: i18n.t('Resolve now'),
              link: '#',
              withHashParam: true,
              metadata: {
                action: 'OPEN_ASSIGN_VISIBILITY_MODAL',
              },
            },
            {
              id: 2,
              text: i18n.t('Assign later'),
              link: '#',
              withHashParam: true,
              metadata: {
                action: 'CLOSE_ASSIGN_VISIBILITY_TOAST',
              },
            },
          ],
        },
      });
    }
  }, [userId, user]);

  const closeToast = (id: string | number) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
    window.location.hash = '';
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname
    );
    updateUserId(null);
    updateUser(null);
  };

  const onClickToastLink = (toastLink: ToastLink) => {
    if (toastLink?.metadata?.action === 'OPEN_ASSIGN_VISIBILITY_MODAL') {
      if (user) {
        dispatch(
          setAssignVisibilityModal({
            open: true,
            user,
          })
        );
        closeToast('assignVisibilityToast');
      }
    } else if (
      toastLink?.metadata?.action === 'CLOSE_ASSIGN_VISIBILITY_TOAST'
    ) {
      closeToast('assignVisibilityToast');
    }
  };

  return {
    userId,
    user,
    inactiveUsersWithVisibilityIssues,
    toasts,
    updateUserId,
    updateUser,
    onClickToastLink,
    toastDispatch,
  };
};

export default useDiagnostics;
