import { renderHook } from '@testing-library/react-hooks';
import useDefaultPractitionerEffect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDefaultPractitionerEffect';

describe('useDefaultPractitionerEffect', () => {
  it('sets practitioner to current user when eligible', () => {
    const dispatch = jest.fn();
    const currentUser = { id: 42 };
    const staffUsers = [{ value: 42 }, { value: 7 }];

    renderHook(() =>
      useDefaultPractitionerEffect({
        isOpen: true,
        currentUser,
        staffUsers,
        isRedoxOrg: false,
        hasUserId: false,
        dispatch,
      })
    );

    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_USER_ID', userId: 42 });
  });

  it('does not set practitioner when redox org', () => {
    const dispatch = jest.fn();
    const currentUser = { id: 42 };
    const staffUsers = [{ value: 42 }];

    renderHook(() =>
      useDefaultPractitionerEffect({
        isOpen: true,
        currentUser,
        staffUsers,
        isRedoxOrg: true,
        hasUserId: false,
        dispatch,
      })
    );

    expect(dispatch).not.toHaveBeenCalled();
  });
});
