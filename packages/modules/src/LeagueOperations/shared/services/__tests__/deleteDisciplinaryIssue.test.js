import { axios } from '@kitman/common/src/utils/services';
import deleteDisciplinaryIssue from '../deleteDisciplinaryIssue';

jest.mock('@kitman/common/src/utils/services');

const response = {
  message: 'Discipline deleted',
};

describe('deleteDisciplinaryIssue', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'put').mockImplementation(() => {
      return Promise.resolve({
        data: response,
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should call the correct endpoint with the correct params', async () => {
    const result = await deleteDisciplinaryIssue({ id: 1 });
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });
});
