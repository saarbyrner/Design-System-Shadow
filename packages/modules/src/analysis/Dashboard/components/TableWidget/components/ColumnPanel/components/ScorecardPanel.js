// @flow
import { useCallback, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';
import { TextButton, Checkbox } from '@kitman/components';
import { DateRangeModuleTranslated as DateRangeModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule';
import { AthleteModuleTranslated as AthleteModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AthleteModule';
import { SquadModuleTranslated as SquadModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/SquadModule';
import { isDateRangeValid } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import type { SquadAthletes } from '@kitman/components/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { DateRange } from '@kitman/common/src/types';

type Props = {
  onSetPopulation: Function,
  onApply: Function,
  selectedPopulation: SquadAthletesSelection,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  isLoading: boolean,
  isEditMode: boolean,
  isOpen: boolean,
  dateRange: ?DateRange,
  onSetDateRange: Function,
  onSetTimePeriod: Function,
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  timePeriod: string,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
};

const emptySquadAthletesSelection = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
};

function ScorecardPanel(props: I18nProps<Props>) {
  const canApply = useCallback(() => {
    return (
      !props.isLoading &&
      isDateRangeValid(
        props.timePeriod,
        props.dateRange,
        props.timePeriodLength
      ) &&
      !_isEqual(props.selectedPopulation, emptySquadAthletesSelection)
    );
  }, [
    props.isLoading,
    props.timePeriod,
    props.dateRange,
    props.timePeriodLength,
    props.selectedPopulation,
  ]);
  const [addAnother, setAddAnother] = useState(false);

  const onKeyDown = useCallback(
    ({ keyCode }) => {
      const RIGHT_ARROW_KEY_CODE = 39;

      if (keyCode === RIGHT_ARROW_KEY_CODE && canApply()) {
        props.onApply(addAnother);
      }
    },
    [props.onApply, addAnother, canApply]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [props.isOpen, onKeyDown]);

  return (
    <Panel>
      <Panel.Content>
        {window.getFlag('graph-squad-selector') ? (
          <SquadModule
            data-testid="ScorecardPanel|SquadModule"
            selectedPopulation={[props.selectedPopulation]}
            onSetPopulation={(population) =>
              props.onSetPopulation(population[0])
            }
            showExtendedPopulationOptions
          />
        ) : (
          <AthleteModule
            data-testid="ScorecardPanel|AthleteModule"
            selectedPopulation={props.selectedPopulation}
            squadAthletes={props.squadAthletes}
            squads={props.squads}
            onSetPopulation={props.onSetPopulation}
          />
        )}
        <DateRangeModule
          data-testid="ScorecardPanel|DateRangeModule"
          dateRange={props.dateRange}
          onSetDateRange={props.onSetDateRange}
          onSetTimePeriod={props.onSetTimePeriod}
          onSetTimePeriodLength={props.onSetTimePeriodLength}
          onSetTimePeriodLengthOffset={props.onSetTimePeriodLengthOffset}
          timePeriod={props.timePeriod}
          timePeriodLength={props.timePeriodLength}
          timePeriodLengthOffset={props.timePeriodLengthOffset}
        />
      </Panel.Content>
      <Panel.Loading isLoading={props.isLoading} />
      <Panel.Actions>
        {!props.isEditMode && (
          <Checkbox
            data-testid="ScorecardPanel|AddAnother"
            id="add-another"
            name="add-another"
            isChecked={addAnother}
            toggle={() => setAddAnother(!addAnother)}
            label={props.t('Add another')}
            isLabelPositionedOnTheLeft
            kitmanDesignSystem
          />
        )}
        <TextButton
          data-testid="ScorecardPanel|Apply"
          onClick={() => props.onApply(addAnother)}
          isDisabled={!canApply()}
          type="primary"
          text={props.t('Apply')}
          kitmanDesignSystem
        />
      </Panel.Actions>
    </Panel>
  );
}

export const ScorecardPanelTranslated = withNamespaces()(ScorecardPanel);
export default ScorecardPanel;
