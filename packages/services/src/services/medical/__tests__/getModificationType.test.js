import $ from 'jquery';
import getModificationType from '../getModificationType';

describe('getModificationType', () => {
  const mockModification = {
    id: 2564,
    name: 'Modification note',
  };

  let getModificationTypeRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getModificationTypeRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockModification));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getModificationType();

    expect(returnedData).toEqual(mockModification);

    expect(getModificationTypeRequest).toHaveBeenCalledTimes(1);
    expect(getModificationTypeRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/annotations/modification_type',
    });
  });
});
