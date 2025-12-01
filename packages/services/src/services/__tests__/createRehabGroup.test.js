import { tagData as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/createRehabGroup';
import { axios } from '@kitman/common/src/utils/services';
import createRehabGroup from '../rehab/createRehabGroup';

describe('createRehabGroup', () => {
  let request;
  const dataToSend = {
    name: 'Test Tag',
    theme_colour: '#FFFFFF',
    scope: 'Default',
  };

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createRehabGroup(dataToSend);

    expect(returnedData.length).toEqual(serverResponse.length);
    expect(returnedData).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/tags', dataToSend);
  });
});
