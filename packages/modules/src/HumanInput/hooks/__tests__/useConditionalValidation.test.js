import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { onUpdateValidation } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { onUpdateField } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import * as formStateSelectors from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import * as formValidationSelectors from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';

import useConditionalValidation from '../useConditionalValidation';

jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors'
);
jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors'
);

jest.useFakeTimers();
jest.setSystemTime(new Date('2023-01-01T08:00:00Z'));

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const element = {
  id: 'element-id',
  element_type: INPUT_ELEMENTS.DateTime,
  config: {
    text: 'Test Element',
    custom_params: {
      validation: {
        element_id: 'target-element-id',
      },
    },
  },
};

const defaultStore = storeFake({
  formValidationSlice: {
    validation: {
      'element-id': {},
      20867: [],
    },
  },
  formStateSlice: {
    form: {
      'element-id': '2023-01-01T08:00:00Z',
      'target-element-id': '2023-01-01T08:00:00Z',
      20867: ['some value', 'some value 2'],
      20868: 'some value',
    },
    elements: {
      'element-id': element,
      'target-element-id': {
        id: 'target-element-id',
        config: {
          text: 'Target Element',
        },
      },
    },
  },
});

describe('useConditionalValidation', () => {
  let store;

  beforeEach(() => {
    store = defaultStore;
    formStateSelectors.getElementState.mockReturnValue({
      'element-id': element,
      'target-element-id': {
        id: 'target-element-id',
        config: {
          text: 'Target Element',
        },
      },
    });
    formStateSelectors.getFormState.mockReturnValue({
      'element-id': '2023-01-01T08:00:00Z',
      'target-element-id': '2023-01-01T08:00:00Z',
      20867: ['some value', 'some value 2'],
    });
    formStateSelectors.getFieldValueFactory.mockReturnValue(
      () => '2023-01-01T08:00:00Z'
    );
    formValidationSelectors.getFieldValidationFactory.mockReturnValue(() => ({
      status: 'PENDING',
      message: null,
    }));

    store.dispatch = mockDispatch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useConditionalValidation({ element }), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(typeof result.current.onChange).toBe('function');
  });

  it('should dispatch validation update when conditional validation is satisfied', () => {
    formStateSelectors.getFormState.mockReturnValueOnce({
      'element-id': '2023-01-01T08:00:00Z',
      'target-element-id': '2023-01-01T08:00:00Z',
    });

    const { result } = renderHook(() => useConditionalValidation({ element }), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      onUpdateValidation({
        'element-id': {
          status: 'VALID',
          message: 'Test Element must match Target Element',
        },
      })
    );

    act(() => {
      result.current.onChange('2023-01-01T08:00:00Z');
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      onUpdateField({
        'element-id': '2023-01-01T08:00:00Z',
      })
    );
  });

  it('should dispatch validation update when conditional validation is not satisfied', () => {
    formStateSelectors.getFormState.mockReturnValueOnce({
      'element-id': '2023-01-01T08:00:00Z',
      'target-element-id': '2023-01-02T08:00:00Z',
    });

    const { result } = renderHook(() => useConditionalValidation({ element }), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      onUpdateValidation({
        'element-id': {
          status: 'INVALID',
          message: 'Test Element must match Target Element',
        },
      })
    );

    act(() => {
      result.current.onChange('2023-01-01T08:00:00Z');
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      onUpdateField({
        'element-id': '2023-01-01T08:00:00Z',
      })
    );
  });

  describe('repeatable groups', () => {
    const ELEMENT_CHILD_OF_REPEATABLE_GROUP = {
      id: 20867,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Name of supplement',
        data_point: false,
        element_id: 'supplement_name',
        optional: true,
      },
      visible: true,
      order: 1,
      form_elements: [],
    };

    it('should dispatch element value and validation update correctly for an element inside a repeatable group', () => {
      formValidationSelectors.getValidationState.mockReturnValue({
        20867: [
          { status: 'VALID', message: null },
          { status: 'PENDING', message: null },
        ],
      });

      formStateSelectors.getFieldValueFactory.mockReturnValue(() => [
        'some value',
        'some value 2',
      ]);

      formStateSelectors.getFormState.mockReturnValueOnce({
        20867: ['some value', 'some value 2'],
      });

      formValidationSelectors.getFieldValidationFactory.mockReturnValue(() => [
        { status: 'VALID', message: null },
        { status: 'PENDING', message: null },
      ]);

      const { result } = renderHook(
        () =>
          useConditionalValidation({
            element: ELEMENT_CHILD_OF_REPEATABLE_GROUP,
            repeatableGroupInfo: { repeatable: true, groupNumber: 1 },
          }),
        {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        }
      );

      act(() => {
        result.current.onChange('some new value');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        onUpdateField({
          20867: ['some value', 'some new value'],
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        onUpdateValidation({
          20867: [
            { status: 'VALID', message: null },
            { status: 'VALID', message: null },
          ],
        })
      );
    });
  });
});
