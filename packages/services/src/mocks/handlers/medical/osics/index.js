import { rest } from 'msw';
import data from './data.mock';

const handlers = [
  rest.get('/ui/medical/illnesses/osics', (req, res, ctx) =>
    res(ctx.json(data.illnesses.osics))
  ),
  rest.get('/ui/medical/illnesses/osics_body_areas', (req, res, ctx) =>
    res(ctx.json(data.illnesses.osics_body_areas))
  ),
  rest.get('/ui/medical/injuries/onsets', (req, res, ctx) =>
    res(ctx.json(data.onsets))
  ),
  rest.get('/ui/medical/illnesses/osics_classifications', (req, res, ctx) =>
    res(ctx.json(data.illnesses.osics_classifications))
  ),
  rest.get('/ui/medical/injuries/osics_pathologies', (req, res, ctx) =>
    res(ctx.json(data.injuries.osics_pathologies))
  ),
  rest.get('/ui/medical/injuries/osics', (req, res, ctx) =>
    res(ctx.json(data.injuries.osics))
  ),
  rest.get('/ui/medical/injuries/osics_body_areas', (req, res, ctx) =>
    res(ctx.json(data.injuries.osics_body_areas))
  ),
  rest.get('/ui/medical/injuries/osics_classifications', (req, res, ctx) =>
    res(ctx.json(data.injuries.osics_classifications))
  ),
  rest.get('/ui/medical/injuries/osics_pathologies', (req, res, ctx) =>
    res(ctx.json(data.illnesses.osics_pathologies))
  ),
  rest.get('/ui/medical/illnesses/onsets', (req, res, ctx) =>
    res(ctx.json(data.onsets))
  ),
  rest.get('/ui/medical/injuries/onsets', (req, res, ctx) =>
    res(ctx.json(data.onsets))
  ),
  rest.get('/ui/medical/illnesses/osics_pathologies', (req, res, ctx) =>
    res(ctx.json(data.illnesses.osics_pathologies))
  ),
  rest.get('/ui/medical/illnesses/osics_classifications', (req, res, ctx) =>
    res(ctx.json(data.illnesses.osics_classifications))
  ),
];

export { handlers, data };
