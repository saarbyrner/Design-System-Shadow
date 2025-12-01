// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { AthleteSelect } from '@kitman/components/src/Athletes';
import { Select } from '@kitman/components';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ExtentedPopulationSelectorTranslated as ExtendedPopulationSelector } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ExtendedPopulationSelector/index';
import {
  useGetAllLabelsQuery,
  useGetAllGroupsQuery,
  useGetPermissionsQuery,
  useGetActiveSquadQuery,
  useGetAllSquadAthletesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import { HistoricSquadsToggleTranslated as HistoricSquadsToggle } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/HistoricSquadsToggle';
import { inlineMaxWidth } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import {
  NO_GROUPING,
  EDIT_GROUPING_KEY,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import type { RowGroupingParams } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { ClickAwayListener } from '@kitman/playbook/components';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';

type Props = {
  selectedPopulation: Array<SquadAthletesSelection>,
  onSetPopulation: Function,
  enableMultiSelect?: boolean,
  showExtendedPopulationOptions?: boolean,
  label?: string,
  onSelectGrouping?: (params: RowGroupingParams) => void,
  isMultiSelect?: boolean,
};

function MenuListOverride() {
  const { data: activeSquad = { id: null } } = useGetActiveSquadQuery();
  const [selectedSquadId, setSelectedSquadId] = useState(activeSquad?.id);

  return (
    <div css={{ margin: '5px' }}>
      <ExtendedPopulationSelector
        updateSquad={setSelectedSquadId}
        squadId={selectedSquadId}
        isInAthleteSelect
      />
    </div>
  );
}

function SquadModule(props: I18nProps<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoricSquadActive, setHistoricSquadActive] = useState(
    !!props.selectedPopulation[0]?.historic
  );
  const { data: activeSquad = { id: null } } = useGetActiveSquadQuery();
  const { data: squadAthletes, isFetching } = useGetAllSquadAthletesQuery({
    refreshCache: true,
  });
  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const canViewAdditionalPopulationTabs =
    isSuccess &&
    permissions.analysis.labelsAndGroups.canReport &&
    window.getFlag('rep-labels-and-groups') &&
    props.showExtendedPopulationOptions;

  const { data: labels = [] } = useGetAllLabelsQuery(undefined, {
    skip: !canViewAdditionalPopulationTabs,
  });
  const { data: segments = [] } = useGetAllGroupsQuery(undefined, {
    skip: !canViewAdditionalPopulationTabs,
  });

  const isTableWidgetFilterTest = window.getFlag('table-widget-filter-test');
  const canReportHistoricSquads =
    isSuccess &&
    permissions.analysis.historicReporting.canReport &&
    window.getFlag('rep-historic-reporting');

  const isPositionGroupsOrAthletes = useMemo(() => {
    return (
      ['position_groups', 'positions', 'athletes'].filter(
        (key) => props.selectedPopulation?.[0]?.[key]?.length
      ).length > 0
    );
  }, [props.selectedPopulation]);

  const isDataFromVisible =
    isTableWidgetFilterTest || isPositionGroupsOrAthletes;

  const dataFromSquadsValue = useMemo(() => {
    return props.selectedPopulation.length
      ? props.selectedPopulation[0].context_squads
      : [];
  }, [props.selectedPopulation]);

  const onAthleteSelect = (population: Array<SquadAthletesSelection>) => {
    if (isTableWidgetFilterTest && population[0]) {
      props.onSetPopulation([population[0]]);
    } else {
      props.onSetPopulation(population);
    }

    // we need to manually close the custom menu list when the user clicks on an option
    if (canViewAdditionalPopulationTabs && !props.isMultiSelect) {
      const selectComp = document.getElementsByClassName(
        'kitmanReactSelect__menu'
      )[0];
      selectComp?.remove();
    }
  };

  const onClick = () => {
    setIsOpen(false);
  };

  const reactSelectProps = useMemo(() => {
    if (canViewAdditionalPopulationTabs && props.isMultiSelect) {
      return {
        menuIsOpen: isOpen,
        onMenuOpen: () => {
          setIsOpen(true);
        },
        onMenuClose: () => {
          setIsOpen(false);
        },
      };
    }
    return {};
  }, [canViewAdditionalPopulationTabs, props.isMultiSelect, isOpen]);

  const renderHistoricSquadSelect = () => {
    return (
      <Panel.Field>
        <Select
          label={props.t('Squads')}
          value={props.selectedPopulation[0].squads[0]}
          options={squadAthletes?.squads?.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          onChange={(squadId) =>
            props.onSetPopulation([
              {
                ...props.selectedPopulation[0],
                squads: [squadId],
                historic: true,
              },
            ])
          }
          inlineShownSelectionMaxWidth={inlineMaxWidth}
          inlineShownSelection
          appendToBody
        />
      </Panel.Field>
    );
  };

  const renderSquadModuleContent = () => {
    return (
      <ClickAwayListener onClickAway={onClick}>
        <div>
          <Panel.Field>
            <AthleteSelect
              data-testid="SquadModule|AthleteSelect"
              isLoading={isFetching}
              squadAthletes={squadAthletes?.squads || []}
              label={props.label || props.t('Athletes')}
              value={props.selectedPopulation}
              defaultSelectedSquadId={activeSquad.id}
              placeholder=""
              onChange={onAthleteSelect}
              renderItemLeft={() => null}
              includeContextSquad={false}
              isMulti={props.enableMultiSelect}
              onClearAllClick={() => props.onSetPopulation([])}
              labels={labels}
              segments={segments}
              components={
                canViewAdditionalPopulationTabs
                  ? {
                      MenuList: MenuListOverride,
                    }
                  : {}
              }
              subtitle={`(${props.t('Aggregate')})`}
              reactSelectProps={reactSelectProps}
            />
          </Panel.Field>
        </div>
      </ClickAwayListener>
    );
  };

  const renderContextSquadSelect = () => {
    return (
      isDataFromVisible && (
        <Panel.Field>
          <Select
            data-testid="SquadModule|SquadsSelect"
            dataAttribute="chart_builder_include_data_from_squads"
            label={props.t('Include data from')}
            placeholder={props.t('All squads')}
            value={dataFromSquadsValue}
            options={squadAthletes?.squads?.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            onChange={(value) =>
              props.onSetPopulation([
                {
                  ...props.selectedPopulation[0],
                  context_squads: [...value],
                },
              ])
            }
            inlineShownSelectionMaxWidth={inlineMaxWidth}
            inlineShownSelection
            isMulti
            appendToBody
            customSelectStyles={fullWidthMenuCustomStyles}
          />
        </Panel.Field>
      )
    );
  };

  const onClickToggleSquad = (isActive: boolean) => {
    setHistoricSquadActive(isActive);
    props.onSetPopulation([EMPTY_SELECTION]);
    props.onSelectGrouping?.({ [EDIT_GROUPING_KEY]: NO_GROUPING });
  };

  return (
    <>
      {canReportHistoricSquads && (
        <HistoricSquadsToggle
          isHistoricSquadActive={isHistoricSquadActive}
          setHistoricSquadActive={onClickToggleSquad}
        />
      )}
      {!canReportHistoricSquads || !isHistoricSquadActive
        ? renderSquadModuleContent()
        : renderHistoricSquadSelect()}
      {renderContextSquadSelect()}
    </>
  );
}

export const SquadModuleTranslated: ComponentType<Props> =
  withNamespaces()(SquadModule);
export default SquadModule;
