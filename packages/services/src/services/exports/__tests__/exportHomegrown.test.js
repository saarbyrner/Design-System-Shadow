import { axios } from '@kitman/common/src/utils/services';
import { data as mockData } from '@kitman/services/src/mocks/handlers/exports/exportHomegrown';
import exportHomegrown from '../exportHomegrown';

describe('exportHomegrown', () => {
  let exportHomegrownRequest;

  beforeEach(() => {
    exportHomegrownRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: mockData });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return the correct response value', async () => {
    const result = await exportHomegrown('csv');

    expect(result).toEqual(mockData);
    expect(exportHomegrownRequest).toHaveBeenCalledTimes(1);
    expect(exportHomegrownRequest).toHaveBeenCalledWith(
      '/export_jobs/homegrown_export'
    );
  });
});
