import { rest } from 'msw';
import { GET_PRELIMINARY_SCHEMA_URL } from '@kitman/services/src/services/medical/getPreliminarySchema';

const data = {
  issue_type: 'mandatory',
  athlete: {
    id: 'mandatory',
  },
  occurrence_date: 'mandatory',
  squad: {
    id: 'mandatory',
  },
  created_by: 'mandatory',
  title: 'optional',
  issue_occurrence_onset_id: 'mandatory',
  examination_date: 'must_have',
  statuses: 'mandatory',
  primary_pathology: {
    type: 'must_have',
    id: 'mandatory',
  },
  side: {
    id: 'must_have',
  },
  activity: {
    id: 'mandatory',
  },
  position_when_injured_id: 'must_have',
  occurrence_min: 'must_have',
  event: {
    type: 'must_have',
    id: 'must_have',
  },
  session_completed: 'must_have',
  logic_builder: 'must_have',
  game_id: 'must_have',
};

const handler = rest.get(GET_PRELIMINARY_SCHEMA_URL, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
