// @flow
import { axios } from '@kitman/common/src/utils/services';

export type UserEventRequestAttachment = {
  url: string,
  filename: string,
  filetype: string,
};

type ExternalScout = {
  scout_name: string,
  scout_surname: string,
  email: string,
};

export type UserEventRequest = {
  id: number,
  created_at: string,
  reviewed_at: string,
  user: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
    organisations: Array<{
      id: number,
      name: string,
      logo_full_path: string,
    }>,
  },
  event: {
    id: number,
    start_date: string,
    squad: {
      id: number,
      name: string,
    },
  },
  rejection_reason_id: ?number,
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'withdrawn',
  reason: ?string,
  attachment?: UserEventRequestAttachment,
  is_external?: boolean,
  external_scout?: ExternalScout,
  editable?: boolean,
};

export type TransformedUserEventRequest = {
  id: number,
  editable: boolean,
  requestDate: string,
  requestTime: string,
  reviewDate: string,
  reviewTime: string,
  scout: string,
  status: string,
  team: string,
  teamIcon?: string,
  attachment?: UserEventRequestAttachment,
};

type Props = {
  eventId?: number,
};

export default async (props: Props): Promise<Array<UserEventRequest>> => {
  let url = '/planning_hub/user_event_requests';
  if (props?.eventId) {
    url += `?event_id=${props.eventId}`;
  }
  const { data } = await axios.get(url);
  return data;
};
