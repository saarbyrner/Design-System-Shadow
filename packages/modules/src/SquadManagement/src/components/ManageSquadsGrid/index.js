// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, TextButton } from '@kitman/components';

import TabLayout from '@kitman/components/src/TabLayout';
import RegistrationGrid from '@kitman/modules/src/LeagueOperations/technicalDebt/components/RegistrationGrid';
import { AddSquadSidePanelTranslated as AddSquadSidePanel } from '@kitman/modules/src/AddSquadSidePanel';

import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useSquadGrid from '../../shared/hooks/useSquadsGrid';

type Props = {};

const ManageSquadsGrid = (props: I18nProps<Props>) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { organisation } = useOrganisation();
  const { isSquadGridFetching, isSquadGridError, grid } = useSquadGrid({
    locale: organisation.locale || navigator.language,
  });

  const renderGrid = () => {
    if (isSquadGridError) return <AppStatus status="error" />;
    if (isSquadGridFetching) return <TabLayout.Loading />;

    return (
      <RegistrationGrid
        grid={{
          columns: grid.columns,
          rows: grid.rows,
        }}
        gridId={grid.id}
        isFullyLoaded
        emptyTableText={grid.emptyTableText}
        rowActions={null}
        isLoading={isSquadGridFetching}
      />
    );
  };

  const renderSidePanel = () => (
    <AddSquadSidePanel
      isOpen={isPanelOpen}
      onClose={() => setIsPanelOpen(false)}
      onSaveSuccess={() => setIsPanelOpen(false)}
    />
  );

  return (
    <TabLayout>
      <TabLayout.Body>
        <TabLayout.Header>
          <TabLayout.Title>{props.t('Manage Teams')}</TabLayout.Title>
          <TabLayout.Actions>
            <TextButton
              type="primary"
              text={props.t('New Team')}
              iconAfter="icon-add"
              kitmanDesignSystem
              tabIndex="-1"
              onClick={() => setIsPanelOpen(true)}
            />
          </TabLayout.Actions>
        </TabLayout.Header>
        <TabLayout.Content>
          {renderGrid()}
          {renderSidePanel()}
        </TabLayout.Content>
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ManageSquadsGridTranslated = withNamespaces()(ManageSquadsGrid);
export default ManageSquadsGrid;
