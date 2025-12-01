import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import useRequiredFields from '../useRequiredFields';

describe('useRequiredFields', () => {
  let renderHookResult;

  const renderUseRequiredFieldsHook = (store) =>
    act(() => {
      renderHookResult = renderHook(() => useRequiredFields(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });

  it('returns show optional because more fields are required than optional', async () => {
    const store = storeFake({
      formStateSlice: {
        form: {},
        originalForm: {},
        elements: {
          is_active: {
            id: 23762,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'true',
                  label: 'Active',
                },
                {
                  value: 'false',
                  label: 'Inactive',
                },
              ],
              text: 'Status',
              data_point: false,
              element_id: 'is_active',
              custom_params: {
                style: 'radio',
                internal_source: {
                  object: 'user',
                  field: 'is_active',
                },
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          firstname: {
            id: 23763,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'First name',
              data_point: false,
              element_id: 'firstname',
              custom_params: {
                readonly: true,
                internal_source: {
                  object: 'user',
                  field: 'firstname',
                },
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
          lastname: {
            id: 23764,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Last name',
              data_point: false,
              element_id: 'lastname',
              custom_params: {
                readonly: true,
                internal_source: {
                  object: 'user',
                  field: 'lastname',
                },
              },
              repeatable: false,
              optional: true,
            },
            visible: true,
            order: 3,
            form_elements: [],
          },
        },
      },
      formValidationSlice: {},
    });

    renderUseRequiredFieldsHook(store);

    expect(renderHookResult.current).toHaveProperty('showOptionalIndicator');
    expect(renderHookResult.current.showOptionalIndicator).toEqual(true);
    expect(renderHookResult.current).toHaveProperty('showRequiredIndicator');
    expect(renderHookResult.current.showRequiredIndicator).toEqual(false);
  });

  it('returns show required because more fields are required than optional', async () => {
    const store = storeFake({
      formStateSlice: {
        form: {},
        originalForm: {},
        elements: {
          is_active: {
            id: 23762,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'true',
                  label: 'Active',
                },
                {
                  value: 'false',
                  label: 'Inactive',
                },
              ],
              text: 'Status',
              data_point: false,
              element_id: 'is_active',
              custom_params: {
                style: 'radio',
                internal_source: {
                  object: 'user',
                  field: 'is_active',
                },
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          firstname: {
            id: 23763,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'First name',
              data_point: false,
              element_id: 'firstname',
              custom_params: {
                readonly: true,
                internal_source: {
                  object: 'user',
                  field: 'firstname',
                },
              },
              repeatable: false,
              optional: true,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
          lastname: {
            id: 23764,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Last name',
              data_point: false,
              element_id: 'lastname',
              custom_params: {
                readonly: true,
                internal_source: {
                  object: 'user',
                  field: 'lastname',
                },
              },
              repeatable: false,
              optional: true,
            },
            visible: true,
            order: 3,
            form_elements: [],
          },
        },
      },
      formValidationSlice: {},
    });

    renderUseRequiredFieldsHook(store);

    expect(renderHookResult.current).toHaveProperty('showOptionalIndicator');
    expect(renderHookResult.current.showOptionalIndicator).toEqual(false);
    expect(renderHookResult.current).toHaveProperty('showRequiredIndicator');
    expect(renderHookResult.current.showRequiredIndicator).toEqual(true);
  });

  it('returns show optional because required and optional are equal', async () => {
    const store = storeFake({
      formStateSlice: {
        form: {},
        originalForm: {},
        elements: {
          is_active: {
            id: 23762,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'true',
                  label: 'Active',
                },
                {
                  value: 'false',
                  label: 'Inactive',
                },
              ],
              text: 'Status',
              data_point: false,
              element_id: 'is_active',
              custom_params: {
                style: 'radio',
                internal_source: {
                  object: 'user',
                  field: 'is_active',
                },
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          firstname: {
            id: 23763,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'First name',
              data_point: false,
              element_id: 'firstname',
              custom_params: {
                readonly: true,
                internal_source: {
                  object: 'user',
                  field: 'firstname',
                },
              },
              repeatable: false,
              optional: true,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
        },
      },
      formValidationSlice: {},
    });

    renderUseRequiredFieldsHook(store);

    expect(renderHookResult.current).toHaveProperty('showOptionalIndicator');
    expect(renderHookResult.current.showOptionalIndicator).toEqual(true);
    expect(renderHookResult.current).toHaveProperty('showRequiredIndicator');
    expect(renderHookResult.current.showRequiredIndicator).toEqual(false);
  });

  it('returns the corrent count of required and optional fields if no elements provided', async () => {
    const store = storeFake({
      formStateSlice: {
        form: {},
        originalForm: {},
        elements: {},
      },
      formValidationSlice: {},
    });

    renderUseRequiredFieldsHook(store);

    expect(renderHookResult.current).toHaveProperty('showOptionalIndicator');
    expect(renderHookResult.current.showOptionalIndicator).toEqual(false);
    expect(renderHookResult.current).toHaveProperty('showOptionalIndicator');
    expect(renderHookResult.current.showOptionalIndicator).toEqual(false);
  });
});
