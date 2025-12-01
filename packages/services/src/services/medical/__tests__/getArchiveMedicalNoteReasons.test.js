import $ from 'jquery';
import { data as mockedArchiveReasons } from '../../../mocks/handlers/medical/getArchiveMedicalNoteReasons';
import getArchiveMedicalNoteReasons from '../getArchiveMedicalNoteReasons';

describe('getArchiveMedicalNoteReasons', () => {
  let getArchiveMedicalNoteReasonsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getArchiveMedicalNoteReasonsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedArchiveReasons));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getArchiveMedicalNoteReasons();

    expect(returnedData).toEqual(mockedArchiveReasons);

    expect(getArchiveMedicalNoteReasonsRequest).toHaveBeenCalledTimes(1);
    expect(getArchiveMedicalNoteReasonsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/archive_reasons',
    });
  });
});
