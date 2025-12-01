import { axios } from '@kitman/common/src/utils/services';
import getSquadAthleteSearch from '../getSquadAthleteSearch';

const serverResponse = [
  { id: 1, name: 'squad 1', athletes: [], default: null, positions: null },
  { id: 2, name: 'squad 2', athletes: [], default: null, positions: null },
];

describe('getSquadAthleteSearch', () => {
  let getSquadAthleteSearchRequest;

  beforeEach(() => {
    getSquadAthleteSearchRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: serverResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getSquadAthleteSearch();

    expect(returnedData).toEqual(serverResponse);

    expect(getSquadAthleteSearchRequest).toHaveBeenCalledTimes(1);

    expect(getSquadAthleteSearchRequest).toHaveBeenCalledWith(
      '/ui/squad_athletes/search',
      {
        search_terms: '',
        include_issue_occurrences: false,
        filters: {
          injured: false,
          not_injured: false,
        },
        grouping: {
          position: false,
        },
      }
    );
  });
});
