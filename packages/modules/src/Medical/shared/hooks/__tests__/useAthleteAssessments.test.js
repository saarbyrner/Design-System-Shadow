import { renderHook } from '@testing-library/react-hooks';

import $ from 'jquery';

import useAthleteAssessments from '../useAthleteAssessments';

const mockedAthleteAssessments = [
  {
    date: '2022-06-07T00:00:00Z',
    form: {
      category: 'concussion',
      created_at: '2022-05-10T15:47:00Z',
      enabled: true,
      group: 'scat5',
      id: 3,
      key: 'return_to_play',
      name: 'Return to play',
      updated_at: '2022-05-10T15:47:00Z',
    },
    id: 5,
  },
  {
    date: '2022-06-07T00:00:00Z',
    form: {
      category: 'concussion',
      created_at: '2022-05-10T15:47:00Z',
      enabled: true,
      group: 'scat5',
      id: 4,
      key: 'daily_symptom_checklist',
      name: 'Daily symptom checklist',
      updated_at: '2022-05-10T15:47:00Z',
    },
    id: 4,
  },
];

const expectedOptions = [
  { label: 'Return to play Jun 07, 2022', value: 5 },
  { label: 'Daily symptom checklist Jun 07, 2022', value: 4 },
];

describe('useAthleteAssessments', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        $.Deferred().resolveWith(null, [mockedAthleteAssessments])
      );
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const { result } = renderHook(() => useAthleteAssessments(1));
    await Promise.resolve();
    const { athleteAssessmentOptions } = result.current;

    expect(ajaxSpy).toHaveBeenCalledTimes(1);
    expect(ajaxSpy.mock.calls[0][0].url).toBe(
      '/ui/concussion/assessments?athlete_id=1&group='
    );
    expect(athleteAssessmentOptions).toEqual(expectedOptions);
  });
});
