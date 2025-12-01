import { axios } from '@kitman/common/src/utils/services';
import getPrincipleTypes from '../getPrincipleTypes';

describe('getPrincipleTypes', () => {
  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    const response = {};
    jest.spyOn(axios, 'get').mockResolvedValue({ data: response });

    expect(await getPrincipleTypes()).toBe(response);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/ui/planning_hub/principle_types');
  });
});
