// @flow
import { useState } from 'react';
import {
  useGetPaginatedAthleteEventsQuery,
  useUpdateAthleteAttendanceMutation,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi';
import type { AthleteEventV2 } from '@kitman/common/src/types/Event';
import type { Params as UpdateEventAttributesParams } from '@kitman/services/src/services/planning/updateEventAttributes';

type ManageAthleteEventsReturnType = {
  isError: boolean,
  isSuccess: boolean,
  data: { athlete_events: Array<AthleteEventV2>, next_id: string },
  resetAthleteEventsGrid: () => Promise<void>,
  getNextAthleteEvents: (nextId: string) => void,
  nextId: string | null,
  updateAthleteAttendance: (input: UpdateEventAttributesParams) => {
    unwrap: () => Promise<{ message: string }>,
  },
};

const useManageAthleteEventsGrid = (
  eventId: number
): ManageAthleteEventsReturnType => {
  const [nextId, setNextId] = useState(null);

  const { isError, isSuccess, data, refetch } =
    useGetPaginatedAthleteEventsQuery({
      eventId,
      nextId,
    });

  const [updateAthleteAttendance] = useUpdateAthleteAttendanceMutation();

  const resetAthleteEventsGrid = async () => {
    if (nextId !== null) {
      setNextId(null);
    } else {
      await refetch();
    }
  };

  const getNextAthleteEvents = (nextIdInput: string) => {
    setNextId(nextIdInput);
  };

  return {
    isError,
    isSuccess,
    data,
    resetAthleteEventsGrid,
    getNextAthleteEvents,
    nextId,
    updateAthleteAttendance,
  };
};
export default useManageAthleteEventsGrid;
