import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getDivisions';
import getDivisions from '../getDivisions';

describe('getDivisions', () => {
  let getDivisionsRequest;

  beforeEach(() => {
    getDivisionsRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDivisions();

    expect(returnedData).toEqual(serverResponse);

    expect(getDivisionsRequest).toHaveBeenCalledTimes(1);
    expect(getDivisionsRequest).toHaveBeenCalledWith(
      '/ui/associations/divisions',
      {},
      {
        params: {
          child_divisions_only: false,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct params', async () => {
    const returnedData = await getDivisions({ childDivisionsOnly: true });

    expect(returnedData).toEqual(serverResponse);

    expect(getDivisionsRequest).toHaveBeenCalledTimes(1);
    expect(getDivisionsRequest).toHaveBeenCalledWith(
      '/ui/associations/divisions',
      {},
      {
        params: {
          child_divisions_only: true,
        },
      }
    );
  });

  describe('failure', () => {
    beforeEach(() => {
      getDivisionsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(getDivisions()).rejects.toThrow();
    });
  });
});
