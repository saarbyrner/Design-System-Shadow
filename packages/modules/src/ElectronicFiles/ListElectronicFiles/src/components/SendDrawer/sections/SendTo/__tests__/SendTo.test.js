import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import {
  SEND_DRAWER_DATA_KEY,
  SEND_TO_KEY,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useFetchFavoriteContactsQuery,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { data as mockFavoriteContacts } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchFavoriteContacts.mock';
import SendTo from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer/sections/SendTo';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockContact = mockFavoriteContacts[0];
const mockHandleChange = jest.fn();
const mockMakeContactFavorite = jest.fn();
const mockDeleteContactFavorite = jest.fn();

const defaultProps = {
  handleChange: mockHandleChange,
  t: i18nextTranslateStub(),
};

const initialState = mockState.sendDrawerSlice;

const renderComponent = (state = initialState, props = defaultProps) =>
  render(
    <Provider
      store={storeFake({
        sendDrawerSlice: state,
      })}
    >
      <SendTo {...props} />
    </Provider>
  );

describe('SendTo section', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        efile: {
          canManageContacts: true,
        },
      },
      isSuccess: true,
    });
    useFetchFavoriteContactsQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useMakeContactFavoriteMutation.mockReturnValue([
      mockMakeContactFavorite,
      {
        isLoading: false,
      },
    ]);
    useDeleteContactFavoriteMutation.mockReturnValue([
      mockDeleteContactFavorite,
      {
        isLoading: false,
      },
    ]);
  });
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Sending to')).toBeInTheDocument();
    expect(screen.getByLabelText('Saved contact')).toBeInTheDocument();
    expect(screen.getByLabelText('New contact')).toBeInTheDocument();
    expect(screen.getByLabelText('Saved contact')).toBeChecked();
  });

  it('calls updateData when a contact is selected', async () => {
    const user = userEvent.setup();

    useFetchFavoriteContactsQuery.mockReturnValue({
      data: mockFavoriteContacts,
      error: false,
      isLoading: false,
    });

    renderComponent();

    const contactDropdown = screen.getByLabelText('To');

    await user.click(contactDropdown);

    await user.click(
      screen.getByText(
        `${mockContact.first_name} ${mockContact.last_name} - ${mockContact.company_name}`
      )
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith(
      SEND_DRAWER_DATA_KEY.savedContact,
      mockContact
    );
  });

  it('calls makeFavoriteContact when a contact is made favorite', async () => {
    const user = userEvent.setup();

    useFetchFavoriteContactsQuery.mockReturnValue({
      data: mockFavoriteContacts,
      error: false,
      isLoading: false,
    });

    renderComponent();

    const contactDropdown = screen.getByLabelText('To');

    await user.click(contactDropdown);

    const favoriteCheckbox = screen.getByRole('checkbox');

    expect(favoriteCheckbox).toBeInTheDocument();
    expect(favoriteCheckbox).not.toBeChecked();

    await user.click(screen.getByRole('checkbox'));

    expect(mockMakeContactFavorite).toHaveBeenCalledTimes(1);
    expect(mockMakeContactFavorite).toHaveBeenCalledWith({ itemId: 1 });
  });

  it('calls deleteFavoriteContact when a favorited contact is unfavorited', async () => {
    const user = userEvent.setup();

    useFetchFavoriteContactsQuery.mockReturnValue({
      data: [
        {
          ...mockFavoriteContacts[0],
          favorite: true,
        },
      ],
      error: false,
      isLoading: false,
    });

    renderComponent();

    const contactDropdown = screen.getByLabelText('To');

    await user.click(contactDropdown);

    const favoriteCheckbox = screen.getByRole('checkbox');

    expect(favoriteCheckbox).toBeInTheDocument();
    expect(favoriteCheckbox).toBeChecked();

    await user.click(screen.getByRole('checkbox'));

    expect(mockDeleteContactFavorite).toHaveBeenCalledTimes(1);
    expect(mockDeleteContactFavorite).toHaveBeenCalledWith({
      itemId: 1,
    });
  });

  it('calls updateData when new contact radio button is selected', async () => {
    const user = userEvent.setup();

    renderComponent();

    const newContactRadioButton = screen.getByLabelText('New contact');

    await user.click(newContactRadioButton);

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith(
      SEND_DRAWER_DATA_KEY.sendTo,
      SEND_DRAWER_DATA_KEY.newContact
    );
  });

  it('displays new contact fields when state is new contact', async () => {
    renderComponent({
      ...initialState,
      data: {
        ...initialState.data,
        sendTo: SEND_TO_KEY.newContact,
      },
    });

    expect(screen.getByLabelText('Fax number')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Company name')).toBeInTheDocument();
  });

  describe('Permissions', () => {
    it('hides the New message button when permissions.efile.canManageContacts is false', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          efile: {
            canManageContacts: false,
          },
        },
        isSuccess: true,
      });

      renderComponent();

      expect(screen.queryByLabelText('New contact')).not.toBeInTheDocument();
    });
  });
});
