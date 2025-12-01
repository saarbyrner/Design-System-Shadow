import $ from 'jquery';
import deletePrinciple from '../deletePrinciple';

describe('deletePrinciple', () => {
  let deletePrincipleRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deletePrincipleRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await deletePrinciple(3);

    expect(deletePrincipleRequest).toHaveBeenCalledTimes(1);
    expect(deletePrincipleRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/ui/planning_hub/principles/3',
    });
  });
});
