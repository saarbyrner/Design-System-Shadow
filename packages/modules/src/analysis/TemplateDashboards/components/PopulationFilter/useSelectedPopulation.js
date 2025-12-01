// @flow
import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import useFilterValues from '../../hooks/useFilterValues';
import {
  useGetAllSquadAthletesQuery,
  useGetStaffUsersQuery,
} from '../../redux/services/templateDashboards';
import { isGrowthAndMaturationReport, isStaffDevelopment } from '../../utils';

type populationProps = {
  labelOnly?: boolean,
};

const useSelectedPopulation = (props?: populationProps): Object => {
  const { population } = useFilterValues(['population']);
  const { data } = useGetAllSquadAthletesQuery(
    isGrowthAndMaturationReport() ? {} : { refreshCache: true }
  );
  // skip needs to be passed as the second argument, or else it is passed to the actual API
  const { data: staffUsers = [] } = useGetStaffUsersQuery(undefined, {
    skip: isStaffDevelopment(),
  });
  const allSquads = data?.squads || [];

  const getLabel = (input: Object[]) => {
    return input.map(({ name, fullname }) => name || fullname).join(', ');
  };

  const athletes = useMemo(() => {
    const squads = data?.squads || [];
    const allSelected = squads.reduce((acc, curr) => {
      const selectedSquads = [];
      const selectedPositionGroups = [];
      const selectedPositions = [];
      const selectedAthletes = [];

      if (population.squads.includes(curr.id)) {
        selectedSquads.push(curr);
      }

      curr.position_groups.forEach((positionGroup) => {
        if (population.position_groups.includes(positionGroup.id)) {
          selectedPositionGroups.push(positionGroup);
        }

        // eslint-disable-next-line max-nested-callbacks
        positionGroup.positions.forEach((position) => {
          if (population.positions.includes(position.id)) {
            selectedPositions.push(position);
          }

          // eslint-disable-next-line max-nested-callbacks
          position.athletes.forEach((athlete) => {
            if (population.athletes.includes(athlete.id)) {
              selectedAthletes.push(athlete);
            }
          });
        });
      });

      return [
        ...acc,
        ...selectedSquads,
        ...selectedPositionGroups,
        ...selectedPositions,
        ...selectedAthletes,
      ];
    }, []);

    const uniqueSelected = uniqBy(allSelected, 'id');

    if (props?.labelOnly) {
      return getLabel(uniqueSelected);
    }
    return uniqueSelected;
  }, [
    data?.squads,
    props?.labelOnly,
    population.squads,
    population.position_groups,
    population.positions,
    population.athletes,
  ]);

  const squads = useMemo(() => {
    const all = allSquads.filter((squad) =>
      population?.context_squads?.includes(squad.id)
    );
    if (props?.labelOnly) {
      return getLabel(all);
    }
    return all;
  }, [allSquads, population?.context_squads, props?.labelOnly]);

  const users = useMemo(() => {
    const all = staffUsers.filter((user) =>
      population?.users?.includes(user.id)
    );
    if (props?.labelOnly) {
      return getLabel(all);
    }
    return all;
  }, [population?.users, props?.labelOnly, staffUsers]);

  return { athletes, squads, users };
};

export default useSelectedPopulation;
