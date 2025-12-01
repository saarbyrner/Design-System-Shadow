import { axios } from '@kitman/common/src/utils/services';
import {
  createCustomOppositionName,
  updateCustomOppositionName,
  deleteCustomOppositionName,
} from '../customOppositionName';

describe('customOppositionName', () => {
  const customName = 'Custom Test Name';
  const mockResult = { name: customName, id: 5 };

  it('uses createCustomOppositionName to send and create the relevant custom name', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: mockResult });
    expect(await createCustomOppositionName(customName)).toEqual(mockResult);
    expect(axios.post).toHaveBeenCalledWith('/custom_teams', {
      name: 'Custom Test Name',
    });
  });

  it('uses updateCustomOppositionName to send and update the relevant custom name', async () => {
    jest.spyOn(axios, 'patch').mockResolvedValue({ data: mockResult });
    await updateCustomOppositionName('Even More Changed Name', 5);
    expect(axios.patch).toHaveBeenCalledWith('/custom_teams/5', {
      name: 'Even More Changed Name',
    });
  });

  it('uses deleteCustomOppositionName to delete the custom name associated with the id', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValue();
    await deleteCustomOppositionName(5);
    expect(axios.delete).toHaveBeenCalledWith('/custom_teams/5');
  });
});
