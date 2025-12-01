/* eslint-disable jest/no-conditional-expect */
import { axios } from '@kitman/common/src/utils/services';
import { data as exportStaffResponse } from '@kitman/services/src/mocks/handlers/exports/exportStaff';
import exportStaff from '../exportStaff';

describe('exportStaff', () => {
  let exportStaffRequest;

  beforeEach(() => {
    exportStaffRequest = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: exportStaffResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return the correct response value', async () => {
    const result = await exportStaff();

    expect(result).toEqual(exportStaffResponse);
    expect(exportStaffRequest).toHaveBeenCalledTimes(1);
    expect(exportStaffRequest).toHaveBeenCalledWith(
      '/export_jobs/registration_staff_export'
    );
  });
});

describe('exportStaff bad request', () => {
  let exportStaffRequest;

  beforeEach(() => {
    exportStaffRequest = jest
      .spyOn(axios, 'post')
      .mockRejectedValue(new Error('Bad request'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error for bad request', async () => {
    await expect(exportStaff()).rejects.toThrow('Bad request');

    expect(exportStaffRequest).toHaveBeenCalledTimes(1);
    expect(exportStaffRequest).toHaveBeenCalledWith(
      '/export_jobs/registration_staff_export'
    );
  });
});

describe('exportStaff failed request', () => {
  let exportStaffRequest;

  beforeEach(() => {
    exportStaffRequest = jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 500,
        data: { error: 'Internal Server Error' },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error for failed request', async () => {
    try {
      await exportStaff();
    } catch (error) {
      expect(error.response.status).toEqual(500);
      expect(error.response.data.error).toEqual('Internal Server Error');
    }

    expect(exportStaffRequest).toHaveBeenCalledTimes(1);
    expect(exportStaffRequest).toHaveBeenCalledWith(
      '/export_jobs/registration_staff_export'
    );
  });
});
