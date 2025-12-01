import bamicGrades from '@kitman/modules/src/AthleteInjury/resources/bamicGrades';
import { getGradeSite } from '../issues';

describe('issues', () => {
  beforeEach(() => {
    window.featureFlags = {
      'custom-pathologies': true,
    };
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  it("formats an injury's bamic grade and site for appending to description", () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: 2,
      bamic_site_id: 3,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual(' - Grade 1c');
  });

  it("formats an injury's bamic grade '4' and site 'a' for appending to description", () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: 5,
      bamic_site_id: 1,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual(' - Grade 4a');
  });

  it("formats an injury's bamic grade for appending to description", () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: 2,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual(' - Grade 1');
  });

  it('wont format if has a supplementary pathology', () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: 'something',
      bamic_grade_id: 2,
      bamic_site_id: 3,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual('');
  });

  it('wont include unknown site in format', () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: 2,
      bamic_site_id: 4,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual(' - Grade 1');
  });

  it('wont format an injury if no bamic grade', () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: null,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual('');
  });

  it('wont format an injury if unknown bamic grade', () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: 6,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual('');
  });

  it('wont format an injury if N/A bamic grade', () => {
    // Short IssueOccurrenceRequested
    const issue = {
      supplementary_pathology: null,
      bamic_grade_id: 7,
    };
    const formattedBamicGradeSite = getGradeSite('INJURY', issue, bamicGrades);
    expect(formattedBamicGradeSite).toEqual('');
  });
});
