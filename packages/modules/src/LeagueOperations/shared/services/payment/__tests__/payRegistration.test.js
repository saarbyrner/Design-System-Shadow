import { axios } from '@kitman/common/src/utils/services';
import payRegistration from '../payRegistration';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('payRegistration', () => {
  it('should return RepayResponseData on successful payment', async () => {
    const mockResponse = {
      data: {
        id: 1,
        organisation_id: 1,
        recipient_organisation_id: 2,
        user_id: 3,
        division_id: 4,
        gateway: 'gateway',
        method: 'method',
        status: 'approved',
        amount: '1000',
        currency: 'USD',
        pn_ref: '12345',
        metadata: 'some-metadata',
        captured_at: 'captured_at',
        captured_id: null,
        refunded_at: null,
        refunded_id: null,
        created_at: 'created_at',
        updated_at: 'updated_at',
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const result = await payRegistration(1000);

    expect(result).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith('/registration/payments/pay', {
      total: 1000,
    });
  });

  it('should return RepayErrorResponseData on payment error', async () => {
    const mockErrorResponse = {
      data: {
        error: 'Payment declined',
      },
    };

    axios.post.mockResolvedValue(mockErrorResponse);

    const result = await payRegistration(1000);

    expect(result).toEqual(mockErrorResponse.data);
    expect(axios.post).toHaveBeenCalledWith('/registration/payments/pay', {
      total: 1000,
    });
  });
});
