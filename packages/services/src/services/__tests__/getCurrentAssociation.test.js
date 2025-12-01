import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getCurrentAssociation';
import getCurrentAssociation from '../getCurrentAssociation';

describe('getCurrentAssociation', () => {
  let getCurrentAssociationRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getCurrentAssociationRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCurrentAssociation();

    expect(returnedData).toEqual(serverResponse);

    expect(getCurrentAssociationRequest).toHaveBeenCalledTimes(1);
    expect(getCurrentAssociationRequest).toHaveBeenCalledWith({
      method: 'GET',
      contentType: 'application/json',
      url: '/ui/associations/current',
    });
  });
});
