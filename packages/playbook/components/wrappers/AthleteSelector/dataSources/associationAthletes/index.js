// @flow

import { useEffect, useMemo, useState } from 'react';
import getAssociationHierarchy from '@kitman/services/src/services/athlete/associationHierarchy/getAssociationHierarchy';
import type { AthletesInAssociationHierarchy } from '@kitman/services/src/services/athlete/associationHierarchy/types';
import i18n from '@kitman/common/src/utils/i18n';
import type { UseDataResult } from '../../shared/types';
import {
  mapAthletesToOrganizationGroups,
  mapAthleteToSquadGroups,
} from './mappers';

const AssociationGroups = {
  ORGANISATION: 'organisation',
  SQUAD: 'squad',
};

const mappers = {
  [AssociationGroups.ORGANISATION]: mapAthletesToOrganizationGroups,
  [AssociationGroups.SQUAD]: mapAthleteToSquadGroups,
};

const labels = {
  [AssociationGroups.ORGANISATION]: i18n.t('Club') ?? 'Club',
  [AssociationGroups.SQUAD]: i18n.t('Squad') ?? 'Squad',
};

const useAssociationAthletes = (): UseDataResult => {
  const [groupMode, setGroupMode] = useState<string>(
    AssociationGroups.ORGANISATION
  );
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AthletesInAssociationHierarchy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const associationData = await getAssociationHierarchy();
        setData(associationData);
        setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load athletes');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const mappedData = useMemo(() => {
    if (!data) {
      return {
        groups: [],
        athletes: [],
      };
    }

    return mappers[groupMode](data);
  }, [data, groupMode]);

  const grouping = {
    options: (Object.keys(labels): Array<$Keys<typeof labels>>).map((key) => ({
      value: key,
      label: labels[key],
    })),
    current: groupMode,
    setCurrent: setGroupMode,
  };

  return {
    isLoading,
    groups: mappedData.groups,
    athletes: mappedData.athletes,
    error,
    grouping,
  };
};

export { useAssociationAthletes };
