import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { parseFormInputElement } from '../form';

const defaultFormStateSlice = {
  form: {
    1: true,
  },
  elements: {
    my_element_id: {
      config: {
        data_point: false,
        element_id: 'my_element_id',
        text: 'My value',
      },
      element_type: 'Forms::Elements::Inputs::Text',
      form_elements: [],
      id: 1,
      order: 1,
      visible: true,
    },
  },
  config: {
    mode: 'EDIT',
  },
};
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

const renderComponent = (children) => {
  return render(
    <Provider
      store={storeFake({
        formStateSlice: {
          ...defaultFormStateSlice,
        },
        formValidationSlice: {
          validation: { 1: { status: 'VALID' } },
        },
      })}
    >
      {children}
    </Provider>
  );
};
describe('form', () => {
  describe('parseFormInputElement', () => {
    describe('groups', () => {
      const createGroupInput = (type) => {
        const input = {
          mode: 'VIEW',
          element: {
            id: 24165,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'home_address_group',
              custom_params: {
                type,
                columns: 2,
              },
              repeatable: false,
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
        };
        return input;
      };

      const gridClass = 'MuiGrid-root';
      const accordionClass = 'MuiAccordion-root';

      it('should return the group without an accordion', () => {
        const input = createGroupInput('address');
        const { container } = renderComponent(parseFormInputElement(input));

        expect(container.getElementsByClassName(gridClass).length).toBe(1);
        expect(container.getElementsByClassName(accordionClass).length).toBe(0);
      });

      it('should return the group wrapped in an accordion', () => {
        const input = createGroupInput('collapsible');
        const { container } = renderComponent(parseFormInputElement(input));

        expect(container.getElementsByClassName(gridClass).length).toBe(1);
        expect(container.getElementsByClassName(accordionClass).length).toBe(1);
      });
    });
  });
});
