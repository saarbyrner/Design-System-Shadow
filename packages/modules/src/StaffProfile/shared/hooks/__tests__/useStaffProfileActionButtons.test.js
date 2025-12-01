import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import useStaffProfileActionButtons from '@kitman/modules/src/StaffProfile/shared/hooks/useStaffProfileActionButtons';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const generateStore = (mode) => {
  return storeFake({
    formStateSlice: {
      ...initialFormState,
      config: {
        mode,
      },
    },
    formValidationSlice: {
      validation: {},
    },
  });
};

const createStore = generateStore(MODES.CREATE);
const viewStore = generateStore(MODES.VIEW);
const editStore = generateStore(MODES.EDIT);

const generalProvider = (store) => {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

describe('useStaffProfileActionButtons', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        settings: { canManageStaffUsers: true },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });
  let renderHookResult;

  describe('MODES.CREATE', () => {
    it('returns the create button', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileActionButtons(), {
          wrapper: generalProvider(createStore),
        }).result;
      });

      expect(renderHookResult.current.actionButtons).toHaveLength(1);
      expect(renderHookResult.current.actionButtons[0].props.children).toEqual(
        'Create'
      );
    });

    it('does not return any button when the user does not have edit permissions', async () => {
      usePermissions.mockReturnValue({
        permissions: {
          settings: { canManageStaffUsers: false },
        },
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileActionButtons(), {
          wrapper: generalProvider(createStore),
        }).result;
      });

      expect(renderHookResult.current.actionButtons).toHaveLength(0);
    });
  });

  describe('MODES.VIEW', () => {
    it('returns the edit button', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileActionButtons(), {
          wrapper: generalProvider(viewStore),
        }).result;
      });

      expect(renderHookResult.current.actionButtons).toHaveLength(1);
      expect(renderHookResult.current.actionButtons[0].props.children).toEqual(
        'Edit'
      );
    });

    it('does not return any button when the user does not have edit permissions', async () => {
      usePermissions.mockReturnValue({
        permissions: {
          settings: { canManageStaffUsers: false },
        },
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileActionButtons(), {
          wrapper: generalProvider(viewStore),
        }).result;
      });

      expect(renderHookResult.current.actionButtons).toHaveLength(0);
    });
  });

  describe('MODES.EDIT', () => {
    it('returns the save and cancel button', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileActionButtons(), {
          wrapper: generalProvider(editStore),
        }).result;
      });

      expect(renderHookResult.current.actionButtons).toHaveLength(2);
      expect(renderHookResult.current.actionButtons[0].props.children).toEqual(
        'Save'
      );
      expect(renderHookResult.current.actionButtons[1].props.children).toEqual(
        'Cancel'
      );
    });

    it('does not return any button when the user does not have edit permissions', async () => {
      usePermissions.mockReturnValue({
        permissions: {
          settings: { canManageStaffUsers: false },
        },
      });
      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileActionButtons(), {
          wrapper: generalProvider(editStore),
        }).result;
      });

      expect(renderHookResult.current.actionButtons).toHaveLength(0);
    });
  });
});
