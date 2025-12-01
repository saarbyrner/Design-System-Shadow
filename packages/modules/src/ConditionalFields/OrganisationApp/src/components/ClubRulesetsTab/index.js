// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { AppStatus } from '@kitman/components';

import TabLayout from '@kitman/components/src/TabLayout';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import RulesetsGrid from '../../../../shared/components/ConditionalFieldsGrid';
import useRulesetsGrid from '../../../../shared/hooks/useRulesetsGrid';

import type { OrgLevelProps } from '../../../../shared/types';

const ClubRulesetsTab = (props: I18nProps<OrgLevelProps>) => {
  const { grid, isRulesetsListFetching, isRulesetsListError } = useRulesetsGrid(
    {
      organisation_id: props.organisationId,
    }
  );

  const renderContent = () => {
    if (isRulesetsListError) return <AppStatus status="error" />;
    if (isRulesetsListFetching) return <TabLayout.Loading />;
    return (
      <RulesetsGrid
        gridId={grid.id}
        isLoading={isRulesetsListFetching}
        grid={grid}
        isFullyLoaded
        emptyTableText={grid.emptyTableText}
        rowActions={null}
      />
    );
  };

  return (
    <TabLayout>
      <TabLayout.Body>
        <TabLayout.Header>
          <TabLayout.Title>{props.t('Rulesets')}</TabLayout.Title>
        </TabLayout.Header>

        <TabLayout.Content>{renderContent()}</TabLayout.Content>
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ClubRulesetsTabTranslated: ComponentType<OrgLevelProps> =
  withNamespaces()(ClubRulesetsTab);
export default ClubRulesetsTab;
