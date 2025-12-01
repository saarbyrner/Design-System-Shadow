import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import {
  useExpireRegistrationMutation,
  useConvertNonRegistratedPlayerIntoRegistratedMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { registrationGlobalApi } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { useFetchRegistrationHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import mockedRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_history';
import useGridActions from '../useGridActions';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  usePermissions: jest.fn(),
}));

jest.mock(
  '@kitman/common/src/contexts/PreferenceContext/preferenceContext',
  () => ({
    usePreferences: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi',
  () => ({
    useExpireRegistrationMutation: jest.fn(),
    useConvertNonRegistratedPlayerIntoRegistratedMutation: jest.fn(),
  })
);

jest.mock('@kitman/common/src/redux/global/selectors');

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    registrationGlobalApi: {
      useCreateUserRegistrationStatusMutation: jest.fn(),
      useUpdateUserRegistrationStatusMutation: jest.fn(),
    },
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi',
  () => ({
    useFetchRegistrationHistoryQuery: jest.fn(),
  })
);
describe('useGridActions', () => {
  const mockDispatch = jest.fn();
  const mockExpireRegistration = jest.fn();
  const mockPreferences = {
    registration_expire_enabled: true,
  };
  const mockPermissions = {
    registration: {
      status: {
        expire: true,
        canManageUnapprove: true,
      },
    },
    homegrown: {
      canManageHomegrown: true,
    },
  };
  const mockCurrentSquad = {
    division: [{ name: 'Test Division', id: '123' }],
    id: '456',
    name: 'Test Squad',
  };
  const mockSelectedRow = {
    athlete: [{ text: 'Test Athlete' }],
    user_id: '789',
    registrations: [
      {
        id: 'reg123',
        division: { id: '123' },
        user_id: '789',
        status: RegistrationStatusEnum.APPROVED,
        registration_system_status: {
          id: 1,
          type: RegistrationStatusEnum.APPROVED,
          name: 'Approved',
        },
      },
    ],
    registration_status: RegistrationStatusEnum.APPROVED,
    registration_system_status: {
      id: 1,
      type: RegistrationStatusEnum.APPROVED,
      name: 'Approved',
    },
  };

  const mockSelectedRowWithNonRegisteredPlayer = {
    athlete: [{ text: 'Test Athlete' }],
    user_id: '789',
    id: 'reg123',
    non_registered: true,
    registrations: [
      {
        id: 'reg123',
        division: { id: '123' },
        user_id: '789',
        status: RegistrationStatusEnum.APPROVED,
        registration_system_status: {
          id: 1,
          type: RegistrationStatusEnum.APPROVED,
          name: 'Approved',
        },
      },
    ],
    registration_status: RegistrationStatusEnum.APPROVED,
    registration_system_status: {
      id: 1,
      type: RegistrationStatusEnum.APPROVED,
      name: 'Approved',
    },
  };

  const mockApprovalState = {
    status: RegistrationStatusEnum.APPROVED,
    reasonId: 123,
    annotation: 'Test Annotation',
  };

  useEventTracking.mockReturnValue({
    trackEvent: jest.fn(),
  });

  const mockUpdateUserRegistrationStatus = jest.fn().mockReturnValue({
    unwrap: jest.fn().mockResolvedValue({ data: {} }),
  });

  const mockConvertNonRegisteredPlayerIntoRegistered = jest
    .fn()
    .mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: {} }),
    });

  registrationGlobalApi.useCreateUserRegistrationStatusMutation.mockReturnValue(
    [jest.fn().mockResolvedValue({ data: {} })]
  );
  registrationGlobalApi.useUpdateUserRegistrationStatusMutation.mockReturnValue(
    [mockUpdateUserRegistrationStatus]
  );

  useFetchRegistrationHistoryQuery.mockReturnValue({
    data: mockedRegistrationHistory,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.getFlag = jest.fn().mockReturnValue(true);
    useDispatch.mockReturnValue(mockDispatch);
    getActiveSquad.mockReturnValue(() => mockCurrentSquad);
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'getSelectedRow') return mockSelectedRow;
      if (selector.name === 'getApprovalState') return mockApprovalState;
      if (typeof selector === 'function') return selector();
      return null;
    });
    usePermissions.mockReturnValue({ permissions: mockPermissions });
    usePreferences.mockReturnValue({ preferences: mockPreferences });
    useExpireRegistrationMutation.mockReturnValue([mockExpireRegistration]);
    useConvertNonRegistratedPlayerIntoRegistratedMutation.mockReturnValue([
      mockConvertNonRegisteredPlayerIntoRegistered,
    ]);
  });

  it('should return correct actions for an athlete row', () => {
    const { result } = renderHook(() => useGridActions());
    const row = {
      athlete: [{ text: 'Test Athlete' }],
      registration_status: RegistrationStatusEnum.APPROVED,
      registration_system_status: {
        type: RegistrationStatusEnum.APPROVED,
        id: 1,
        name: 'Approved',
      },
    };

    const actions = result.current.actions(row);
    expect(actions).toHaveLength(2);
    expect(actions[0].props.label).toBe('Expire Registration');
    expect(actions[1].props.label).toBe('Change Status');
  });

  it('should not show expire registration action when feature flag is disabled', () => {
    window.getFlag.mockReturnValue(false);
    const { result } = renderHook(() => useGridActions());
    const row = {
      athlete: [{ text: 'Test Athlete' }],
      registration_status: RegistrationStatusEnum.APPROVED,
      registration_system_status: {
        type: RegistrationStatusEnum.APPROVED,
        id: 1,
        name: 'Approved',
      },
    };

    const actions = result.current.actions(row);
    expect(actions).toHaveLength(0);
  });

  it('should handle expire registration action', async () => {
    const { result } = renderHook(() => useGridActions());
    const row = {
      athlete: [{ text: 'Test Athlete' }],
      registration_status: RegistrationStatusEnum.APPROVED,
      registration_system_status: {
        type: RegistrationStatusEnum.APPROVED,
        id: 1,
        name: 'Approved',
      },
    };

    await act(async () => {
      await result.current.actions(row)[0].props.onClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          isOpen: true,
          action: 'expire_registration',
          text: expect.objectContaining({
            header: 'Expire Registration',
            body: expect.stringContaining('Click confirm to expire the'),
          }),
        }),
      })
    );

    await act(async () => {
      await result.current.actions(row)[1].props.onClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          isOpen: true,
        }),
      })
    );
  });

  it('should handle modal close', () => {
    const { result } = renderHook(() => useGridActions());

    act(() => {
      result.current.handleModalClose();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          isOpen: false,
        }),
      })
    );
  });

  it('should call the update approval status mutation when the [update_unapproval_status_annotation] action is called', async () => {
    const { result } = renderHook(() => useGridActions());
    await act(async () => {
      await result.current.onConfirm('update_unapproval_status_annotation');
    });

    expect(mockUpdateUserRegistrationStatus).toHaveBeenCalledWith({
      userId: '789',
      userRegistrationId: 'reg123',
      payload: {
        annotation: 'Test Annotation',
        registration_status_id: 166,
        registration_status_reason_id: 123,
      },
    });
  });

  it('should call the converting non-registered player mutation when the [register_non_reg_player] action is called', async () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'getSelectedRow')
        return mockSelectedRowWithNonRegisteredPlayer;
      if (selector.name === 'getApprovalState') return mockApprovalState;
      if (typeof selector === 'function') return selector();
      return null;
    });

    const { result } = renderHook(() => useGridActions());

    await act(async () => {
      await result.current.onConfirm('register_non_reg_player');
    });

    expect(mockConvertNonRegisteredPlayerIntoRegistered).toHaveBeenCalledWith({
      athleteId: 'reg123',
    });
  });

  it('should handle converting non-registrated player action', async () => {
    const { result } = renderHook(() => useGridActions());
    const row = {
      athlete: [{ text: 'Test Athlete' }],
      id: 'reg123',
      non_registered: true,
      registration_status: RegistrationStatusEnum.APPROVED,
      registration_system_status: {
        type: RegistrationStatusEnum.APPROVED,
        id: 1,
        name: 'Approved',
      },
    };

    await act(async () => {
      await result.current.actions(row)[2].props.onClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          isOpen: true,
          action: 'register_non_reg_player',
          text: expect.objectContaining({
            header: 'Convert a non-registered athlete to a registered athlete.',
            body: expect.stringContaining(
              'Converting an athlete to registered will:'
            ),
          }),
        }),
      })
    );

    await act(async () => {
      await result.current.actions(row)[1].props.onClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          isOpen: true,
        }),
      })
    );
  });

  it('should return no actions when no permissions are granted', () => {
    usePermissions.mockReturnValue({
      permissions: {
        registration: {
          status: {
            expire: false,
            canManageUnapprove: false,
          },
        },
        homegrown: {
          canManageHomegrown: false,
        },
      },
    });

    usePreferences.mockReturnValue({ preferences: {} });
    const { result } = renderHook(() => useGridActions());
    const row = {
      athlete: [{ text: 'Test Athlete' }],
      registration_status: RegistrationStatusEnum.APPROVED,
      registration_system_status: {
        type: RegistrationStatusEnum.APPROVED,
        id: 1,
        name: 'Approved',
      },
    };

    const actions = result.current.actions(row);
    expect(actions).toHaveLength(0);
  });

  it('should handle data update for register non-registered player', async () => {
    const { result } = renderHook(() => useGridActions());
    const row = {
      athlete: [{ text: 'Test Athlete' }],
      id: 'reg123',
      non_registered: true,
      registration_status: RegistrationStatusEnum.APPROVED,
      registration_system_status: {
        type: RegistrationStatusEnum.APPROVED,
        id: 1,
        name: 'Approved',
      },
    };

    await act(async () => {
      await result.current.actions(row)[2].props.onClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          isOpen: true,
          action: 'register_non_reg_player',
        }),
      })
    );
  });
});
