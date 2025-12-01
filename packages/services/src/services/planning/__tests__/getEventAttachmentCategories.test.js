import { axios } from '@kitman/common/src/utils/services';
import { data as eventCategoriesResponse } from '@kitman/services/src/mocks/handlers/planning/getEventAttachmentCategories';
import getEventAttachmentCategories from '../getEventAttachmentCategories';

describe('getEventAttachmentCategories', () => {
  let getEventAttachmentCategoriesRequest;

  beforeEach(() => {
    getEventAttachmentCategoriesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: eventCategoriesResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventAttachmentCategories();
    expect(returnedData).toEqual(eventCategoriesResponse);

    expect(getEventAttachmentCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(getEventAttachmentCategoriesRequest).toHaveBeenCalledWith(
      '/ui/planning_hub/event_attachment_categories?archived=false'
    );
  });
});
