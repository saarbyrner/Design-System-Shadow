// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo } from 'react';
import { Select } from '@kitman/components';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad } from '@kitman/common/src/types/Squad';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';

type Props = {
  selectedPopulation: SquadAthletesSelection,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  onSetPopulation: Function,
  label?: string,
};

const buildValue = (id, group) => `${group}|${id}`;
const parseValue = (value) => {
  const parsed = value.split('|');
  const valueId: number = parseInt(parsed[1], 10);

  return {
    [parsed[0]]: Number.isNaN(valueId) ? true : [valueId],
  };
};

const squadAthletesSelectionToValue = (
  squadAthletesSelection: SquadAthletesSelection
) => {
  if (squadAthletesSelection.applies_to_squad) {
    return 'applies_to_squad';
  }

  if (squadAthletesSelection.all_squads) {
    return 'all_squads';
  }

  return ['position_groups', 'positions', 'athletes', 'squads'].reduce(
    (acc, curr) => {
      if (squadAthletesSelection[curr].length) {
        return buildValue(squadAthletesSelection[curr][0], curr);
      }

      return acc;
    },
    ''
  );
};

function AthleteModule(props: I18nProps<Props>) {
  const squadAthletesOptions = useMemo(() => {
    const highlightedStyles = {
      fontWeight: '600',
    };

    const groupTranslation = (name) => props.t('{{name}} (group)', { name });

    return [
      {
        label: props.t('Entire Squad'),
        options: [
          {
            value: 'applies_to_squad',
            label: props.t('Entire Squad (group)'),
            styles: highlightedStyles,
          },
        ],
      },

      ...props.squadAthletes.position_groups.map((positionGroup) => {
        const options = [
          {
            value: buildValue(positionGroup.id, 'position_groups'),
            label: groupTranslation(positionGroup.name),
            styles: highlightedStyles,
          },
        ];
        const athleteMapper = (athlete) => {
          options.push({
            value: buildValue(athlete.id, 'athletes'),
            label: athlete.fullname,
          });
        };

        positionGroup.positions.forEach((position) => {
          options.push({
            value: buildValue(position.id, 'positions'),
            label: groupTranslation(position.name),
            styles: highlightedStyles,
          });
          position.athletes.forEach(athleteMapper);
        });

        return {
          label: positionGroup.name,
          options,
        };
      }),

      {
        label: props.t('All Squads'),
        options: [
          {
            value: 'all_squads',
            label: props.t('All Squads (group)'),
            styles: highlightedStyles,
          },
          ...props.squads.map((squad) => ({
            label: squad.name,
            value: buildValue(squad.id, 'squads'),
          })),
        ],
      },
    ];
  }, [props.squadAthletes, props.t]);

  return (
    <Panel.Field>
      <Select
        data-testid="AthleteModule|SquadSelect"
        label={props.label || props.t('Athlete')}
        options={squadAthletesOptions}
        onChange={(selection) => {
          props.onSetPopulation({
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
            ...parseValue(selection),
          });
        }}
        value={squadAthletesSelectionToValue(props.selectedPopulation)}
        menuPosition="fixed"
        appendToBody
      />
    </Panel.Field>
  );
}

export const AthleteModuleTranslated = withNamespaces()(AthleteModule);
export default AthleteModule;
