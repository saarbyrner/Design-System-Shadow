import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/bulkUpdateNotes';
import bulkUpdateNotes from '../bulkUpdateNotes';

describe('bulkUpdateNotes', () => {
  const notes = {
    annotations: [
      {
        id: 1,
        created_by: 2,
        allow_list: [3, 4],
      },
    ],
  };
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct data', async () => {
    const returnedData = await bulkUpdateNotes(notes);
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await bulkUpdateNotes(notes);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/update_bulk', notes);
    });
  });
});
