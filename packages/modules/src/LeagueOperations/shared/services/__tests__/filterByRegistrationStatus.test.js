import { axios } from '@kitman/common/src/utils/services';
import filterByRegistrationStatus from '../filterByRegistrationStatus';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('filterByRegistrationStatus', () => {
  it('fetches application statuses based on permission group', async () => {
    const mockData = [
      { id: 1, name: 'Approved', type: 'status' },
      { id: 2, name: 'Pending', type: 'status' },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await filterByRegistrationStatus({
      permissionGroup: 'athlete',
    });

    expect(axios.get).toHaveBeenCalledWith(
      '/ui/registration_statuses?permission_group=athlete'
    );
    expect(result).toEqual(mockData);
  });

  it('handles errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(
      filterByRegistrationStatus({ permissionGroup: 'athlete' })
    ).rejects.toThrow('Network Error');
  });
});
