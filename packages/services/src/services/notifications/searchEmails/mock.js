// @flow
export const number = 1;

const attachments = [
  {
    id: 1,
    filename: 'test.png',
    filetype: 'image/png',
    url: 'https://example.com/test.png',
  },
  {
    id: 2,
    filename: 'test.pdf',
    filetype: 'application/pdf',
    url: 'https://example.com/test.pdf',
  },
];

export const mockEmailLogs = [
  {
    id: 1,
    kind: 'dmn',
    notificationable_id: 123,
    notificationable_type: 'event',
    recipient: 'coach@team.com',
    subject: 'MLS 23232323 - KL Atlanta vs KL Austin Match Notice',
    version: 1,
    message: 'This is a test message',
    trigger_kind: 'manual',
    message_status: 'not_errored',
    created_at: '2025-02-24T15:10:00Z',
    attachments,
  },
  {
    id: 2,
    kind: 'dmr',
    notificationable_id: 124,
    notificationable_type: 'event',
    recipient: 'manager@team.com',
    subject: 'Team Roster Update - March 2024',
    version: 2,
    message: 'This is a test message',
    trigger_kind: 'automatic',
    message_status: 'errored',
    created_at: '2025-02-24T15:10:00Z',
    attachments,
  },

  {
    id: 3,
    kind: 'dmn',
    notificationable_id: 126,
    notificationable_type: 'event',
    recipient: 'analysts@team.com',
    subject: 'Post-Match Analysis Report - KL Atlanta vs KL Austin',
    version: 3,
    message: 'This is a test message',
    trigger_kind: 'automatic',
    message_status: 'not_errored',
    created_at: '2025-02-24T14:10:00Z',
    attachments,
  },
];
