import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';

describe('getDailyStatusReportData', () => {
  beforeEach(() => {
    delete window.location;
  });

  it('returns the correct tab when the hash matches #daily_status_report', () => {
    window.location = new URL(
      'http://localhost/medical/rosters#daily_status_report'
    );
    expect(determineMedicalLevelAndTab()).toEqual({
      level: 'team',
      tab: tabHashes.COACHES_REPORT_REFACTOR,
    });
  });
});
