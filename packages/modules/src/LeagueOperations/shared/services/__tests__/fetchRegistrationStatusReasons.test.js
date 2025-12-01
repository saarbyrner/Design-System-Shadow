import { axios } from '@kitman/common/src/utils/services';
import fetchRegistrationStatusReasons from '../fetchRegistrationStatusReasons';
import mockResponse from '../mocks/data/mock_registration_status_reasons';

describe('fetchRegistrationStatusReasons', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch registration status reasons', async () => {
    const response = await fetchRegistrationStatusReasons();
    expect(response).toEqual(mockResponse);
  });
});
