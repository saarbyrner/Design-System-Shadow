// @flow
import { useEffect, useState } from 'react';

import { InputNumeric } from '@kitman/components';
import { getActiveSquad } from '@kitman/services';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';

import getEventQuantities from '../../services/getEventQuantities';
import type {
  EventQuantities,
  WorkloadUnit,
} from '../../services/getEventQuantities';
import type {
  GameTrainingEventFormData,
  OnUpdateEventDetails,
} from '../../types';

export type Props = {
  event: GameTrainingEventFormData,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

const checkIsNumberInvalid = (
  input: ?number,
  min: ?number,
  max: ?number
): boolean => {
  if (input == null) {
    return false; // All optional values so this is valid
  }

  if (min != null && input < min) {
    return true; // Is invalid
  }

  if (max != null && input > max) {
    return true; // Is invalid
  }

  return false; // Valid
};

const WorkloadUnitFields = (props: Props) => {
  const { onDataLoadingStatusChanged } = props;
  // eslint-disable-next-line no-unused-vars
  const [activeSquadData, setActiveSquadData] = useState<?Squad>(null);
  const [workloadUnitsData, setWorkloadUnitsData] =
    useState<?Array<WorkloadUnit>>(null);

  useEffect(() => {
    let mounted = true;
    const getEventType = () => {
      if (props.event.type === 'game_event') {
        return 'game';
      }
      return 'session';
    };
    getActiveSquad().then(
      (squad: Squad) => {
        if (mounted) {
          onDataLoadingStatusChanged('SUCCESS', 'getActiveSquad', null);
          setActiveSquadData(squad);
          const eventType = getEventType();
          if (eventType) {
            getEventQuantities(eventType, squad.id).then(
              (eventQuantities: EventQuantities) => {
                if (mounted) {
                  setWorkloadUnitsData(eventQuantities.setlist?.units);
                  onDataLoadingStatusChanged(
                    'SUCCESS',
                    'getEventQuantities',
                    null
                  );
                }
              },
              () => {
                if (mounted) {
                  onDataLoadingStatusChanged(
                    'FAILURE',
                    'getEventQuantities',
                    null
                  );
                }
              }
            );
          }
        }
      },
      () => {
        if (mounted) {
          onDataLoadingStatusChanged('FAILURE', 'getActiveSquad', null);
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [onDataLoadingStatusChanged, props.event]);

  if (workloadUnitsData) {
    return (
      <>
        {workloadUnitsData.map((workloadUnit: WorkloadUnit) => {
          return (
            <InputNumeric
              label={workloadUnit.name}
              name={workloadUnit.perma_id}
              value={
                props.event.workload_units?.[workloadUnit.perma_id] ?? undefined
              }
              onChange={(value) => {
                const number =
                  workloadUnit.rounding_places === 0
                    ? Number.parseInt(value, 10)
                    : Number.parseFloat(value);
                const currentUnits = props.event.workload_units
                  ? props.event.workload_units
                  : {};
                currentUnits[workloadUnit.perma_id] = number;
                props.onUpdateEventDetails({
                  workload_units: currentUnits,
                });
              }}
              kitmanDesignSystem
              key={`workload_${workloadUnit.perma_id}`}
              descriptor={workloadUnit.unit ? workloadUnit.unit : undefined}
              isInvalid={checkIsNumberInvalid(
                props.event.workload_units?.[workloadUnit.perma_id],
                workloadUnit.min,
                workloadUnit.max
              )}
            />
          );
        })}
      </>
    );
  }

  return <></>;
};

export default WorkloadUnitFields;
