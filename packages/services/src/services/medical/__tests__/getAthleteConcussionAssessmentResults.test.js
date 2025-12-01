import $ from 'jquery';
import getAthleteConcussionAssessmentResults from '../getAthleteConcussionAssessmentResults';

const mockedSCAT5Results = [
  {
    column_section: 'Total number of symptoms:',
    column_baseline: '3/22',
    'column_2022-04-01': '10',
    'column_2022-04-02': '22',
    'column_2022-04-03': '33',
    'column_2022-04-04': '44',
    'column_2022-04-05': '55',
    'column_2022-04-06': '55',
    'column_2022-04-07': '55',
    'column_2022-04-08': '55',
    'column_2022-04-09': '55',
  },
  {
    column_section: 'Symptom severity score:',
    column_baseline: '3/132',
    'column_2022-04-01': '10',
    'column_2022-04-02': '22',
    'column_2022-04-03': '33',
    'column_2022-04-04': '44',
    'column_2022-04-05': '55',
    'column_2022-04-06': '55',
    'column_2022-04-07': '55',
    'column_2022-04-08': '55',
    'column_2022-04-09': '55',
  },
];

describe('getAthleteConcussionAssessmentResults', () => {
  let getAthleteConcussionAssessmentResultsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getAthleteConcussionAssessmentResultsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedSCAT5Results));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthleteConcussionAssessmentResults(
      1,
      1234,
      'Injury',
      'assessments'
    );

    expect(returnedData).toEqual(mockedSCAT5Results);

    expect(getAthleteConcussionAssessmentResultsRequest).toHaveBeenCalledTimes(
      1
    );
    expect(getAthleteConcussionAssessmentResultsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/athletes/1/injuries/1234/concussions/assessments',
    });
  });

  describe('when fetching king_devick data', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAthleteConcussionAssessmentResults(
        1,
        1234,
        'Injury',
        'king_devick'
      );

      expect(returnedData).toEqual(mockedSCAT5Results);

      expect(
        getAthleteConcussionAssessmentResultsRequest
      ).toHaveBeenCalledTimes(1);
      expect(getAthleteConcussionAssessmentResultsRequest).toHaveBeenCalledWith(
        {
          method: 'GET',
          url: '/medical/athletes/1/injuries/1234/concussions/king_devick',
        }
      );
    });
  });

  describe('when fetching NPC data', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAthleteConcussionAssessmentResults(
        1,
        1234,
        'Injury',
        'npc'
      );

      expect(returnedData).toEqual(mockedSCAT5Results);

      expect(
        getAthleteConcussionAssessmentResultsRequest
      ).toHaveBeenCalledTimes(1);
      expect(getAthleteConcussionAssessmentResultsRequest).toHaveBeenCalledWith(
        {
          method: 'GET',
          url: '/medical/athletes/1/injuries/1234/concussions/npc',
        }
      );
    });
  });
});
