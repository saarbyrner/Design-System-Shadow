// @flow
import { useState, useMemo } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { TabBar } from '@kitman/components';
import { AthletesBySquadSelector } from '@kitman/components/src/Athletes/components';
import {
  useGetPermissionsQuery,
  useGetAllGroupsQuery,
  useGetAllLabelsQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { SearchBoxWrapperTranslated as SearchBoxWrapper } from './SearchBoxWrapper';
import { LabelSelectorTranslated as LabelSelector } from './LabelSelector';
import { GroupSelectorTranslated as GroupSelector } from './GroupSelector';

export const ExtendedPopulationSelectorTabKeys = {
  SQUADS: '0',
  GROUPS: '1',
  LABELS: '2',
};

type Props = {
  squadId: number | string | null,
  updateSquad: Function,
  defaultTab?: string,
  isInAthleteSelect?: boolean,
};

function ExtentedPopulationSelector(props: I18nProps<Props>) {
  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const [currentTab, setCurrentTab] = useState(
    props.defaultTab || ExtendedPopulationSelectorTabKeys.SQUADS
  );
  const { data: groups = [], isFetching: isGroupsFetching } =
    useGetAllGroupsQuery();
  const { data: labels = [], isFetching: isLabelsFetching } =
    useGetAllLabelsQuery();

  const renderSquadsContent = () => (
    <SearchBoxWrapper isInAthleteSelect={props.isInAthleteSelect}>
      {({ searchValue }) => (
        <AthletesBySquadSelector
          data-testid="ExtendedPopulationSelector|AthleteSelector"
          searchValue={searchValue}
          selectedSquadId={props.squadId}
          onSquadClick={props.updateSquad}
          renderItemLeft={() => null}
          subtitle={`(${props.t('Aggregate')})`}
        />
      )}
    </SearchBoxWrapper>
  );

  const renderGroupsContent = () => (
    <GroupSelector
      isInAthleteSelect={props.isInAthleteSelect}
      groups={groups}
      isFetching={isGroupsFetching}
    />
  );
  const renderLabelsContent = () => (
    <LabelSelector
      isInAthleteSelect={props.isInAthleteSelect}
      labels={labels}
      isFetching={isLabelsFetching}
    />
  );

  const tabPanes = useMemo(() => {
    return [
      {
        title: props.t('Squads'),
        tabHash: '#squads',
        content: renderSquadsContent(),
        tabKey: '0',
      },
      ...(isSuccess && permissions.analysis.labelsAndGroups.canReport
        ? [
            {
              title: props.t('Athlete Groups'),
              tabHash: '#Groups',
              content: renderGroupsContent(),
              tabKey: '1',
            },
            {
              title: props.t('Athlete Labels'),
              tabHash: '#labels',
              content: renderLabelsContent(),
              tabKey: '2',
            },
          ]
        : []),
    ];
  }, [currentTab, props.squadId, permissions]);

  return (
    <TabBar
      data-testid="ExtendedPopulationSelector|Tab"
      customStyles="
        height: 100%;

        .rc-tabs {
          height: 100%;
        }

        .rc-tabs-content {
          height: calc(100% - 40px);
        }

        .rc-tabs-tabpane { 
          padding: 16px 0 0 0;
          background-color: unset;
          height: 100%;
          overflow: hidden;
        }
      "
      tabPanes={tabPanes.map((tabPane) => ({
        title: tabPane.title,
        content: tabPane.content,
      }))}
      onClickTab={setCurrentTab}
      initialTab={currentTab}
      destroyInactiveTabPane
      kitmanDesignSystem
    />
  );
}

export const ExtentedPopulationSelectorTranslated: ComponentType<Props> =
  withNamespaces()(ExtentedPopulationSelector);
export default ExtentedPopulationSelector;
