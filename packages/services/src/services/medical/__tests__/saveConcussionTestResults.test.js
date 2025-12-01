import $ from 'jquery';
import saveConcussionTestResults from '../saveConcussionTestResults';

describe('saveConcussionTestResults', () => {
  let saveRequest;

  const mockedNPCResults = {
    type: 'baseline',
    athlete_id: 1,
    examination: '2022-05-12T00:00:00+00:00',
    attachment_ids: [],
    injury_ids: [],
    illness_ids: [],
    examiner_id: 1,
    distance1: 1,
    distance2: 2,
    distance3: 3,
    average: 2,
  };
  const mockedKingDevickResults = {
    type: 'baseline',
    athlete_id: 1,
    examination: '2022-05-12T00:00:00+00:00',
    attachment_ids: [],
    injury_ids: [],
    illness_ids: [],
    examiner_id: 1,
    score: 5,
    errors: 3,
  };

  beforeEach(() => {
    const deferred = $.Deferred();

    saveRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('When results are NPC', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      await saveConcussionTestResults('NPC', mockedNPCResults);

      expect(saveRequest).toHaveBeenCalledTimes(1);
      expect(saveRequest).toHaveBeenCalledWith({
        method: 'POST',
        contentType: 'application/json',
        url: '/concussion/npc',
        data: JSON.stringify(mockedNPCResults),
      });
    });
  });

  describe('When the results are King-Devick', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      await saveConcussionTestResults('KING-DEVICK', mockedKingDevickResults);

      expect(saveRequest).toHaveBeenCalledTimes(1);
      expect(saveRequest).toHaveBeenCalledWith({
        method: 'POST',
        contentType: 'application/json',
        url: '/concussion/king_devick',
        data: JSON.stringify(mockedKingDevickResults),
      });
    });
  });
});
