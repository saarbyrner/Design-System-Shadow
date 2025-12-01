import { axios } from '@kitman/common/src/utils/services';
import { data as mockedNotes } from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import getMedicalNotes from '../getMedicalNotes';

describe('getMedicalNotes', () => {
  let getMedicalNotesRequest;
  const noteFilters = { content: 'test content', athlete_id: 1 };

  beforeEach(() => {
    getMedicalNotesRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: mockedNotes }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct response - no props', async () => {
    const returnedData = await getMedicalNotes();

    expect(returnedData).toEqual(mockedNotes);

    expect(getMedicalNotesRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalNotesRequest).toHaveBeenCalledWith(
      '/medical/notes/search',
      { page: undefined }
    );
  });

  it('calls the correct endpoint and returns the correct response - filter prop passed', async () => {
    const returnedData = await getMedicalNotes(noteFilters);

    expect(returnedData).toEqual(mockedNotes);

    expect(getMedicalNotesRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalNotesRequest).toHaveBeenCalledWith(
      '/medical/notes/search',
      { ...noteFilters, page: undefined }
    );
  });

  it('calls the correct endpoint and returns the correct response - page prop passed', async () => {
    const returnedData = await getMedicalNotes(noteFilters, 1);

    expect(returnedData).toEqual(mockedNotes);

    expect(getMedicalNotesRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalNotesRequest).toHaveBeenCalledWith(
      '/medical/notes/search',
      { ...noteFilters, page: 1 }
    );
  });
});
