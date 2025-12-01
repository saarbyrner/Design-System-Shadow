import { parseFromTypeFromLocation } from '..';

describe('parseFromTypeFromLocation', () => {
  it('should correctly parse the user type, ID, and mode from a valid URL', () => {
    const url = '/administration/additional_users/scout/123/edit';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: 'scout',
      id: '123',
      mode: 'EDIT',
    });
  });

  it('should return null for ID if not present in the URL', () => {
    const url = '/administration/additional_users/scout/new';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: 'scout',
      id: null,
      mode: 'NEW',
    });
  });

  it('should return null values when URL is invalid', () => {
    const url = '/administration/invalid-url';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: null,
      id: null,
      mode: null,
    });
  });

  it('should correctly handle URLs with "edit" mode', () => {
    const url = '/administration/additional_users/official/999/edit';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: 'official',
      id: '999',
      mode: 'EDIT',
    });
  });

  it('should correctly handle URLs with "new" mode', () => {
    const url = '/administration/additional_users/scout/new';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: 'scout',
      id: null,
      mode: 'NEW',
    });
  });

  it('should return null values for an empty URL', () => {
    const url = '';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: null,
      id: null,
      mode: null,
    });
  });

  it('should correctly handle URLs with "new" mode and user is match director', () => {
    const url = '/administration/additional_users/match_director/new';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: 'match_director',
      id: null,
      mode: 'NEW',
    });
  });

  it('should correctly handle URLs with "edit" mode and user is match director', () => {
    const url = '/administration/additional_users/match_director/999/edit';
    const result = parseFromTypeFromLocation(url);
    expect(result).toEqual({
      userType: 'match_director',
      id: '999',
      mode: 'EDIT',
    });
  });
});
