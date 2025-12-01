import { screen, within } from '@testing-library/react';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { MemoryRouter } from 'react-router-dom';
import { formMetaDataMockData } from '@kitman/modules/src/FormTemplates/shared/consts';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import PreviewFormTemplate from '../index';

Element.prototype.scrollIntoView = jest.fn();

const mockStructure = {
  name: '',
  form_elements: [
    {
      id: 480048754215,
      visible: true,
      order: 1,
      config: {
        element_id: 'section',
      },
      element_type: 'Forms::Elements::Layouts::Section',
      form_elements: [
        {
          id: 1,
          visible: true,
          order: 1,
          config: {
            element_id: 'f4a12b22-03f2-47a0-a88f-aaa6463c76c6',
          },
          element_type: 'Forms::Elements::Layouts::Menu',
          form_elements: [
            {
              id: 1280765887909,
              visible: true,
              order: 1,
              config: {
                element_id: 'fb9c7835-8a1a-4dca-bf38-e7493fc62782',
                title: 'Section 1',
              },
              element_type: 'Forms::Elements::Layouts::MenuGroup',
              form_elements: [
                {
                  id: 507335438069,
                  visible: true,
                  order: 1,
                  config: {
                    element_id: '84fcca9c-fb9d-4854-b0f2-22ea638b85be',
                    title: 'Sub-section 1.1',
                  },
                  element_type: 'Forms::Elements::Layouts::MenuItem',
                  form_elements: [
                    {
                      id: 916582179382,
                      visible: true,
                      order: 1,
                      config: {
                        element_id: '4344c07d-ce42-49b6-83cc-ceb0c19444f6',
                        optional: true,
                        items: [
                          {
                            color: '#7ab8c5',
                            label: 'Color',
                            value: 'color',
                            score: 6,
                          },
                        ],
                        custom_params: {},
                        text: 'Test single choice',
                      },
                      element_type: 'Forms::Elements::Inputs::SingleChoice',
                      form_elements: [],
                    },
                    {
                      id: 43066711768,
                      visible: true,
                      order: 1,
                      config: {
                        element_id: '74f2916a-1f9a-4358-9e96-2bb90e650ee2',
                        optional: true,
                        items: [
                          {
                            color: '#7ab8c5',
                            label: 'Color',
                            value: 'color',
                            score: 6,
                          },
                        ],
                        custom_params: {},
                        text: 'Test single choice 2',
                      },
                      element_type: 'Forms::Elements::Inputs::SingleChoice',
                      form_elements: [],
                    },
                    {
                      id: 1152791547169,
                      visible: true,
                      order: 1,
                      config: {
                        element_id: 'c5a9a68a-dcba-43fd-80c4-8c66037cfda9',
                        optional: true,
                        items: [
                          {
                            color: '#7ab8c5',
                            label: 'Color',
                            value: 'color',
                            score: 6,
                          },
                        ],
                        custom_params: {},
                        text: 'Test single choice 3',
                      },
                      element_type: 'Forms::Elements::Inputs::SingleChoice',
                      form_elements: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe('<PreviewFormTemplate />', () => {
  const renderComponent = () => {
    renderWithRedux(
      <MemoryRouter>
        <PreviewFormTemplate />
      </MemoryRouter>,
      {
        useGlobalStore: true,
        preloadedState: {
          [REDUCER_KEY]: {
            ...initialState,
            metaData: formMetaDataMockData,
            structure: mockStructure,
          },
          formStateSlice: {
            structure: mockStructure,
            form: {},
            originalForm: {},
            config: { mode: 'EDIT' },
          },
          formValidationSlice: { validation: {} },
          formMenuSlice: {
            menu: {},
            active: { menuGroupIndex: 0, menuItemIndex: 0 },
            drawer: {
              isOpen: true,
            },
          },
        },
      }
    );
  };

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('render form template preview', async () => {
    renderComponent();

    expect(screen.getByText('Section 1')).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: 'Sub-section 1.1',
    });

    within(button).getByText('Sub-section 1.1');
    expect(
      screen.getByRole('heading', {
        name: 'Sub-section 1.1',
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Test single choice')).toBeInTheDocument();
    expect(screen.getByLabelText('Test single choice 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Test single choice 3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /next/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /back/i,
      })
    ).toBeInTheDocument();
  });
});
