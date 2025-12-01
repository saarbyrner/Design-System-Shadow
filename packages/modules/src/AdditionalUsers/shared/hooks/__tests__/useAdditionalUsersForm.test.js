import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { useFetchAdditionalUserQuery } from '@kitman/modules/src/AdditionalUsers/shared/redux/services';
import { parseFromTypeFromLocation } from '@kitman/modules/src/AdditionalUsers/shared/utils';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import {
  onUpdateForm,
  onReset,
} from '@kitman/modules/src/AdditionalUsers/shared/redux/slices/additionalUsersSlice';
import { newAdditionalUser } from '@kitman/modules/src/AdditionalUsers/shared/redux/services/mocks/data/mock_additional_users_list';
import useAdditionalUsersForm from '../useAdditionalUsersForm';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@kitman/modules/src/AdditionalUsers/shared/redux/services', () => ({
  useFetchAdditionalUserQuery: jest.fn(),
}));

jest.mock('@kitman/modules/src/AdditionalUsers/shared/utils', () => ({
  parseFromTypeFromLocation: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());

describe('useAdditionalUsersForm', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    parseFromTypeFromLocation.mockReturnValue({
      id: '123',
      userType: 'official',
      mode: 'EDIT',
    });
    useLocationPathname.mockReturnValue(
      '/administration/additional_users/official/123/edit'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch additional user data when id is provided and mode is not NEW', () => {
    useFetchAdditionalUserQuery.mockReturnValue({
      data: newAdditionalUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    const { result } = renderHook(() => useAdditionalUsersForm());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFailed).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.additionalUser).toEqual(newAdditionalUser);
    expect(dispatchMock).toHaveBeenCalledWith(
      onUpdateForm({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        locale: 'en',
        date_of_birth: '1990-01-01',
      })
    );
  });

  it('should call onReset when no additional user data is available', () => {
    useFetchAdditionalUserQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });

    const { result } = renderHook(() => useAdditionalUsersForm());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFailed).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.additionalUser).toBeNull();
    expect(dispatchMock).toHaveBeenCalledWith(onReset());
  });

  it('should dispatch onReset if data is null', () => {
    parseFromTypeFromLocation.mockReturnValue({
      id: null,
      userType: 'scout',
      mode: 'NEW',
    });

    useFetchAdditionalUserQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });

    const { result } = renderHook(() => useAdditionalUsersForm());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFailed).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.additionalUser).toBeNull();
    expect(dispatchMock).toHaveBeenCalledWith(onReset());
  });

  it('should handle loading state properly', () => {
    useFetchAdditionalUserQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    });

    const { result } = renderHook(() => useAdditionalUsersForm());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasFailed).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.additionalUser).toBeNull();
  });

  it('should handle error state properly', () => {
    useFetchAdditionalUserQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
    });

    const { result } = renderHook(() => useAdditionalUsersForm());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasFailed).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.additionalUser).toBeNull();
  });
});
