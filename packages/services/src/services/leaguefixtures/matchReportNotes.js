// @flow
import { axios } from '@kitman/common/src/utils/services';

type MatchReportNoteResult = {
  event_notes: string,
};

export const getMatchReportNotes = async ({
  eventId,
  supervisorView,
}: {
  eventId: number,
  supervisorView?: boolean,
}): Promise<MatchReportNoteResult> => {
  let url = `/planning_hub/events/${eventId}/freetext_values?freetext_component_names[]=event_notes`;

  if (supervisorView) {
    url += '&supervisor_view=true';
  }
  const { data } = await axios.get(url);
  return data;
};

export const saveMatchReportNotes = async (
  eventId: number,
  updatedNotes: string
): Promise<MatchReportNoteResult> => {
  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/freetext_values`,
    {
      freetext_components: [
        {
          name: 'event_notes',
          value: updatedNotes,
        },
      ],
    }
  );
  return data;
};
