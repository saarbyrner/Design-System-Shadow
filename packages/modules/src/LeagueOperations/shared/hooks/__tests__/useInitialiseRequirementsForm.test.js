import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { MOCK_GLOBAL_API } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { useFetchRegistrationRequirementsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import {
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import useInitialiseRequirementsForm from '../useInitialiseRequirementsForm';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi'
    ),
    useFetchRegistrationRequirementsQuery: jest.fn(),
  })
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

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.form': {
    useFetchRegistrationRequirementsQuery: jest.fn(),
  },
  formStateSlice: {},
});

const mockSelectors = () => {
  getRequirementId.mockReturnValue(123);
  getUserId.mockReturnValue(123);
};

const setUp = () => {
  MOCK_GLOBAL_API();
  mockSelectors();
};

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

describe('useInitialiseRequirementsForm', () => {
  describe('initial state', () => {
    beforeEach(() => {
      setUp();
      useFetchRegistrationRequirementsQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: false,
        data: {},
      });
    });
    it('has initial state', () => {
      const result = renderHook(() => useInitialiseRequirementsForm(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });
  describe('loading state', () => {
    beforeEach(() => {
      setUp();
      useFetchRegistrationRequirementsQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: {},
      });
    });
    it('has initial state', () => {
      const result = renderHook(() => useInitialiseRequirementsForm(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });
  describe('failure state', () => {
    beforeEach(() => {
      setUp();
      useFetchRegistrationRequirementsQuery.mockReturnValue({
        isLoading: false,
        isError: true,
        isSuccess: false,
        data: {},
      });
    });
    it('has initial state', () => {
      const result = renderHook(() => useInitialiseRequirementsForm(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(true);
    });
  });

  describe("when viewing a user's registration form", () => {
    const useDispatchMock = jest.fn();

    const MOCK_FORM = {
      form_template_version: {
        form_elements: [],
      },
    };

    beforeEach(() => {
      mockSelectors();
      useFetchRegistrationRequirementsQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: false,
        data: MOCK_FORM,
      });
      defaultStore.dispatch = useDispatchMock;
    });

    it('correctly sets the form data using the form API', () => {
      renderHook(() => useInitialiseRequirementsForm(), {
        wrapper,
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
        payload: {
          structure: MOCK_FORM,
        },
        type: 'formStateSlice/onSetFormStructure',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(2, {
        payload: { mode: 'CREATE' },
        type: 'formStateSlice/onSetMode',
      });
      expect(useDispatchMock).toHaveBeenNthCalledWith(3, {
        payload: { showMenuIcons: true },
        type: 'formStateSlice/onUpdateShowMenuIcons',
      });
      expect(useDispatchMock).toHaveBeenNthCalledWith(4, {
        payload: { elements: [] },
        type: 'formStateSlice/onBuildFormState',
      });
      expect(useDispatchMock).toHaveBeenNthCalledWith(5, {
        payload: { elements: [] },
        type: 'formMenuSlice/onBuildFormMenu',
      });
      expect(useDispatchMock).toHaveBeenNthCalledWith(6, {
        payload: { elements: [] },
        type: 'formValidationSlice/onBuildValidationState',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(7, {
        payload: { formAnswers: [] },
        type: 'formStateSlice/onSetFormAnswersSet',
      });
    });
  });
});
