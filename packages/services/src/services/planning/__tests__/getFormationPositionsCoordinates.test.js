import { axios } from '@kitman/common/src/utils/services';
import getFormationPositionsCoordinates from '../getFormationPositionsCoordinates';

describe('getFormationPositionsCoordinates', () => {
  let request;
  const mockData = [
    {
      field_id: 1,
      formation_id: 1,
      id: 1,
      order: 1,
      position_id: 1,
      x: 1,
      y: 1,
    },
  ];

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockData }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const result = await getFormationPositionsCoordinates({
      fieldId: 1,
      formationId: 1,
    });

    expect(result).toEqual(mockData);
    expect(request).toHaveBeenCalledWith(
      '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1'
    );
  });
});
