// @flow
import type { AssessmentGroupCreate } from '@kitman/services/src/services/assessmentGroup/createAssessmentGroup';
import { assessmentMandatoryFieldsEnumLike } from '../../shared/enum-likes';

export const validateSelfAssessmentForm = (
  assessment: AssessmentGroupCreate
) => {
  return [
    assessmentMandatoryFieldsEnumLike.name,
    assessmentMandatoryFieldsEnumLike.assessmentId,
    assessmentMandatoryFieldsEnumLike.assessmentGroupDate,
  ].every((key) => assessment[key]);
};
