// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { getAvailabilityList } from '@kitman/common/src/utils/workload';
import { AthleteSelector, MultiSelectDropdown } from '@kitman/components';
import type { DropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getEmptyAthleteSelection } from '../utils';
import type { Squad, Participant } from '../types';

type Props = {
  primarySquads: Array<?Squad>,
  squad: Squad,
  participants: Array<Participant>,
  participationLevels: Array<DropdownItem>,
  onFilterChange: Function,
};

const ParticipantsFilter = (props: I18nProps<Props>) => {
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [participationLevelFilter, setParticipationLevelFilter] = useState([]);
  const [squadFilter, setSquadFilter] = useState([]);
  const [athletesFilter, setAthletesFilter] = useState(
    getEmptyAthleteSelection()
  );

  useEffect(() => {
    const filteredAthletes = props.participants
      .filter((participant) => {
        // Filter by squad
        if (!participant.squads.includes(props.squad.id)) {
          return false;
        }

        // Filter by athlete
        if (
          athletesFilter.athletes.length > 0 &&
          !athletesFilter.athletes.includes(participant.athlete_id)
        ) {
          return false;
        }

        // Filter by availability
        if (
          availabilityFilter.length > 0 &&
          !availabilityFilter.includes(participant.availability)
        ) {
          return false;
        }

        // Filter by participation level
        if (
          participationLevelFilter.length > 0 &&
          !participationLevelFilter.includes(
            participant.participation_level_id?.toString()
          )
        ) {
          return false;
        }

        // Filter by squad
        if (
          squadFilter.length > 0 &&
          !squadFilter.includes(participant.primary_squad_id?.toString())
        ) {
          return false;
        }

        return true;
      })
      .map((participant) => participant.athlete_id);

    props.onFilterChange(filteredAthletes);
  }, [
    availabilityFilter,
    athletesFilter,
    participationLevelFilter,
    squadFilter,
  ]);

  const isPrimarySquadPresent = () =>
    props.participants.find((athlete) => athlete.primary_squad_id !== null);

  return (
    <div className="participantsFilter row">
      <div className="col-md-3">
        <MultiSelectDropdown
          label={props.t('Filter Availability')}
          listItems={getAvailabilityList()}
          onItemSelect={(availability) => {
            if (availability.checked) {
              setAvailabilityFilter([...availabilityFilter, availability.id]);
            } else {
              setAvailabilityFilter(
                availabilityFilter.filter(
                  (availabilityId) => availabilityId !== availability.id
                )
              );
            }
          }}
          selectedItems={availabilityFilter}
        />
      </div>
      {isPrimarySquadPresent() && (
        <div className="col-md-3">
          <MultiSelectDropdown
            label={props.t('#sport_specific__Filter_Primary_Squad')}
            listItems={props.primarySquads}
            onItemSelect={(squad) => {
              if (squad.checked) {
                setSquadFilter([...squadFilter, squad.id]);
              } else {
                setSquadFilter(
                  squadFilter.filter((squadId) => squadId !== squad.id)
                );
              }
            }}
            selectedItems={squadFilter}
          />
        </div>
      )}
      <div className="col-md-3">
        <AthleteSelector
          label={props.t('#sport_specific__Filter_Athletes')}
          squadAthletes={props.squad}
          selectedSquadAthletes={athletesFilter}
          onSelectSquadAthletes={(squadAthletesSelection) =>
            setAthletesFilter(squadAthletesSelection)
          }
          onlyAthletes
        />
      </div>
      <div className="col-md-3">
        <MultiSelectDropdown
          label={props.t('Filter Participation Level')}
          listItems={props.participationLevels}
          onItemSelect={(participationLevel) => {
            if (participationLevel.checked) {
              setParticipationLevelFilter([
                ...participationLevelFilter,
                participationLevel.id,
              ]);
            } else {
              setParticipationLevelFilter(
                participationLevelFilter.filter(
                  (participationLevelId) =>
                    participationLevelId !== participationLevel.id
                )
              );
            }
          }}
          selectedItems={participationLevelFilter}
        />
      </div>
    </div>
  );
};

export default ParticipantsFilter;
export const ParticipantsFilterTranslated =
  withNamespaces()(ParticipantsFilter);
