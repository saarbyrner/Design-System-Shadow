import serverResponse from '@kitman/services/src/mocks/handlers/rehab/getRehabNotes/getRehabNotesData.mock';
import { axios } from '@kitman/common/src/utils/services';
import getRehabNotes from '../rehab/getRehabNotes';

describe('getRehabNotes', () => {
  let getRehabNotesRequest;
  beforeEach(() => {
    getRehabNotesRequest = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: serverResponse });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getRehabNotes(
      1, // athleteId,
      '2022-11-26T23:00:00Z', // startDate,
      '2022-11-27T23:00:00Z', // endData,
      false, // isMaintenance
      [] // issues
    );

    expect(returnedData).toEqual(serverResponse);

    expect(getRehabNotesRequest).toHaveBeenCalledTimes(1);

    expect(getRehabNotesRequest).toHaveBeenCalledWith(
      '/ui/medical/rehab/sessions/annotations',
      {
        athlete_id: 1,
        end_date: '2022-11-27T23:00:00Z',
        issues: [],
        maintenance: false,
        start_date: '2022-11-26T23:00:00Z',
      }
    );
  });
});
