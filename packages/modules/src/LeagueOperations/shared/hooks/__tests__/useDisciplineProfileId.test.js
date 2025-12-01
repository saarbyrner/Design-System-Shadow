import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { useFetchUserQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { data as mockedUsers } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_user_list';

import useDisciplineProfileId from '../useDisciplineProfileId';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    useFetchUserQuery: jest.fn(),
  })
);

jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');

describe('useDisciplineProfileId', () => {
  let dispatchMock;
  const mockedUser = mockedUsers[0];

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    useFetchUserQuery.mockReturnValue({
      data: mockedUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch necessary calls when data is fetched successfully', async () => {
    // Render hook
    const { result } = renderHook(() => useDisciplineProfileId());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);

    // onSetProfile
    expect(dispatchMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: {
          profile: mockedUser,
        },
        type: 'LeagueOperations.registration.slice.profile/onSetProfile',
      })
    );
    // onSetId
    expect(dispatchMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        payload: {
          id: '645235245664daf0f8fccc44',
        },
        type: 'LeagueOperations.registration.slice.profile/onSetId',
      })
    );
    // onSetUserToBeDisciplined
    expect(dispatchMock).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        payload: {
          userToBeDisciplined: {
            name: 'Latasha Christian',
            organisations: [
              {
                id: 115,
                logo_full_path:
                  'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96',
                name: 'LA Galaxy',
              },
            ],
            squads: [{ id: '64523524b8da2446b3d4bb6b', name: 'U15' }],
            user_id: '645235245664daf0f8fccc44',
          },
        },
        type: 'LeagueOperations.discipline.slice.manage/onSetUserToBeDisciplined',
      })
    );
    // onSetDisciplinaryIssueDetails
    expect(dispatchMock).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        payload: {
          user_id: '645235245664daf0f8fccc44',
        },
        type: 'LeagueOperations.discipline.slice.manage/onSetDisciplinaryIssueDetails',
      })
    );
    // onSetDisciplineProfile
    expect(dispatchMock).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        payload: {
          profile: {
            name: 'Latasha Christian',
            organisations: [
              {
                id: 115,
                logo_full_path:
                  'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96',
                name: 'LA Galaxy',
              },
            ],
            squads: [{ id: '64523524b8da2446b3d4bb6b', name: 'U15' }],
            user_id: '645235245664daf0f8fccc44',
          },
        },
        type: 'LeagueOperations.discipline.slice.manage/onSetDisciplineProfile',
      })
    );
  });
});
