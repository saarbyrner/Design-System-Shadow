// @flow
import { useState } from 'react';

const useAthleteSelection = () => {
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<Array<number>>(
    []
  );

  const toggleSingleAthleteSelection = (
    athleteId: number,
    checked: boolean
  ) => {
    let updatedSelectedAthletes;
    if (checked) {
      updatedSelectedAthletes = [...selectedAthleteIds, athleteId];
    } else {
      updatedSelectedAthletes = selectedAthleteIds.filter(
        (id) => id !== athleteId
      );
    }
    setSelectedAthleteIds(updatedSelectedAthletes);
  };

  return {
    selectedAthleteIds,
    setSelectedAthleteIds,
    toggleSingleAthleteSelection,
  };
};

export default useAthleteSelection;
