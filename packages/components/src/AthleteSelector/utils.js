// @flow

import i18n from '@kitman/common/src/utils/i18n';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { SquadAthletes, SquadAthletesSelection } from './types';

export const getSelectedItems = (
  selectedSquadAthletes: SquadAthletesSelection,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>
) => {
  const selectedItems = [];

  if (selectedSquadAthletes.applies_to_squad) {
    selectedItems.push(i18n.t('#sport_specific__Entire_Squad'));
  }

  squadAthletes.position_groups.forEach((positionGroup) => {
    if (selectedSquadAthletes.position_groups.includes(positionGroup.id)) {
      selectedItems.push(positionGroup.name);
    }

    positionGroup.positions.forEach((position) => {
      if (selectedSquadAthletes.positions.includes(position.id)) {
        selectedItems.push(position.name);
      }

      position.athletes.forEach((athlete) => {
        if (selectedSquadAthletes.athletes.includes(athlete.id)) {
          selectedItems.push(athlete.fullname);
        }
      });
    });
  });

  if (selectedSquadAthletes.all_squads) {
    selectedItems.push(i18n.t('#sport_specific__All_Squads'));
  }

  if (selectedSquadAthletes.squads && selectedSquadAthletes.squads.length > 0) {
    squads?.forEach((squad) => {
      if (selectedSquadAthletes.squads.includes(squad.id)) {
        selectedItems.push(squad.name);
      }
    });
  }

  return selectedItems.join(', ');
};

export const isSelectionEmpty = (
  selectedSquadAthletes: SquadAthletesSelection
) => {
  return (
    !selectedSquadAthletes.applies_to_squad &&
    selectedSquadAthletes.position_groups.length === 0 &&
    selectedSquadAthletes.positions.length === 0 &&
    selectedSquadAthletes.athletes.length === 0 &&
    !selectedSquadAthletes.all_squads &&
    (!selectedSquadAthletes.squads || selectedSquadAthletes.squads.length === 0)
  );
};
