import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getDiagnosticStatuses';
import getDiagnosticStatuses from '../getDiagnosticStatuses';

describe('getDiagnosticStatuses', () => {
  let getDiagnosticStatusesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getDiagnosticStatusesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDiagnosticStatuses();

    expect(returnedData).toEqual(data);

    expect(getDiagnosticStatusesRequest).toHaveBeenCalledTimes(1);
    expect(getDiagnosticStatusesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/diagnostics/statuses',
    });
  });
});
