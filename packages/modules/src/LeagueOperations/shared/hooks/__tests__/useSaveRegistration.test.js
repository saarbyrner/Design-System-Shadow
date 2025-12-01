import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  getFormAnswersFactory,
  getFormAnswerSetIdFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { useSaveRegistrationFormMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import useFormToasts from '../useFormToasts';
import useSaveRegistration from '../useSaveRegistration';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi',
  () => ({
    useSaveRegistrationFormMutation: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi',
  () => ({
    useFetchRegistrationProfileQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    getRequirementId: jest.fn(),
    getUserId: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors',
  () => ({
    getFormAnswersFactory: jest.fn(),
    getFormAnswerSetIdFactory: jest.fn(),
  })
);
jest.mock('@kitman/modules/src/HumanInput/hooks/useStatus');
jest.mock('../useFormToasts', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = ({ args }) => {
  return storeFake({
    formStateSlice: {},
    formMenuSlice: {},
    formValidationSlice: {
      validation: {
        1: {
          status: 'PENDING',
          message: null,
        },
        2: {
          status: 'VALID',
          message: null,
        },
        3: {
          status: 'INVALID',
          message: null,
        },
      },
    },
    'LeagueOperations.registration.api.form': {
      useSaveRegistrationFormMutation: jest.fn(),
    },
    'LeagueOperations.registration.api.profile': {
      useFetchRegistrationProfileQuery: jest.fn(),
    },
    ...args,
  });
};

const mockSelectors = () => {
  getRequirementId.mockReturnValue(123);
  getUserId.mockReturnValue(123);
  getFormAnswersFactory.mockReturnValue(() => ({ 1: 'value' }));
  getFormAnswerSetIdFactory.mockReturnValue(() => 1);
};

const mockMutations = (state = {}) => {
  useSaveRegistrationFormMutation.mockReturnValue([
    jest.fn().mockReturnValue({ unwrap: () => Promise.resolve({}) }),
    {
      isLoading: false,
      isError: false,
      isSuccess: false,
      refetch: jest.fn(),
      ...state,
    },
  ]);
  useFetchRegistrationProfileQuery.mockReturnValue({
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: false,
    refetch: jest.fn(),
    ...state,
  });
};

describe('useSaveRegistration', () => {
  let localStore;

  beforeEach(() => {
    useFormToasts.mockReturnValue({
      onClearToasts: jest.fn(),
      onSaveErrorToast: jest.fn(),
      onSaveProgressToast: jest.fn(),
      onSaveRedirectToast: jest.fn(),
      onInvalidationToast: jest.fn(),
    });

    localStore = mockStore({
      formValidationSlice: {
        validation: {
          valid_field: {
            message: null,
            status: 'VALID',
          },
        },
      },
    });
    useStatus.mockReturnValue('PENDING');
    mockMutations();
    mockSelectors();
  });

  const renderUseSaveRegistrationHook = (store) => {
    return renderHook(() => useSaveRegistration(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
  };

  describe('initial state', () => {
    it('has initial state', () => {
      const { result } = renderUseSaveRegistrationHook(localStore);

      expect(result.current.handleOnSaveRegistration).toEqual(
        expect.any(Function)
      );
      expect(result.current.isSaveInProgress).toEqual(false);
      expect(result.current.isRefetchingProfile).toEqual(false);
    });
  });

  describe('handleOnSaveRegistration', () => {
    it('calls saveRegistrationProgress when validationStatus is VALID', async () => {
      useStatus.mockReturnValue('VALID');
      const { result } = renderUseSaveRegistrationHook(localStore);

      await act(async () => {
        await result.current.handleOnSaveRegistration();
      });

      expect(useSaveRegistrationFormMutation).toHaveBeenCalled();
    });

    it('calls onInvalidationToast when validationStatus is INVALID', async () => {
      const onInvalidationToast = jest.fn();
      useFormToasts.mockReturnValue({
        onInvalidationToast,
        onClearToasts: jest.fn(),
      });
      useStatus.mockReturnValue('INVALID');

      const { result } = renderUseSaveRegistrationHook(localStore);

      await act(async () => {
        await result.current.handleOnSaveRegistration();
      });

      expect(onInvalidationToast).toHaveBeenCalled();
    });
  });

  describe('effects', () => {
    it('calls onHandleRefreshProfile and onRedirect when isSaveProgressSuccess is true', async () => {
      mockMutations({ isSuccess: true });
      useStatus.mockReturnValue('VALID');
      const { result } = renderUseSaveRegistrationHook(localStore);

      await act(async () => {
        await result.current.handleOnSaveRegistration();
      });

      expect(useFetchRegistrationProfileQuery().refetch).toHaveBeenCalled();
    });

    it('calls onSaveErrorToast when isSaveProgressError is true', async () => {
      mockMutations({ isError: true });
      useStatus.mockReturnValue('VALID');
      const { result } = renderUseSaveRegistrationHook(localStore);

      await act(async () => {
        await result.current.handleOnSaveRegistration();
      });

      expect(useFetchRegistrationProfileQuery().refetch).not.toHaveBeenCalled();
    });
  });
});
