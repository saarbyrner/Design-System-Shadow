import moment from 'moment-timezone';
import fetchRehabSessions from '../fetchRehabSessions';

describe('fetchRehabSessions', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('fetches and combines rehab notes with the rehab sessions', async () => {
    const results = await fetchRehabSessions(
      1, // issueOccurrenceId
      'IssueType', // issueType
      '3_DAY', // RehabDayMode,
      moment('2022-11-27'), // selectedDate,
      2, // athleteId,
      false, // maintenance mode
      true // includeNotes
    );

    expect(results.length).toBe(3);

    expect(results[0].id).toBe(5);
    expect(results[0].annotations.length).toBe(1);
    expect(results[0].annotations[0].title).toBe('Test rehab note 1');
    expect(results[0].annotations[0].note_summary).toBe('Test 1');

    expect(results[1].id).toBe(16);
    expect(results[1].annotations.length).toBe(1);
    expect(results[1].annotations[0].title).toBe('Test rehab note 2');
    expect(results[1].annotations[0].note_summary).toBe('Test 2');

    expect(results[2].id).toBe(17);
    expect(results[2].annotations.length).toBe(0);
  });

  it('does not combines rehab notes when includeNotes param is false', async () => {
    const results = await fetchRehabSessions(
      1, // issueOccurrenceId
      'IssueType', // issueType
      '3_DAY', // RehabDayMode,
      moment('2022-11-27'), // selectedDate,
      2, // athleteId,
      false, // maintenance mode
      false // includeNotes
    );

    expect(results.length).toBe(3);

    expect(results[0].id).toBe(5);
    expect(results[0].annotations.length).toBe(0);

    expect(results[1].id).toBe(16);
    expect(results[1].annotations.length).toBe(0);

    expect(results[2].id).toBe(17);
    expect(results[2].annotations.length).toBe(0);
  });
});
