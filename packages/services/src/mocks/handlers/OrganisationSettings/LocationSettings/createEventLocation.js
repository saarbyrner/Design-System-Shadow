// @flow
import { rest } from 'msw';
import { activeLocations } from '@kitman/services/src/mocks/handlers/OrganisationSettings/LocationSettings/getEventLocations';
import { eventLocationSettingsUrl } from '@kitman/services/src/services/OrganisationSettings/LocationSettings/utils/helpers';

const handler = rest.post(
  new RegExp(eventLocationSettingsUrl),
  (req, res, ctx) => res(ctx.json(activeLocations[0]))
);

export default handler;
