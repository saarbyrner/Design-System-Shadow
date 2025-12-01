// @flow
import { rest } from 'msw';
import { GET_NOTIFICATION_TRIGGERS_URL } from '../getNotificationTriggers';

const data = [
  {
    id: 1,
    area: 'event',
    type: 'on_create',
    description: 'Receive notifications when a new event is created',
    email: true,
    push: true,
    sms: true,
    enabled: true,
  },
  {
    id: 2,
    area: 'event',
    type: 'on_update',
    description: 'Receive notifications when an event is updated.',
    email: false,
    push: true,
    sms: true,
    enabled: true,
  },
  {
    id: 3,
    area: 'treatment',
    type: 'on_create',
    description: 'Receive notifications when a new treatment is created.',
    email: false,
    push: true,
    sms: false,
    enabled: true,
  },
  {
    id: 4,
    area: 'treatment',
    type: 'on_update',
    description: 'Receive notifications when a treatment is updated.',
    email: false,
    push: false,
    sms: true,
    enabled: true,
  },
];

const handler = rest.get(GET_NOTIFICATION_TRIGGERS_URL, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
