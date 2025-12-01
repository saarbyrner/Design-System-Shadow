import $ from 'jquery';
import savePrinciples from '../savePrinciples';

describe('savePrinciples', () => {
  let savePrinciplesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    savePrinciplesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const principles = [
      {
        id: 1,
        name: 'Fake principle 1',
        principle_category_ids: [2, 4],
        principle_type_ids: [1],
        phase_ids: [3],
        squad_ids: [73],
      },
      {
        id: 2,
        name: 'Fake principle 2',
        principle_category_ids: [1, 3],
        principle_type_ids: [2, 3],
        phase_ids: [1, 2, 3],
        squad_ids: [1374],
      },
      {
        id: 3,
        name: 'Fake principle 3',
        principle_category_ids: [4, 5],
        principle_type_ids: [2],
        phase_ids: [2, 3],
        squad_ids: [8, 1374],
      },
    ];

    await savePrinciples(principles);

    expect(savePrinciplesRequest).toHaveBeenCalledTimes(1);
    expect(savePrinciplesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/principles/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        principles,
      }),
    });
  });
});
