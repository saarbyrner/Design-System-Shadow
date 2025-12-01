import {
  isValidUrlNoWhitespace,
  areRequiredLinkFieldsValid,
  isValidCpt,
  areAllCptsValid,
  needsAssociatedIssueValidation,
  hasAssociatedInjuryOrIllness,
} from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/utils/validators';

describe('validators', () => {
  describe('URL helpers', () => {
    it('isValidUrlNoWhitespace validates proper urls and rejects spaces', () => {
      expect(isValidUrlNoWhitespace('https://example.com')).toBe(true);
      expect(isValidUrlNoWhitespace('http://a b.com')).toBe(false);
      expect(isValidUrlNoWhitespace('notaurl')).toBe(false);
    });

    it('areRequiredLinkFieldsValid checks both title and url', () => {
      expect(areRequiredLinkFieldsValid('Title', 'https://example.com')).toBe(
        true
      );
      expect(areRequiredLinkFieldsValid('', 'https://example.com')).toBe(false);
      expect(areRequiredLinkFieldsValid('Title', 'invalid')).toBe(false);
    });
  });

  describe('CPT validators', () => {
    it('isValidCpt allows undefined or 5-length codes', () => {
      expect(isValidCpt()).toBe(true);
      expect(isValidCpt('12345')).toBe(true);
      expect(isValidCpt('1234')).toBe(false);
    });

    it('areAllCptsValid checks all billable items', () => {
      expect(areAllCptsValid([{ cptCode: '12345' }, { cptCode: '' }])).toBe(
        true
      );
      expect(areAllCptsValid([{ cptCode: '12345' }, { cptCode: '1234' }])).toBe(
        false
      );
    });
  });

  describe('Associated issue validation', () => {
    it('needsAssociatedIssueValidation is true when reason matches injury/illness reason id', () => {
      expect(needsAssociatedIssueValidation(5, 5)).toBe(true);
      expect(needsAssociatedIssueValidation(5, 6)).toBe(false);
    });

    it('hasAssociatedInjuryOrIllness checks any of injury/illness/chronic arrays', () => {
      expect(
        hasAssociatedInjuryOrIllness({
          injuryIds: [1],
          illnessIds: [],
          chronicIssueIds: [],
        })
      ).toBe(true);
      expect(
        hasAssociatedInjuryOrIllness({
          injuryIds: [],
          illnessIds: [],
          chronicIssueIds: [],
        })
      ).toBe(false);
    });
  });
});
