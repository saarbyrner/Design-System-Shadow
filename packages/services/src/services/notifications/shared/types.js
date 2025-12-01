// @flow

export type Attachment = {
  id: number,
  name?: string,
  filetype: string,
  filesize: number,
  filename: string,
  url: string,
};
export type EmailResponse = {
  id: number,
  message_status: 'errored' | 'not_errored',
  subject: string,
  kind: string,
  recipient: string,
  created_at: string,
  notificationable_id: number,
  notificationable_type: 'Event',
  message?: string,
  trigger_kind: 'manual' | 'automatic',
  attachments: Array<Attachment>,
  notifications_version: {
    id: number,
    version: number,
    kind: string,
  },
};

export type Meta = {
  current_page: number,
  next_page: number | null,
  prev_page: number | null,
  total_count: number,
  total_pages: number,
};
