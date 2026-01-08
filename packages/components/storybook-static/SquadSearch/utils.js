/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
export const flattenSquadSearchItems = (
  athletes,
  athletesOrder,
  positions,
  positionsOrder,
  positionGroups,
  positionGroupsOrder,
  missingAthletes,
  squads
) => {
  const itemsArray = [];

  itemsArray.push({
    id: 'applies_to_squad',
    title: 'Entire Squad',
    description: 'Select Entire Squad',
  });

  positionGroupsOrder.forEach((id) => {
    // we want to exclude the 'Other' option
    if (positionGroups[id] !== 'Other') {
      itemsArray.push({
        id: `position_group_${id}`,
        title: positionGroups[id],
        description: `Select all ${positionGroups[id]}`,
      });
    }
  });

  positionsOrder.forEach((id) => {
    itemsArray.push({
      id: `position_${id}`,
      title: positions[id],
      description: `Select all ${positions[id]}`,
    });
  });

  athletesOrder.forEach((id) => {
    itemsArray.push({
      id: `athlete_${id}`,
      title: `${athletes[id].firstname} ${athletes[id].lastname}`,
      description: '',
    });
  });

  missingAthletes.forEach((missingAthlete) => {
    itemsArray.push({
      id: `athlete_${missingAthlete.id}`,
      title: `${missingAthlete.firstname} ${missingAthlete.lastname}`,
      description: '',
    });
  });

  if (squads) {
    itemsArray.push({
      id: 'all_squads',
      title: 'All Squads',
      description: 'Select All Squads',
    });

    squads.forEach((squad) => {
      itemsArray.push({
        id: `squad_${squad.id}`,
        title: squad.name,
        description: `Select all ${squad.name}`,
      });
    });
  }

  return itemsArray;
};

export const flattenSelectedItems = (
  selectedAthletes = [],
  selectedPositions = [],
  selectedPositionGroups = [],
  appliesToSquad = false,
  appliesToAllSquads = false,
  selectedSquads = []
) => {
  const selectedItemsArray = [];

  if (appliesToSquad) {
    selectedItemsArray.push('applies_to_squad');
  }

  if (appliesToAllSquads) {
    selectedItemsArray.push('all_squads');
  }

  selectedSquads.forEach((id) => {
    selectedItemsArray.push(`squad_${id}`);
  });

  selectedPositionGroups.forEach((id) => {
    selectedItemsArray.push(`position_group_${id}`);
  });

  selectedPositions.forEach((id) => {
    selectedItemsArray.push(`position_${id}`);
  });

  selectedAthletes.forEach((athlete) => {
    /*
     * "athlete" is an athlete ID (string).
     * It is different during the initialisation of the alarm edition modal.
     * In this case, "athlete" is an athlete object.
     * It is because the modal needs the extra information "on_dashboard".
     */
    selectedItemsArray.push(`athlete_${athlete.id || athlete}`);
  });

  return selectedItemsArray;
};

export const flattenSquadSelection = (squadSelection) => {
  const selectedItemsArray = [];
  const selection = {
    appliesToSquad: squadSelection.applies_to_squad,
    all_squads: squadSelection.all_squads,
    squads: squadSelection.squads || [],
    position_groups: squadSelection.position_groups || [],
    positions: squadSelection.positions || [],
    athletes: squadSelection.athletes || [],
  };

  if (selection.appliesToSquad) {
    selectedItemsArray.push('applies_to_squad');
  }

  if (selection.all_squads) {
    selectedItemsArray.push('all_squads');
  }

  selection.squads.forEach((id) => {
    selectedItemsArray.push(`squad_${id}`);
  });

  selection.position_groups.forEach((id) => {
    selectedItemsArray.push(`position_group_${id}`);
  });

  selection.positions.forEach((id) => {
    selectedItemsArray.push(`position_${id}`);
  });

  selection.athletes.forEach((athlete) => {
    /*
     * "athlete" is an athlete ID (string).
     * It is different during the initialisation of the alarm edition modal.
     * In this case, "athlete" is an athlete object.
     * It is because the modal needs the extra information "on_dashboard".
     */
    selectedItemsArray.push(`athlete_${athlete.id || athlete}`);
  });

  return selectedItemsArray;
};

export const formatSelectedItems = (selectedItems = []) => {
  const formattedSelectedItems = {
    positions: [],
    position_groups: [],
    athletes: [],
    squads: [],
    applies_to_squad: selectedItems.indexOf('applies_to_squad') !== -1,
    all_squads: selectedItems.indexOf('all_squads') !== -1,
  };

  selectedItems.forEach((key) => {
    const info = key.split('_');
    if (info[1] === 'group') {
      formattedSelectedItems.position_groups.push(parseInt(info[2], 10));
    } else if (info[0] === 'position') {
      formattedSelectedItems.positions.push(parseInt(info[1], 10));
    } else if (info[0] === 'athlete') {
      formattedSelectedItems.athletes.push(parseInt(info[1], 10));
    } else if (info[0] === 'squad') {
      formattedSelectedItems.squads.push(parseInt(info[1], 10));
    }
  });

  return formattedSelectedItems;
};
