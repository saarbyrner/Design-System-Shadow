import { checkAndSetInitStaffCount, updateStaffCount } from '../utils';

describe('checkAndSetInitStaffCount', () => {
  it('should update staff count with unique checked staff member IDs', () => {
    const setStaffCountMock = jest.fn();
    const newStaff = [
      { id: 1, checked: true },
      { id: 2, checked: false },
      { id: 3, checked: true },
      { id: 1, checked: true },
    ];

    checkAndSetInitStaffCount(newStaff, setStaffCountMock);

    expect(setStaffCountMock).toHaveBeenCalledWith([1, 3]);
  });

  it('should update staff count to an empty array if no staff members are checked', () => {
    const setStaffCountMock = jest.fn();
    const newStaff = [
      { id: 1, checked: false },
      { id: 2, checked: false },
    ];

    checkAndSetInitStaffCount(newStaff, setStaffCountMock);

    expect(setStaffCountMock).toHaveBeenCalledWith([]);
  });

  it('should not update staff count if newStaff is empty', () => {
    const setStaffCountMock = jest.fn();
    const newStaff = [];

    checkAndSetInitStaffCount(newStaff, setStaffCountMock);

    expect(setStaffCountMock).not.toHaveBeenCalled();
  });

  it('should handle staff members with non-unique IDs correctly', () => {
    const setStaffCountMock = jest.fn();
    const newStaff = [
      { id: 1, checked: true },
      { id: 1, checked: true },
      { id: 2, checked: true },
    ];

    checkAndSetInitStaffCount(newStaff, setStaffCountMock);

    expect(setStaffCountMock).toHaveBeenCalledWith([1, 2]);
  });
});

describe('updateStaffCount', () => {
  it('should add the staff member ID if it is not already present', () => {
    const staffMemberId = 1;
    const setStaffCount = jest.fn();

    updateStaffCount(staffMemberId, setStaffCount);

    expect(setStaffCount).toHaveBeenCalledWith(expect.any(Function));
    const updateFunction = setStaffCount.mock.calls[0][0];
    expect(updateFunction([])).toEqual([1]);
  });

  it('should remove the staff member ID if it is already present', () => {
    const staffMemberId = 1;
    const setStaffCount = jest.fn();

    updateStaffCount(staffMemberId, setStaffCount);

    expect(setStaffCount).toHaveBeenCalledWith(expect.any(Function));
    const updateFunction = setStaffCount.mock.calls[0][0];
    expect(updateFunction([1])).toEqual([]);
  });
});
