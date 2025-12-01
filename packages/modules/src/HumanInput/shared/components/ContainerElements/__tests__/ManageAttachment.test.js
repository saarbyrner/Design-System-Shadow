import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { initialState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import ManageAttachment from '../ManageAttachment';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  formAttachmentSlice: initialState,
  formStateSlice: {
    structure: {
      organisation_id: 6,
    },
  },
};

const props = {
  element: {
    config: {
      data_point: false,
      element_id: 'my_element_id',
      text: 'My value',
      optional: true,
    },
    element_type: 'Forms::Elements::Inputs::Text',
    form_elements: [],
    id: 1,
    order: 1,
    visible: true,
  },
  onChange: () => {},
};

describe('<ManageAttachment/>', () => {
  it('renders', () => {
    render(
      <Provider store={storeFake(defaultStore)}>
        <ManageAttachment {...props}>
          {() => <h3>Attachment Element</h3>}
        </ManageAttachment>
      </Provider>
    );
    expect(screen.getByText('Attachment Element')).toBeInTheDocument();
  });
});
