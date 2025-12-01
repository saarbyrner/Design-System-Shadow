import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/exports/exportHomegrownPostFormation';
import exportHomegrownPostFormation from '../exportHomegrownPostFormation';

describe('exportHomegrownPlusNine', () => {
  let exportHomegrownPlusNineRequest;

  beforeEach(() => {
    exportHomegrownPlusNineRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return the correct response value', async () => {
    const result = await exportHomegrownPostFormation('csv');

    expect(result).toEqual(data);
    expect(exportHomegrownPlusNineRequest).toHaveBeenCalledTimes(1);
    expect(exportHomegrownPlusNineRequest).toHaveBeenCalledWith(
      '/export_jobs/homegrown_post_formation?format=csv'
    );
  });
});
