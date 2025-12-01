// @flow
import { useMemo, useRef } from 'react';
import { css } from '@emotion/react';
import type { ComponentType } from 'react';

import { TabBar } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { OrganisationAppHeaderTranslated as AppHeader } from '../../shared/components/OrganisationAppHeader';
import { ClubRulesetsTabTranslated as ClubRulesetsTab } from './components/ClubRulesetsTab';
import { ClubConsentTabTranslated as ClubConsentTab } from './components/ClubConsentTab';

import type { OrgLevelProps } from '../../shared/types';

const style = {
  organisationApp: css`
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
  clubRulesets: '#club-rulesets',
  clubConsent: '#club-consent',
};

const OrganisationApp = (props: I18nProps<OrgLevelProps>) => {
  const { data: permissions } = useGetPermissionsQuery();

  const canViewConditionalFields =
    window.featureFlags['conditional-fields-creation-in-ip'] &&
    (permissions.injurySurveillance?.canAdmin ||
      permissions.logicBuilder?.canAdmin);

  const tabs = useMemo(
    () =>
      [
        {
          title: props.t('Rulesets'),
          content: <ClubRulesetsTab organisationId={props.organisationId} />,
          tabHash: TAB_HASHES.clubRulesets,
          visible: true,
        },
        {
          title: props.t('Consent'),
          content: <ClubConsentTab organisationId={props.organisationId} />,
          tabHash: TAB_HASHES.clubConsent,
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
    <div className="organisationApp" css={style.organisationApp}>
      <AppHeader organisationId={props.organisationId} />
      {canViewConditionalFields && tabs.length > 0 && (
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

export const OrganisationAppTranslated: ComponentType<OrgLevelProps> =
  withNamespaces()(OrganisationApp);
export default OrganisationApp;
