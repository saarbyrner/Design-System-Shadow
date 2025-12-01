import { axios } from '@kitman/common/src/utils/services';
import getOrganisationFormats from '../getOrganisationFormats';

describe('getOrganisationFormats', () => {
  let request;
  const mockData = { id: 1, name: '11v11', number_of_players: null };

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockData }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedDataFromGroup = await getOrganisationFormats();

    expect(returnedDataFromGroup).toEqual(mockData);
    expect(request).toHaveBeenCalledWith('/ui/organisation_formats');
  });
});
