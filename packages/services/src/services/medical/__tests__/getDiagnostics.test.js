import $ from 'jquery';
import { data as mockedDiagnostics } from '../../../mocks/handlers/medical/getDiagnostics';
import getDiagnostics from '../getDiagnostics';

describe('getDiagnostics', () => {
  let getDiagnosticsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getDiagnosticsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedDiagnostics));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDiagnostics(
      {
        athlete_id: 1,
        location_id: [88],
      },
      15,
      true
    );
    expect(returnedData).toEqual(mockedDiagnostics);

    expect(getDiagnosticsRequest).toHaveBeenCalledTimes(1);
    expect(getDiagnosticsRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      url: '/medical/diagnostics/search',
      data: JSON.stringify({
        athlete_id: 1,
        location_id: [88],
        page: 15,
        scope_to_squad: true,
      }),
    });
  });
});
