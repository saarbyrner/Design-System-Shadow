import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import { REDUCER_KEY as FORM_STATE_SLICE_REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { REDUCER_KEY as FORM_MENU_SLICE_REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { REDUCER_KEY as FORM_VALIDATION_SLICE_REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { usePopulateFormState } from '../usePopulateFormState';

describe('usePopulateFormState', () => {
  const store = storeFake({
    formStateSlice: {},
  });

  const actAndRenderHook = async (data) => {
    await act(async () => {
      renderHook(() => usePopulateFormState(data), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });
    });
  };

  it('should dispatch the right actions with data', async () => {
    await actAndRenderHook(humanInputFormMockData);

    const mockElements =
      humanInputFormMockData.form_template_version.form_elements;

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        structure: humanInputFormMockData,
      },
      type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetFormStructure`,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        formAnswers: humanInputFormMockData.form_answers,
      },
      type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetFormAnswersSet`,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        elements: mockElements,
      },
      type: `${FORM_STATE_SLICE_REDUCER_KEY}/onBuildFormState`,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        elements: mockElements,
      },
      type: `${FORM_MENU_SLICE_REDUCER_KEY}/onBuildFormMenu`,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        elements: mockElements,
      },
      type: `${FORM_VALIDATION_SLICE_REDUCER_KEY}/onBuildValidationState`,
    });
  });

  it('should not dispatch anything without data', async () => {
    await actAndRenderHook(undefined);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('parsing and transforming form variations properly', () => {
    it('should parse and return data as it is for single menu variation and not call onUpdateShouldShowMenu', async () => {
      await actAndRenderHook(humanInputFormMockData);

      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          structure: humanInputFormMockData,
        },
        type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetFormStructure`,
      });
      expect(store.dispatch).not.toHaveBeenCalledWith({
        payload: false,
        type: `${FORM_STATE_SLICE_REDUCER_KEY}/onUpdateShouldShowMenu`,
      });
    });

    it('should parse and return data as it is for single section variation + call onUpdateShouldShowMenu', async () => {
      const singleSectionVariationData = {
        ...humanInputFormMockData,
        form_template_version: {
          ...humanInputFormMockData.form_template_version,
          form_elements: [
            {
              element_type: 'Forms::Elements::Layouts::Section',
              form_elements: [
                {
                  element_type: 'Forms::Elements::Layouts::Group',
                },
              ],
            },
          ],
        },
      };

      await actAndRenderHook(singleSectionVariationData);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          structure: singleSectionVariationData,
        },
        type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetFormStructure`,
      });
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: false,
        type: `${FORM_STATE_SLICE_REDUCER_KEY}/onUpdateShouldShowMenu`,
      });
    });

    it('should parse and return data as it is for variations with 2 sections and not call onUpdateShouldShowMenu', async () => {
      const singleSection = {
        id: 1,
        form_elements: [],
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'section',
        },
      };

      const variationsWithTwoSections = {
        ...humanInputFormMockData,
        form_template_version: {
          ...humanInputFormMockData.form_template_version,
          form_elements: [
            {
              element_type: 'Forms::Elements::Layouts::Section',
              form_elements: [
                {
                  element_type: 'Forms::Elements::Layouts::Menu',
                  form_elements: [],
                },
              ],
            },
            singleSection,
          ],
        },
      };

      const artificialMenuGroup = {
        element_type: 'Forms::Elements::Layouts::MenuGroup',
        id: singleSection.id,
        order: 1,
        visible: true,
        config: singleSection.config,
        form_elements: [
          {
            element_type: 'Forms::Elements::Layouts::MenuItem',
            id: singleSection.id,
            order: 1,
            form_elements: singleSection.form_elements,
            visible: true,
            config: singleSection.config,
          },
        ],
      };

      const expectedStructure = {
        ...humanInputFormMockData,
        form_template_version: {
          ...humanInputFormMockData.form_template_version,
          form_elements: [
            {
              element_type: 'Forms::Elements::Layouts::Section',
              form_elements: [
                {
                  element_type: 'Forms::Elements::Layouts::Menu',
                  form_elements: [artificialMenuGroup],
                },
              ],
            },
          ],
        },
      };

      await actAndRenderHook(variationsWithTwoSections);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: {
          structure: expectedStructure,
        },
        type: `${FORM_STATE_SLICE_REDUCER_KEY}/onSetFormStructure`,
      });
      expect(store.dispatch).not.toHaveBeenCalledWith({
        payload: false,
        type: `${FORM_STATE_SLICE_REDUCER_KEY}/onUpdateShouldShowMenu`,
      });
    });
  });
});
