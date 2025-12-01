// @flow
import { useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, TabBar } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useManageAthletes } from '../contexts/manageAthletesContext';
import { AthletesHeaderTranslated as AthletesHeader } from './AthletesHeader';
import { AthletesTableTranslated as AthletesTable } from './AthletesTable';
import styles from './styles';

const AthletesView = () => (
  <>
    <AthletesHeader />
    <AthletesTable />
  </>
);

type Props = {};

const AthletesTabs = (props: I18nProps<Props>) => {
  const { changeViewType, requestStatus } = useManageAthletes();

  const tabPanes = useMemo(() =>
    [
      {
        title: props.t('Active'),
        content: (
          <div css={styles.tab}>
            <AthletesView />
          </div>
        ),
        tabHash: '#active',
        visible: true,
      },
      {
        title: props.t('Inactive'),
        content: (
          <div css={styles.tab}>
            <AthletesView />
          </div>
        ),
        tabHash: '#inactive',
        visible: true,
      },
    ]
      .filter((tab) => tab.visible)
      .map((tab, index) => ({ ...tab, tabKey: index.toString() }))
  );

  // On first render, show the tab associated to the location hash
  const initialTab = useRef(
    tabPanes.find((tabPane) => tabPane.tabHash === window.location.hash)
      ?.tabKey || '0'
  );

  const onClickTab = (tabKey) => {
    const tabHash = tabPanes.find(
      (tabPane) => tabPane.tabKey === tabKey
    )?.tabHash;

    if (tabHash) {
      // We use location.replace so it does not push the page in the history.
      // This prevents the browser back button from redirecting the user to the
      // previous hash instead of the previous page
      window.location.replace(tabHash);
    }

    changeViewType(tabKey);
  };

  return (
    <div data-testid="ManageAthletesTabs" css={styles.tabs}>
      <TabBar
        customStyles=".rc-tabs-bar { padding: 0 24px; background-color:#ffffff }"
        tabPanes={tabPanes.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={initialTab.current}
        destroyInactiveTabPane
        kitmanDesignSystem
      />
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const AthletesTabsTranslated: ComponentType<Props> =
  withNamespaces()(AthletesTabs);
export default AthletesTabs;
