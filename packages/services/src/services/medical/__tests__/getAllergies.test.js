import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/allergies/getAllergies';
import getAllergies from '../getAllergies';

describe('getAllergies', () => {
  let getAllergiesRequest;

  beforeEach(() => {
    getAllergiesRequest = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const filters = [
      {
        athlete_id: 21,
        search_expression: '',
        squad_ids: [6],
        position_ids: [],
        severities: ['severe'],
        archived: false,
      },
    ];

    const returnedData = await getAllergies(filters, 1);

    expect(returnedData).toEqual(serverResponse);

    expect(getAllergiesRequest).toHaveBeenCalledTimes(1);

    expect(getAllergiesRequest).toHaveBeenCalledWith(
      '/ui/medical/allergies/search',
      {
        filters: {
          ...filters,
        },
        next_id: 1,
        organisation_only: true,
      }
    );
  });
});
