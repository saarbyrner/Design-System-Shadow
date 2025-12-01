// @flow
import type { AthletesInAssociationHierarchy } from '@kitman/services/src/services/athlete/associationHierarchy/types';
import type { Group, Athlete } from '../../shared/types';

type MappedData = {
  groups: Group[],
  athletes: Athlete[],
};

const mapAthletesToOrganizationGroups = (
  hierarchy: AthletesInAssociationHierarchy
): MappedData => {
  const association = hierarchy.association;
  const groups: Group[] = [];
  const athleteMap = new Map<number, Athlete>(); // to skip duplicates

  association.organisations.forEach((organization) => {
    const orgChildren = organization.squads.map((squad) => {
      const mappedAthletes = squad.athletes.map((athlete) => {
        const mapped: Athlete = {
          key: `org-${organization.id}-squad-${squad.id}-athlete-${athlete.id}`,
          id: athlete.id,
          name: athlete.fullname,
          squadId: squad.id,
          squadName: squad.name,
        };

        if (!athleteMap.has(athlete.id)) {
          athleteMap.set(athlete.id, mapped);
        }

        return mapped;
      });

      return {
        key: `org-${organization.id}-squad-${squad.id}`,
        title: squad.name,
        athletes: mappedAthletes,
        children: [],
      };
    });

    groups.push({
      key: `org-${organization.id}`,
      title: organization.name,
      children: orgChildren,
    });
  });

  return {
    groups,
    athletes: Array.from(athleteMap.values()),
  };
};

const mapAthleteToSquadGroups = (
  hierarchy: AthletesInAssociationHierarchy
): MappedData => {
  const { association } = hierarchy;
  const athleteMap = new Map<number, Athlete>();

  const squads = association.organisations.flatMap((organization) =>
    organization.squads.map((squad) => ({
      organizationId: organization.id,
      organizationName: organization.name,
      id: squad.id,
      name: squad.name,
      athletes: squad.athletes,
    }))
  );

  const uniqueSquads = Array.from(
    new Map(squads.map((squad) => [squad.id, squad])).values()
  );

  const groups = uniqueSquads.map((squad) => {
    const mappedAthletes = squad.athletes.map((athlete) => {
      const mapped: Athlete = {
        key: `squad-${squad.id}-athlete-${athlete.id}`,
        id: athlete.id,
        name: athlete.fullname,
        squadId: squad.id,
        squadName: squad.name,
      };

      if (!athleteMap.has(athlete.id)) {
        athleteMap.set(athlete.id, mapped);
      }

      return mapped;
    });

    return {
      key: `squad-${squad.id}`,
      title: squad.name,
      subtitle: squad.organizationName,
      athletes: mappedAthletes,
      children: [],
    };
  });

  return {
    groups,
    athletes: Array.from(athleteMap.values()),
  };
};

export { mapAthletesToOrganizationGroups, mapAthleteToSquadGroups };
