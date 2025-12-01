import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getMedicationsReport';
import getMedicationsReport from '../getMedicationsReport';

const params = {
  filters: {
    report_range: {
      start_date: '2023-08-18T15:17:52+01:00',
      end_date: '2023-08-18T15:17:52+01:00',
    },
    include_all_active: false,
    archived: false,
  },
};

const population = [
  {
    applies_to_squad: false,
    all_squads: false,
    position_groups: [],
    positions: [],
    athletes: [],
    squads: [8],
    context_squads: [8],
  },
];

const paramsWithPopulation = {
  filters: {
    ...params.filters,
    population,
  },
};

describe('getMedicationsReport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct data', async () => {
    const returnedData = await getMedicationsReport(params);
    expect(returnedData).toEqual(data);
  });

  it('returns the correct data with population', async () => {
    const returnedData = await getMedicationsReport(paramsWithPopulation);
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getMedicationsReport(params);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/rosters/medications_report',
        params,
        {
          timeout: 0, // leaving BE handle the timeout here
        }
      );
    });

    it('calls the correct endpoint with correct body data in the request with population', async () => {
      await getMedicationsReport(paramsWithPopulation);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/rosters/medications_report',
        paramsWithPopulation,
        {
          timeout: 0, // leaving BE handle the timeout here
        }
      );
    });
  });
});
