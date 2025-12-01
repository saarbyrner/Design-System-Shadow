import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventAttachmentCategories/getEventAttachmentCategories';
import { getEventAttachmentCategories } from '../getEventAttachmentCategories';

describe('getEventAttachmentCategories', () => {
  let getEventAttachmentCategoriesRequest;

  beforeEach(() => {
    getEventAttachmentCategoriesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventAttachmentCategories();

    expect(returnedData).toEqual(serverResponse);
    expect(getEventAttachmentCategoriesRequest).toHaveBeenCalledTimes(1);
  });
});
