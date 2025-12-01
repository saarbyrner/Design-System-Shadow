import $ from 'jquery';
import data from '@kitman/services/src/mocks/handlers/medical/stockManagement/searchDispensableDrugs';
import searchDispensableDrugs from '../searchDispensableDrugs';

describe('searchDispensableDrugs', () => {
  let searchDispensableDrugsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    searchDispensableDrugsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchDispensableDrugs('advil');
    expect(returnedData).toEqual(data);
    expect(searchDispensableDrugsRequest).toHaveBeenCalledTimes(1);

    expect(searchDispensableDrugsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/fdb/search_dispensable_drugs',
      data: {
        search_expression: 'advil',
      },
    });
  });
});
