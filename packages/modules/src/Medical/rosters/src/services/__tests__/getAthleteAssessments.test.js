import $ from 'jquery';
import getAthleteAssessments from '../getAthleteAssessments';

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

describe('getAthleteAssessments', () => {
  let getAthleteAssessmentsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAthleteAssessmentsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAthleteAssessments));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthleteAssessments(1);

    expect(returnedData).toEqual(mockedAthleteAssessments);

    expect(getAthleteAssessmentsRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteAssessmentsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/concussion/assessments?athlete_id=1&group=',
    });
  });
});
