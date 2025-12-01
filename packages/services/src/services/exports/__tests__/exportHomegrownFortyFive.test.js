import { axios } from '@kitman/common/src/utils/services';
import { data as mockData } from '@kitman/services/src/mocks/handlers/exports/exportHomegrownFortyFive';
import exportHomegrownFortyFive from '../exportHomegrownFortyFive';

describe('exportHomegrownFortyFive', () => {
  let exportHomegrownFortyFiveRequest;

  beforeEach(() => {
    exportHomegrownFortyFiveRequest = jest
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
    const result = await exportHomegrownFortyFive('csv');

    expect(result).toEqual(mockData);
    expect(exportHomegrownFortyFiveRequest).toHaveBeenCalledTimes(1);
    expect(exportHomegrownFortyFiveRequest).toHaveBeenCalledWith(
      '/export_jobs/homegrown_45?format=csv'
    );
  });
});
