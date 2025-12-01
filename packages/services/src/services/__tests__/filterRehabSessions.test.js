import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/filterRehabSessions';
import filterRehabSessions from '../rehab/filterRehabSessions';

describe('filterRehabSessions', () => {
  let filterRehabSessionsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    filterRehabSessionsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await filterRehabSessions(
      '2022-11-24T00:00:00Z',
      '2022-11-30T23:59:59Z',
      1,
      [
        {
          issueOccurrenceId: 13899,
          issueType: 'illness',
        },
      ],
      false // maintenance
    );
    expect(returnedData).toEqual(serverResponse);
    expect(filterRehabSessionsRequest).toHaveBeenCalledTimes(1);
    expect(filterRehabSessionsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/sessions/filter',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1,
        start_date: '2022-11-24T00:00:00Z',
        end_date: '2022-11-30T23:59:59Z',
        maintenance: false,
        issues: [
          {
            issue_id: 13899,
            issue_type: 'illness',
          },
        ],
      }),
    });
  });
});
