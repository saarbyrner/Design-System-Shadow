import moment from 'moment';
import mockMatchReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';
import { sanitizeReport } from '..';

describe('sanitizeReport', () => {
  let report;

  beforeEach(() => {
    // Deep clone to avoid mutations in tests
    report = structuredClone(mockMatchReport);
    report.updated_at = '2025-10-22T10:00:00Z';
  });

  it('should remove updated_at field from the report', () => {
    const sanitized = sanitizeReport(report);
    expect(sanitized.updated_at).toBeUndefined();
  });

  it('should remove "id" field from each unregistered athlete', () => {
    const sanitized = sanitizeReport(report);
    sanitized.game_monitor_report_unregistered_athletes.forEach((athlete) => {
      expect(athlete.id).toBeUndefined();
    });
  });

  it('should preserve other fields for unregistered athletes', () => {
    const sanitized = sanitizeReport(report);
    const first = sanitized.game_monitor_report_unregistered_athletes[0];
    expect(first.firstname).toBe('Luke');
    expect(first.lastname).toBe('Shaw');
    expect(first.venue_type).toBe('home');
  });

  it('should format date_of_birth as YYYY-MM-DD', () => {
    const sanitized = sanitizeReport(report);
    sanitized.game_monitor_report_unregistered_athletes.forEach(
      (athlete, i) => {
        const originalDOB =
          mockMatchReport.game_monitor_report_unregistered_athletes[i]
            .date_of_birth;
        expect(athlete.date_of_birth).toBe(
          moment(originalDOB).format('YYYY-MM-DD')
        );
      }
    );
  });
});
