import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';
import getProcedures from '../getProcedures';

describe('getProcedures', () => {
  let getProceduresRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getProceduresRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const filters = [
      {
        athlete_id: 21,
        search_expression: '',
        squads: [6],
        procedure_reason_ids: [],
        location_ids: [2],
        procedure_type_ids: [],
      },
    ];

    const returnedData = await getProcedures(filters, 1);

    expect(returnedData).toEqual(serverResponse);

    expect(getProceduresRequest).toHaveBeenCalledTimes(1);

    expect(getProceduresRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/medical/procedures/search',
      contentType: 'application/json',
      data: JSON.stringify({
        filters: {
          ...filters,
        },
        next_id: 1,
      }),
    });
  });
});
