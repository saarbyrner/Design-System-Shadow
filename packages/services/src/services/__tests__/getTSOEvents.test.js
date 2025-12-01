import { mockData as serverResponse } from '@kitman/services/src/mocks/handlers/getTSOEvents';
import { axios } from '@kitman/common/src/utils/services';
import getTSOEvents from '../getTSOEvents';

describe('getTSOEvents', () => {
  let request;
  const abortController = new AbortController();

  const startDateMock = '2023-06-26T00:00:00+01:00';
  const endDateMock = '2023-08-07T00:00:00+01:00';

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not call endpoint and return an empty array if FF is disabled', async () => {
    window.featureFlags['tso-event-management'] = false;

    const response = await getTSOEvents(
      startDateMock,
      endDateMock,
      abortController.signal
    );

    expect(response).toEqual([]);
    expect(request).toHaveBeenCalledTimes(0);
  });

  it('should call the correct endpoint and return data if FF is enabled', async () => {
    window.featureFlags['tso-event-management'] = true;

    const mockRequest = {
      end: endDateMock,
      start: startDateMock,
    };

    const response = await getTSOEvents(
      startDateMock,
      endDateMock,
      abortController.signal
    );

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/calendar/tso_events', mockRequest, {
      signal: abortController.signal,
    });
  });
});
