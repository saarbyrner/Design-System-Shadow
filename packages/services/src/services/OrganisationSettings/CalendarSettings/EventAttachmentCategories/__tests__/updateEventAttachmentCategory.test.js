import { axios } from '@kitman/common/src/utils/services';
import {
  data as serverResponse,
  categoryId,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventAttachmentCategories/updateEventAttachmentCategory';

import { updateEventAttachmentCategory } from '../updateEventAttachmentCategory';

describe('updateEventAttachmentCategory', () => {
  let updateEventAttachmentCategoryRequest;

  beforeEach(() => {
    updateEventAttachmentCategoryRequest = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and does not return a value', async () => {
    const response = await updateEventAttachmentCategory({
      id: categoryId,
    });

    expect(updateEventAttachmentCategoryRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(serverResponse);
  });
});
