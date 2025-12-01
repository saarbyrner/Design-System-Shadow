import $ from 'jquery';
import getStaffUsers from '../getStaffUsers';

describe('getStaffUsers', () => {
  let getStaffUsersRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = [
      {
        id: 1236,
        firstname: 'Stuart',
        lastname: "O'Brien",
        fullname: "Stuart O'Brien",
      },
      {
        id: 1239,
        firstname: 'Stephen',
        lastname: 'Smith',
        fullname: 'Stephen Smith',
      },
      {
        id: 1571,
        firstname: 'Rod',
        lastname: 'Murphy',
        fullname: 'Rod Murphy',
      },
    ];

    getStaffUsersRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getStaffUsers();

    expect(returnedData).toEqual([
      {
        id: 1236,
        firstname: 'Stuart',
        lastname: "O'Brien",
        fullname: "Stuart O'Brien",
      },
      {
        id: 1239,
        firstname: 'Stephen',
        lastname: 'Smith',
        fullname: 'Stephen Smith',
      },
      {
        id: 1571,
        firstname: 'Rod',
        lastname: 'Murphy',
        fullname: 'Rod Murphy',
      },
    ]);

    expect(getStaffUsersRequest).toHaveBeenCalledTimes(1);
    expect(getStaffUsersRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/staff_only',
    });
  });
});
