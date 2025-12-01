import { rest } from 'msw';

const data = {
  athlete_id: 9999999,
  player_has_left_club: true,
  issueOccurenceId: 111111,
};

const handlers = [
  rest.patch(
    `/athletes/${data.athleteId}/injuries/${data.issueOccurenceId}/player_left_club`,
    (req, res, ctx) => res(ctx.json(data))
  ),
  rest.patch(
    `/athletes/${data.athleteId}/illnesses/${data.issueOccurenceId}/player_left_club`,
    (req, res, ctx) => res(ctx.json(data))
  ),
];

export { handlers, data };
