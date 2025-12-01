import $ from 'jquery';
import getModificationAuthors from '../getModificationAuthors';

describe('getModificationAuthors', () => {
  let getModificationAuthorsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = [{ id: 1, fullname: 'John Doe' }];

    getModificationAuthorsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint when the issue is an injury', async () => {
    const returnedData = await getModificationAuthors({
      athleteId: 1,
      injuryId: 3,
      illnessId: 5,
    });

    expect(returnedData).toEqual([{ id: 1, fullname: 'John Doe' }]);

    expect(getModificationAuthorsRequest).toHaveBeenCalledTimes(1);
    expect(getModificationAuthorsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/modifications/authors',
      data: { athlete_id: 1, issue_occurrence: { id: 3, type: 'injury' } },
    });
  });
});
