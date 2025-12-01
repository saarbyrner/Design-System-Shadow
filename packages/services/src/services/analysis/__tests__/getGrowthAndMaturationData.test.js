import { axios } from '@kitman/common/src/utils/services';
import { data as mockData } from '@kitman/services/src/mocks/handlers/analysis/getGrowthAndMaturationData';
import getGrowthAndMaturationData from '../getGrowthAndMaturationData';

const population = {
  applies_to_squad: false,
  all_squads: false,
  position_groups: [],
  positions: [],
  athletes: [8085],
  squads: [],
  context_squads: [],
};

describe('getGrowthAndMaturationData', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: mockData }));
  });

  it('makes the call to the correct endpoint', async () => {
    await getGrowthAndMaturationData(population);

    expect(request).toHaveBeenCalledWith(
      '/reporting/growth_maturation/preview',
      {
        population: {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [8085],
          squads: [],
          context_squads: [],
        },
      }
    );
  });
  it('calls the correct endpoint and returns the correct data', async () => {
    const data = await getGrowthAndMaturationData(population);

    expect(data).toEqual(mockData);
  });
});
