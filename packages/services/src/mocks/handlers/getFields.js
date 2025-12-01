import { rest } from 'msw';

const data = {
  common_fields: {
    issue_type: {
      constraint: 'mandatory',
    },
    athlete_id: {
      constraint: 'mandatory',
    },
    occurrence_date: {
      constraint: 'mandatory',
    },
    squad: {
      constraint: 'mandatory',
    },
    created_by: {
      constraint: 'mandatory',
    },
    examination_date: {
      constraint: 'mandatory',
    },
    has_supplementary_pathology: {
      constraint: 'must_have',
    },
    issue_occurrence_title: {
      constraint: 'optional',
    },
    supplementary_pathology: {
      constraint: 'optional',
    },
    tso_id: {
      constraint: 'optional',
    },
    primary_pathology_id: {
      constraint: 'mandatory',
    },
    reccurrence_id: {
      constraint: 'must_have',
    },
    side_id: {
      constraint: 'mandatory',
    },
    events: {
      constraint: 'mandatory',
    },
    concussion_assessments: {
      constraint: 'mandatory',
    },
    reported_date: {
      constraint: 'must_have',
    },
    issue_occurrence_onset_id: {
      constraint: 'mandatory',
    },
  },
  injury_fields: {
    activity_id: {
      constraint: 'mandatory',
    },
    association_period_id: {
      constraint: 'optional',
    },
    bamic_grade_id: {
      constraint: 'optional',
    },
    bamic_site_id: {
      constraint: 'optional',
    },
    external_source_id: {
      constraint: 'optional',
    },
    external_source_name: {
      constraint: 'optional',
    },
    injury_occurrence_external_id: {
      constraint: 'optional',
    },
    occurrence_min: {
      constraint: 'optional',
    },
    game_id: {
      constraint: 'mandatory',
    },
    position_when_injured_id: {
      constraint: 'must_have',
    },
    training_session_id: {
      constraint: 'mandatory',
    },
    session_completed: {
      constraint: 'optional',
    },
    presentation_type: {
      constraint: 'must_have',
    },
  },
  illness_fields: {
    activity_id: {
      constraint: 'mandatory',
    },
    game_id: {
      constraint: 'mandatory',
    },
    illness_onset_id: {
      constraint: 'mandatory',
    },
    training_session_id: {
      constraint: 'must_have',
    },
    position_when_injured_id: {
      constraint: 'optional',
    },
  },
};

const handler = rest.get(
  '/ui/fields/medical/issues/create_params',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
