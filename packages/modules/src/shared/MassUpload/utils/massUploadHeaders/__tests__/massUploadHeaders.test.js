import athleteHeaders from '../athleteHeaders';
import {
  officialAssignmentHeaders,
  matchMonitorAssignmentHeaders,
} from '../staffAssignmentHeaders';
import officialHeaders from '../officialHeaders';
import scoutHeaders from '../scoutHeaders';
import staffHeaders from '../staffHeaders';

describe('massUploadHeaders', () => {
  it('athleteHeaders', () => {
    expect(athleteHeaders).toMatchSnapshot();
  });

  it('officialAssignmentHeaders', () => {
    expect(officialAssignmentHeaders).toMatchSnapshot();
  });

  it('matchMonitorAssignmentHeaders', () => {
    expect(matchMonitorAssignmentHeaders).toMatchSnapshot();
  });

  it('officialHeaders', () => {
    expect(officialHeaders).toMatchSnapshot();
  });

  it('scoutHeaders', () => {
    expect(scoutHeaders).toMatchSnapshot();
  });

  it('staffHeaders', () => {
    expect(staffHeaders).toMatchSnapshot();
  });
});
