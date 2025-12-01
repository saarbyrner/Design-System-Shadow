// @flow
import { useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { TabBar } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import RulesetAppHeader from '../../shared/components/RulesetAppHeader';
import { ClubVersionsTabTranslated as ClubVersionsTab } from './components/ClubVersionsTab';
import { ClubAssigneesTabTranslated as ClubAssigneesTab } from './components/ClubAssigneesTab';

import type { RulesetLevelProps } from '../../shared/types';

const style = {
  organisationRulesetLevel: css`
    background-color: ${colors.white};
    min-height: calc(100vh - 50px);
  `,

  tabCustomStyle: `
    .rc-tabs-bar {
      background-color: ${colors.p06};
      padding: 0 24px;
    }
  `,
};

const TAB_HASHES = {
  versions: '#versions',
  assignees: '#assignees',
};

const RulesetApp = (props: I18nProps<RulesetLevelProps>) => {
  const { data: permissions } = useGetPermissionsQuery();

  const canViewConditionalFields =
    window.featureFlags['conditional-fields-creation-in-ip'] &&
    (permissions.injurySurveillance?.canAdmin ||
      permissions.logicBuilder?.canAdmin);

  const tabs = useMemo(
    () =>
      [
        {
          title: props.t('Versions'),
          content: (
            <ClubVersionsTab
              organisationId={props.organisationId}
              rulesetId={props.rulesetId}
            />
          ),
          tabHash: TAB_HASHES.versions,
          visible: canViewConditionalFields,
        },
        {
          title: props.t('Assignees'),
          content: <ClubAssigneesTab rulesetId={props.rulesetId} />,
          tabHash: TAB_HASHES.assignees,
          visible: canViewConditionalFields,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [props]
  );

  const defaultTab = useRef(
    tabs.find((tab) => tab.tabHash === window.location.hash)?.tabKey || '0'
  );

  const onClickTab = (tabKey) => {
    const tabHash = tabs.find((tabPane) => tabPane.tabKey === tabKey)?.tabHash;

    if (tabHash) {
      window.location.replace(tabHash);
    }
  };

  return (
    <div
      className="organisationRulesetLevel"
      css={style.organisationRulesetLevel}
    >
      <RulesetAppHeader title={props.title} rulesetId={props.rulesetId} />
      {tabs.length > 0 && (
        <TabBar
          customStyles={style.tabCustomStyle}
          tabPanes={tabs.map((tabPane) => ({
            title: tabPane.title,
            content: tabPane.content,
          }))}
          onClickTab={onClickTab}
          initialTab={defaultTab.current}
          destroyInactiveTabPane
          kitmanDesignSystem
        />
      )}
    </div>
  );
};

export const RulesetAppTranslated: ComponentType<RulesetLevelProps> =
  withNamespaces()(RulesetApp);
export default RulesetApp;
