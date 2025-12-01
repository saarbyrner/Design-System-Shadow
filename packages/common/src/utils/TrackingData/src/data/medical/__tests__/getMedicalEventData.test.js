import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import {
  getLevelAndTab,
  getIssueType,
  getAthleteId,
  determineMedicalLevelAndTab,
  getNoteActionElement,
  getDocumentActionElement,
} from '../getMedicalEventData';

describe('getMedicalEventData', () => {
  it('getLevelAndTab', () => {
    expect(getLevelAndTab('team', tabHashes.OVERVIEW)).toMatchSnapshot();
  });

  it('getIssueType', () => {
    expect(getIssueType('INJURY')).toMatchSnapshot();
  });

  it('getAthleteId', () => {
    expect(getAthleteId(12345)).toMatchSnapshot();
  });

  describe('determineMedicalLevel', () => {
    beforeEach(() => {
      delete window.location;
    });

    it('correctly returns team level', () => {
      window.location = new URL('http://localhost/medical/rosters');
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'team',
        tab: '#overview',
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns team level and tab', () => {
      window.location = new URL('http://localhost/medical/rosters#treatments');
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'team',
        tab: '#treatments',
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns team level and unknown tab', () => {
      window.location = new URL('http://localhost/medical/rosters#faketab');
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'team',
        tab: 'unknown',
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns athlete level', () => {
      window.location = new URL('http://localhost/medical/athletes/40211');

      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'athlete',
        tab: '#issues',
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns athlete level and tab', () => {
      window.location = new URL(
        'http://localhost/medical/athletes/40211#concussion'
      );

      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'athlete',
        tab: '#concussion',
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns issue level for injuries', () => {
      window.location = new URL(
        'http://localhost/medical/athletes/40211/injuries/2'
      );
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'issue',
        tab: tabHashes.ISSUE,
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns issue level and tab for injuries', () => {
      window.location = new URL(
        'http://localhost/medical/athletes/40211/injuries/2#treatments'
      );
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'issue',
        tab: '#treatments',
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns issue level for illnesses', () => {
      window.location = new URL(
        'http://localhost/medical/athletes/40211/illnesses/2'
      );
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'issue',
        tab: tabHashes.ISSUE,
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });

    it('correctly returns issue level for chronic issues', () => {
      window.location = new URL(
        'http://localhost/medical/athletes/40211/chronic_issues/2'
      );
      expect(determineMedicalLevelAndTab()).toEqual({
        level: 'issue',
        tab: tabHashes.ISSUE,
      });

      expect(determineMedicalLevelAndTab()).toMatchSnapshot();
    });
  });

  it('getNoteActionElement', () => {
    expect(getNoteActionElement('Row meatball')).toMatchSnapshot();
  });

  it('getDocumentActionElement', () => {
    expect(getDocumentActionElement('Add menu')).toMatchSnapshot();
  });
});
