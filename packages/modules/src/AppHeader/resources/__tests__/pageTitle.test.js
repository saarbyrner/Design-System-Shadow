import pageTitle from '../pageTitle';

describe('pageTitle', () => {
  let originalFeatureFlags;

  beforeEach(() => {
    originalFeatureFlags = window.featureFlags;
    window.featureFlags = {};
  });

  afterEach(() => {
    window.featureFlags = originalFeatureFlags;
  });

  describe('when the user is in a section without sub section', () => {
    it('returns the title of the main section', () => {
      expect(pageTitle('/dashboards', false)).toBe('Metric Dashboard');
      expect(pageTitle('/calendar', false)).toBe('Calendar');
      expect(pageTitle('/activity', false)).toBe('Activity');
    });
  });

  describe('when the user is in a sub section', () => {
    it('returns the title of the sub section', () => {
      expect(pageTitle('/settings/athletes', false)).toBe(
        '#sport_specific__Manage_Athletes'
      );
      expect(pageTitle('/analysis/dashboard', false)).toBe('Dashboard');
      expect(pageTitle('/athletes', false)).toBe('#sport_specific__Athletes');
      expect(pageTitle('/workloads/squad', false)).toBe(
        '#sport_specific__Squad'
      );
      expect(pageTitle('/select_athlete', false)).toBe('Kiosk');
    });
  });

  describe("when the path doesn't match any section", () => {
    it('returns an empty string', () => {
      expect(pageTitle('/random_path', false)).toBe('');
    });
  });

  describe('when path starts with "/league-fixtures"', () => {
    it('returns "Schedule" string', () => {
      window.featureFlags['fixture-management-league-and-officials'] = true;
      expect(pageTitle('/league-fixtures', false)).toBe('Schedule');
    });
  });

  describe('when path ends with "/planning_hub/league-schedule"', () => {
    it('returns "Schedule" string', () => {
      window.featureFlags['league-schedule-club-view'] = true;
      expect(pageTitle('/league-fixtures', false)).toBe('Schedule');
    });
  });

  describe('when path starts with "/planning_hub/league-schedule/reports/"', () => {
    it('returns "Officials report" string', () => {
      window.featureFlags['league-schedule-club-view'] = true;
      expect(pageTitle('/planning_hub/league-schedule/reports/', false)).toBe(
        'Officials report'
      );
    });
  });

  describe('when path starts with "/league-fixtures/reports/"', () => {
    it('returns "Officials report" string', () => {
      window.featureFlags['fixture-management-league-and-officials'] = true;
      expect(pageTitle('/league-fixtures/reports/', false)).toBe(
        'Officials report'
      );
    });
  });
});
