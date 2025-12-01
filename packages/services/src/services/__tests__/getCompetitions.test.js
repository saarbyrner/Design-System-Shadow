import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getCompetitions';

import getCompetitions, { getCompetitionsV2 } from '../getCompetitions';

const headers = {
  json: {
    accept: {
      Accept: 'application/json',
    },
  },
};

describe('getCompetitions Api', () => {
  describe('getCompetitions', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const axiosGet = jest.spyOn(axios, 'get');
      const returnedData = await getCompetitions({});
      expect(returnedData).toEqual(serverResponse);

      expect(axiosGet).toHaveBeenCalledTimes(1);
      expect(axiosGet).toHaveBeenCalledWith('/competitions', {
        headers: {
          ...headers.json.accept,
        },
        params: {},
      });
    });

    it('should pass squad IDs', async () => {
      const axiosGet = jest.spyOn(axios, 'get');
      await getCompetitions({
        squadIds: [1, 2],
        divisionIds: undefined,
      });
      expect(axiosGet).toHaveBeenCalledWith(
        '/competitions?squads[]=1&squads[]=2',
        {
          headers: {
            ...headers.json.accept,
          },
          params: {},
        }
      );
    });

    it('should pass hide_inactive param', async () => {
      const axiosGet = jest.spyOn(axios, 'get');
      await getCompetitions({
        hideInactive: true,
      });
      expect(axiosGet).toHaveBeenCalledWith('/competitions', {
        headers: {
          ...headers.json.accept,
        },
        params: {
          hide_inactive: true,
        },
      });
    });

    it('calls the correct endpoint with division ids', async () => {
      const axiosGet = jest.spyOn(axios, 'get');
      const returnedData = await getCompetitions({ divisionIds: 1 });
      expect(returnedData).toEqual(serverResponse);
      expect(axiosGet).toHaveBeenCalledTimes(1);
      expect(axiosGet).toHaveBeenCalledWith('/competitions', {
        headers: {
          ...headers.json.accept,
        },
        params: {
          division_ids: 1,
        },
      });
    });

    it('calls the correct endpoint with all competitions param', async () => {
      const axiosGet = jest.spyOn(axios, 'get');
      const returnedData = await getCompetitions({ allCompetitions: true });
      expect(returnedData).toEqual(serverResponse);
      expect(axiosGet).toHaveBeenCalledTimes(1);
      expect(axiosGet).toHaveBeenCalledWith('/competitions', {
        headers: {
          ...headers.json.accept,
        },
        params: {
          all: true,
        },
      });
    });

    it('throws an error', async () => {
      jest.spyOn(axios, 'get').mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await getCompetitions([1, 2]);
      }).rejects.toThrow();
    });
  });
});

describe('getCompetitionsV2', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(jest.fn);
  });

  it('calls the appropriate url when it is a league or an official', async () => {
    await getCompetitionsV2({}, false);
    expect(axios.get).toHaveBeenCalledWith('/competitions?full');
  });

  it('calls the appropriate url when it is a club user creating a new game', async () => {
    await getCompetitionsV2({}, true);
    expect(axios.get).toHaveBeenCalledWith(
      '/competitions?for_event=new&full=1'
    );
  });

  it('calls the appropriate url when it is a club user editing a existing game', async () => {
    await getCompetitionsV2({ id: 1 }, true);
    expect(axios.get).toHaveBeenCalledWith('/competitions?for_event=1&full=1');
  });
});
