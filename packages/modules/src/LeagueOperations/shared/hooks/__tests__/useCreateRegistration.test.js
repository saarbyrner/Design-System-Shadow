import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  getFormAnswersFactory,
  getFormAnswerSetIdFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  useCreateRegistrationFormMutation,
  useFetchRegistrationRequirementsProfileFormQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import useCreateRegistration from '../useCreateRegistration';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
    ),
    getRequirementId: jest.fn(),
    getUserId: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors'
    ),
    getFormAnswersFactory: jest.fn(),
    getFormAnswerSetIdFactory: jest.fn(),
  })
);
jest.mock('@kitman/modules/src/HumanInput/hooks/useStatus');

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
      useCreateRegistrationFormMutation: jest.fn(),
      useFetchRegistrationRequirementsProfileFormQuery: jest.fn(),
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
  useCreateRegistrationFormMutation.mockReturnValue([
    'onCreateRegistration',
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
    isError: false,
    isSuccess: false,
    refetch: jest.fn(),
    ...state,
  });
  useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    refetch: jest.fn(),
    ...state,
  });
};

describe('useCreateRegistration', () => {
  describe('initial state', () => {
    const localStore = mockStore({
      formValidationSlice: {
        validation: {
          valid_field: {
            message: null,
            status: 'INVALID',
          },
        },
      },
    });
    beforeEach(() => {
      mockSelectors({});
      mockMutations();
      useStatus.mockReturnValue('PENDING');
    });
    it('has initial state', () => {
      const { result } = renderHook(() => useCreateRegistration(), {
        wrapper: ({ children }) => (
          <Provider store={localStore}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toEqual(true);
      expect(result.current.handleOnCreateRegistration).toEqual(
        expect.any(Function)
      );
    });
  });
  describe('isDisabled', () => {
    const localStore = mockStore({
      formValidationSlice: {
        validation: {
          1: {
            message: null,
            status: 'VALID',
          },
        },
      },
    });
    beforeEach(() => {
      mockSelectors({});
      mockMutations({ isLoading: false, isError: false, isSuccess: true });
      useStatus.mockReturnValue('VALID');
    });
    it('returns false when VALID', () => {
      const { result } = renderHook(() => useCreateRegistration(), {
        wrapper: ({ children }) => (
          <Provider store={localStore}>{children}</Provider>
        ),
      });
      expect(result.current.isDisabled).toEqual(false);
      expect(result.current.handleOnCreateRegistration).toEqual(
        expect.any(Function)
      );
    });
  });
});
