import { axios } from '@kitman/common/src/utils/services';
import updateFormationPositionViews from '..';
import mockData from '../mock';

describe('updateFormationPositionViews', () => {
  const data = {
    formation_position_views: [
      { id: 39, x: 2 },
      { id: 39, y: 1 },
      { id: 39, position_id: 89 },
    ],
  };

  describe('handler response', () => {
    it('returns the correct value', async () => {
      const returnedData = await updateFormationPositionViews(data);
      expect(returnedData).toEqual(mockData);
    });
  });

  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: mockData });

    await updateFormationPositionViews(data);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/ui/planning_hub/formation_position_views/bulk_save',
      data
    );
  });
});
