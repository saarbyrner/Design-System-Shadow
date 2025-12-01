// @flow
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TabBar } from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { setSearchText } from '../redux/actions';
import { ActiveUsersTranslated as ActiveUsers } from './ActiveUsers';
import { InactiveUsersTranslated as InactiveUsers } from './InactiveUsers';
import { AssignVisibilityModalTranslated as AssignVisibilityModal } from '../components/AssignVisibilityModal';
import useAssignVisibility from '../hooks/useAssignVisibility';

const styles = {
  tabWithBadge: css`
    display: flex;
    align-items: center;
  `,
  badge: css`
    background-color: ${colors.red_100};
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 12px;
    color: ${colors.neutral_100};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
  `,
};

function TabsContainer() {
  const { permissions } = usePermissions();

  const allowConfidentialNote =
    window.featureFlags['confidential-notes'] &&
    permissions.medical.privateNotes.canAdmin;

  const initialTab = useRef();
  const dispatch = useDispatch();

  const {
    toasts,
    onClickToastLink,
    toastDispatch,
    inactiveUsersWithVisibilityIssues,
  } = useAssignVisibility();

  const tabPanes = [
    {
      title: 'Active',
      content: <ActiveUsers />,
      tabHash: '#active',
      tabKey: '0',
    },
    {
      title: allowConfidentialNote ? (
        <div css={styles.tabWithBadge}>
          <div>Inactive</div>
          {inactiveUsersWithVisibilityIssues.length !== 0 && (
            <div css={styles.badge}>
              {inactiveUsersWithVisibilityIssues.length}
            </div>
          )}
        </div>
      ) : (
        'Inactive'
      ),
      content: <InactiveUsers />,
      tabHash: '#inactive',
      tabKey: '1',
    },
  ];

  initialTab.current =
    tabPanes.find((tabPane) => tabPane.tabHash === window.location.hash)
      ?.tabKey || '0';

  // Set the location hash when changing tab
  const onClickTab = (tabKey) => {
    const currentTabHash = tabPanes.find(
      (tabPane) => tabPane.tabKey === tabKey
    )?.tabHash;

    if (currentTabHash) {
      // We use location.replace so it does not push the page in the history.
      // This prevents the browser back button from redirecting the user to the
      // previous hash instead of the previous page
      window.location.replace(currentTabHash);
    }

    dispatch(setSearchText(''));
  };

  return (
    <>
      <TabBar
        customStyles=".rc-tabs-bar { padding: 0 24px; background-color:#ffffff }, .rc-tabs-tabpane { position: relative }"
        tabPanes={tabPanes.map((tabPane) => ({
          // $FlowFixMe title is expected as string but works with a node too
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={initialTab.current}
        kitmanDesignSystem
      />
      {allowConfidentialNote && (
        <>
          <AssignVisibilityModal toastAction={toastDispatch} />
          <ToastDialog
            toasts={toasts}
            onClickToastLink={onClickToastLink}
            onCloseToast={(id) => {
              toastDispatch({
                type: 'REMOVE_TOAST_BY_ID',
                id,
              });
            }}
          />
        </>
      )}
    </>
  );
}

export default TabsContainer;
