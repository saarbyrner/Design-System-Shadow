import { axios } from '@kitman/common/src/utils/services';
import { data as mockData } from '@kitman/services/src/mocks/handlers/exports/exportHomegrownPlusNine';
import exportHomegrownPlusNine from '../exportHomegrownPlusNine';

describe('exportHomegrownPlusNine', () => {
  let exportHomegrownPlusNineRequest;

  beforeEach(() => {
    exportHomegrownPlusNineRequest = jest
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
    const result = await exportHomegrownPlusNine('csv');

    expect(result).toEqual(mockData);
    expect(exportHomegrownPlusNineRequest).toHaveBeenCalledTimes(1);
    expect(exportHomegrownPlusNineRequest).toHaveBeenCalledWith(
      '/export_jobs/homegrown_plus_9?format=csv'
    );
  });
});
