// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventsUser } from '@kitman/common/src/types/Event';

export type GetStaffOnlyResponse = Array<EventsUser>;

type Props = {
  orgId?: number | null,
  includeDisciplineStatus?: boolean,
  eventId?: number,
  includeStaffRole?: boolean,
};

export const getStaffOnly = async (
  props: ?Props
): Promise<GetStaffOnlyResponse> => {
  let urlParams = {};

  if (props?.includeDisciplineStatus) {
    urlParams = {
      include_discipline_status: true,
      event_id: props?.eventId,
    };
  }

  if (props?.includeStaffRole) {
    urlParams = {
      ...urlParams,
      include_staff_role: true,
    };
  }

  if (props?.orgId) {
    urlParams = {
      ...urlParams,
      organisation_id: props?.orgId,
    };
  }

  const { data } = await axios.get('/users/staff_only', { params: urlParams });
  return data;
};
