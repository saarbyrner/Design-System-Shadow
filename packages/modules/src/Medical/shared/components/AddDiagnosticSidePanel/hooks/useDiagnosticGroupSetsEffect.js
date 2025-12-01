// @flow
import { useEffect } from 'react';
import { getDiagnosticTypeGroupSets } from '@kitman/services';
import type { SetState } from '@kitman/common/src/types/react';
import type { RequestStatus } from '@kitman/common/src/types';

type Params = {
  locationId: number | null,
  setDiagnosticGroupSets: SetState<Array<any>>,
  setRequestIssuesStatus: SetState<RequestStatus>,
};

const useDiagnosticGroupSetsEffect = ({
  locationId,
  setDiagnosticGroupSets,
  setRequestIssuesStatus,
}: Params) => {
  useEffect(() => {
    const fetchDiagnosticGroupSets = async () => {
      if (locationId == null) return;
      try {
        const data = await getDiagnosticTypeGroupSets(locationId);
        const diagnosticTypeGroups = data.map((group) => {
          return {
            ...group,
            name: `${group.name} (${group.diagnostic_types.length})`,
            label: `${group.name} (${group.diagnostic_types.length})`,
            value: `order_sets_${group.id}`,
            type: 'order set',
            options: group.diagnostic_types.map((type) => ({
              ...type,
              value: type.id,
              label: type.name,
              type: 'order set',
            })),
          };
        });

        setDiagnosticGroupSets(diagnosticTypeGroups);
      } catch {
        setRequestIssuesStatus('FAILURE');
      }
    };

    fetchDiagnosticGroupSets();
  }, [locationId]);
};

export default useDiagnosticGroupSetsEffect;
