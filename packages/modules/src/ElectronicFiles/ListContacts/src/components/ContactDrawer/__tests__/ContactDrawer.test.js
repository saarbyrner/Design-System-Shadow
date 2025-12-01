import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import {
  useCreateContactMutation,
  useUpdateContactMutation,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import ContactDrawer from '@kitman/modules/src/ElectronicFiles/ListContacts/src/components/ContactDrawer';

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

let component;

const props = {
  t: i18nextTranslateStub(),
};

let mockDispatch = jest.fn();

const mockCreateContactMutation = jest.fn();
const mockUpdateContactMutation = jest.fn();
const mockMakeContactFavoriteMutation = jest.fn();
const mockDeleteContactFavoriteMutation = jest.fn();

const initialState = { ...mockState.contactDrawerSlice, open: true };

const renderComponent = (state = initialState) => {
  const store = storeFake({
    contactDrawerSlice: state,
  });
  mockDispatch = store.dispatch;
  return render(
    <Provider store={store}>
      <ContactDrawer {...props} />
    </Provider>
  );
};

const rerenderComponent = (state = initialState) => {
  const store = storeFake({
    contactDrawerSlice: state,
  });
  mockDispatch = store.dispatch;
  return component.rerender(
    <Provider store={store}>
      <ContactDrawer {...props} />
    </Provider>
  );
};

describe('<ContactDrawer />', () => {
  beforeEach(() => {
    useCreateContactMutation.mockReturnValue([
      mockCreateContactMutation,
      {
        isLoading: false,
      },
    ]);
    useUpdateContactMutation.mockReturnValue([
      mockUpdateContactMutation,
      {
        isLoading: false,
      },
    ]);
    useMakeContactFavoriteMutation.mockReturnValue([
      mockMakeContactFavoriteMutation,
      {
        isLoading: false,
      },
    ]);
    useDeleteContactFavoriteMutation.mockReturnValue([
      mockDeleteContactFavoriteMutation,
      {
        isLoading: false,
      },
    ]);
  });

  it('renders correctly', () => {
    component = renderComponent();

    expect(screen.getByText('Fax number')).toBeInTheDocument();
    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Company name')).toBeInTheDocument();
  });

  it('calls updateValidation when Create button is clicked', async () => {
    const user = userEvent.setup();

    component = renderComponent();

    const createButton = screen.getByRole('button', { name: /create/i });

    await user.click(createButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        companyName: ['Company name is required'],
        faxNumber: ['Fax number is required'],
        firstName: ['First name is required'],
        lastName: ['Last name is required'],
      },
      type: 'contactDrawerSlice/updateValidation',
    });

    rerenderComponent({
      ...initialState,
      validation: {
        ...initialState.validation,
        errors: {
          companyName: ['Company name is required'],
          faxNumber: ['Fax number is required'],
          firstName: ['First name is required'],
          lastName: ['Last name is required'],
        },
      },
    });

    expect(screen.getByText('Company name is required')).toBeInTheDocument();
    expect(screen.getByText('Fax number is required')).toBeInTheDocument();
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });
});
