import $ from 'jquery';
import getExaminerUsers from '../getExaminerUsers';

describe('getExaminerUsers', () => {
  let getExaminerUsersRequest;

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

    getExaminerUsersRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct npc endpoint and returns the correct value', async () => {
    const returnedData = await getExaminerUsers('npc');

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

    expect(getExaminerUsersRequest).toHaveBeenCalledTimes(1);
    expect(getExaminerUsersRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/medical_examiners?group=npc',
    });
  });

  it('calls the correct king_devick endpoint and returns the correct value', async () => {
    const returnedData = await getExaminerUsers('king_devick');

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

    expect(getExaminerUsersRequest).toHaveBeenCalledTimes(1);
    expect(getExaminerUsersRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/medical_examiners?group=king_devick',
    });
  });
});
