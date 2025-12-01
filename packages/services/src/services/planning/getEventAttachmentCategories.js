// @flow
import { axios } from '@kitman/common/src/utils/services';

export type EventAttachmentCategory = {
  id: number,
  name: string,
  created_at: string,
  updated_at: string,
  archived: false,
};

// Used in the calendar event side panel
const getEventAttachmentCategories = async (): Promise<
  Array<EventAttachmentCategory>
> => {
  const { data } = await axios.get(
    `/ui/planning_hub/event_attachment_categories?archived=false`
  );

  return data;
};

export default getEventAttachmentCategories;
