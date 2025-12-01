// @flow
import { useContext } from 'react';
import { AthleteDataContext } from '@kitman/common/src/contexts/AthleteDataContext/AthleteDataContext';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { SquadAthletesSelectOption } from '../types';

type PreviousOrganisation = {
  has_open_illnesses: boolean,
  has_open_injuries: boolean,
};

type SquadAthletes = {
  squads: Array<{
    id: string,
    name: string,
    athletes: Array<{
      fullname: string,
      id: string,
      previous_organisation: PreviousOrganisation,
    }>,
  }>,
};

const useSquadAthletesSelectOptions = ({
  isAthleteSelectable,
  squadAthletes = [],
  withPreviousOrganisation,
}: {
  isAthleteSelectable?: boolean,
  squadAthletes?: SquadAthletes,
  withPreviousOrganisation?: boolean,
}): Array<SquadAthletesSelectOption> => {
  const athleteData = useContext<AthleteData>(AthleteDataContext);
  const isPastAthlete = !!athleteData?.org_last_transfer_record?.left_at;
  const isActive = !!athleteData?.is_active;

  // this check is to make we are on Athlete or Issue level before
  // scoping to only inactive athlete, not selectable, or past athlete
  if (athleteData?.fullname && athleteData?.id) {
    // return only the selected athlete as option if not he is not selectable, past athlete or is inactive
    if (!isAthleteSelectable || isPastAthlete || !isActive) {
      const selectedAthleteOption: Array<SquadAthletesSelectOption> = [
        {
          label: athleteData.fullname,
          value: athleteData.id,
        },
      ];

      return selectedAthleteOption;
    }

    if (!squadAthletes?.squads?.length) {
      return [];
    }

    // this case is only used in the AddIssueSidePanel as of now where previous_organisation is needed as some point
    // and squad_id used to get the squad associated with the athlete when the user selects an athlete
    // previously we were concatenating the squad id with the athlete id and passing it as value (not ideal)
    if (withPreviousOrganisation) {
      return squadAthletes?.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes
          .map((athlete) => ({
            label: athlete.fullname,
            value: athlete.id,
            previous_organisation: athlete?.previous_organisation,
            squad_id: squad?.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      }));
    }
  }

  return squadAthletes?.squads.map((squad) => ({
    label: squad.name,
    options: squad.athletes.map((athlete) => ({
      label: athlete.fullname,
      value: athlete.id,
    })),
  }));
};

export default useSquadAthletesSelectOptions;
