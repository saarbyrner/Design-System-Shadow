/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';

const createDrill = async ({
  name,
  event_activity_type_id,
  notes,
  diagram,
  attachments,
  principle_ids,
  links,
  event_activity_drill_labels,
  intensity,
  library,
  squad_ids,
}: EventActivityDrillV2): Promise<EventActivityDrillV2> => {
  const { data } = await axios.post('/planning_hub/event_activity_drills', {
    name,
    event_activity_type_id,
    notes,
    diagram,
    attachments,
    principle_ids,
    links,
    event_activity_drill_label_ids:
      event_activity_drill_labels?.map(({ id }) => id) || [],
    intensity,
    library,
    squad_ids,
  });
  return data;
};
export default createDrill;
