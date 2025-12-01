import $ from 'jquery';
import { data as mockedArchiveReasons } from '../../../mocks/handlers/medical/getArchiveMedicalFlagReasons';
import getArchiveMedicalFlagReasons from '../getArchiveMedicalFlagReasons';

describe('getArchiveMedicalFlagReasons', () => {
  let getArchiveMedicalFlagReasonsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getArchiveMedicalFlagReasonsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedArchiveReasons));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getArchiveMedicalFlagReasons();

    expect(returnedData).toEqual(mockedArchiveReasons);

    expect(getArchiveMedicalFlagReasonsRequest).toHaveBeenCalledTimes(1);
    expect(getArchiveMedicalFlagReasonsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/archive_reasons',
      data: {
        entity: 'medical_flags',
      },
    });
  });
});
