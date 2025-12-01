import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventAttachmentCategories/createEventAttachmentCategory';
import { createEventAttachmentCategory } from '../createEventAttachmentCategory';

describe('createEventAttachmentCategory', () => {
  let createEventAttachmentCategoryRequest;

  beforeEach(() => {
    createEventAttachmentCategoryRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and does not return a value', async () => {
    const response = await createEventAttachmentCategory({});

    expect(createEventAttachmentCategoryRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(serverResponse);
  });
});
