import { axios } from '@kitman/common/src/utils/services';
import { getStaffOnly } from '../getStaffOnly';

describe('getStaffOnly', () => {
  const returnValue = { test: '' };

  beforeAll(() =>
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnValue })
  );

  it('calls the correct endpoint and returns the correct value', async () => {
    await getStaffOnly();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/users/staff_only', { params: {} });
  });

  it('returns `data` property value from a response object', async () => {
    const staff = await getStaffOnly();

    expect(staff).toMatchObject(returnValue);
  });

  describe('url params', () => {
    it('calls the correct endpoint with the correct url params', async () => {
      await getStaffOnly({
        includeDisciplineStatus: true,
        eventId: 1,
      });
      expect(axios.get).toHaveBeenCalledWith('/users/staff_only', {
        params: {
          event_id: 1,
          include_discipline_status: true,
        },
      });

      await getStaffOnly({
        includeStaffRole: true,
      });
      expect(axios.get).toHaveBeenCalledWith('/users/staff_only', {
        params: {
          include_staff_role: true,
        },
      });

      await getStaffOnly({
        orgId: 1222,
      });
      expect(axios.get).toHaveBeenCalledWith('/users/staff_only', {
        params: {
          organisation_id: 1222,
        },
      });

      await getStaffOnly({
        orgId: 1222,
        includeDisciplineStatus: true,
        eventId: 1,
        includeStaffRole: true,
      });
      expect(axios.get).toHaveBeenCalledWith('/users/staff_only', {
        params: {
          event_id: 1,
          include_discipline_status: true,
          include_staff_role: true,
          organisation_id: 1222,
        },
      });
    });
  });
});
