import { validateSelfAssessmentForm } from '../utils';

describe('utils', () => {
  const validForm = {
    assessment_group_date: '2020-12-31T12:03:00+00:00',
    assessment_template_id: 1,
    athlete_ids: [123],
    event_id: null,
    event_type: null,
    name: 'Test',
  };
  describe('validateSelfAssessmentForm', () => {
    it('returns true when form is valid', () => {
      expect(validateSelfAssessmentForm(validForm)).toEqual(true);
    });

    it('returns false when form when assessment_group_date is empty', () => {
      expect(
        validateSelfAssessmentForm({ ...validForm, assessment_group_date: '' })
      ).toEqual(false);
    });

    it('returns false when form when name is empty', () => {
      expect(validateSelfAssessmentForm({ ...validForm, name: '' })).toEqual(
        false
      );
    });

    it('returns false when form when assessment_template_id is empty', () => {
      expect(
        validateSelfAssessmentForm({
          ...validForm,
          assessment_template_id: null,
        })
      ).toEqual(false);
    });
  });
});
