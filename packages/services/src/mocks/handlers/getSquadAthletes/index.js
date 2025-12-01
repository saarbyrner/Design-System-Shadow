import { rest } from 'msw';
import squadAthletesData from './squadAthletesData.mock';
import squadAthleteListData from './squadAthleteListData.mock';
import withOrgTransferRecordData from './withOrgTransferRecordData.mock';
import inactiveData from './inactiveData.mock';
import minimalData from './minimalData.mock';
import byIdData from './byIdData.mock';
import squadAthleteListMinimalAthletesData from './squadAthleteListMinimalAthletesData.mock';

const handler = rest.get('/ui/squad_athletes', (req, res, ctx) => {
  const sp = req.url.searchParams;

  const minimal = sp.get('minimal');
  if (minimal === 'true') {
    return res(ctx.json(minimalData));
  }

  const includeOrgTransferRecords = sp.get(
    'include_organisation_transfer_records'
  );

  if (includeOrgTransferRecords === 'true') {
    return res(ctx.json(withOrgTransferRecordData));
  }

  const inactive = sp.get('inactive');
  if (inactive === 'true') {
    return res(ctx.json(inactiveData));
  }

  return res(ctx.json(squadAthletesData));
});

const athleteListHandler = rest.get(
  '/ui/squad_athletes/athlete_list',
  (req, res, ctx) => {
    const sp = req.url.searchParams;

    const minimal = sp.get('minimal');
    if (minimal === 'true') {
      return res(ctx.json(squadAthleteListMinimalAthletesData));
    }

    const inactive = sp.get('inactive');
    if (inactive === 'true') {
      return res(ctx.json(inactiveData));
    }

    return res(ctx.json(squadAthleteListData));
  }
);

const byIdHandler = rest.get('/ui/squad_athletes/:id', (req, res, ctx) =>
  res(ctx.json(byIdData))
);

export {
  handler,
  athleteListHandler,
  byIdHandler,
  squadAthletesData as data,
  inactiveData,
  squadAthleteListMinimalAthletesData as minimalSquadAthletes,
};
