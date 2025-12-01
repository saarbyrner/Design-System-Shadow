import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetUnreadCountQuery } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import Sidebar from '@kitman/modules/src/ElectronicFiles/shared/components/Sidebar';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const props = {
  t: i18nextTranslateStub(),
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const { location } = window;

const initialState = mockState.sidebarSlice;

const renderComponent = (state = initialState) =>
  render(
    <Provider
      store={storeFake({
        sidebarSlice: state,
      })}
    >
      <Sidebar {...props} />
    </Provider>
  );

describe('<Sidebar />', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { ...location, assign: jest.fn() };
    useGetUnreadCountQuery.mockReturnValue({
      data: { unread: 25 },
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {
        efile: {
          canManageContacts: true,
        },
      },
      isSuccess: true,
    });
  });
  afterEach(() => {
    window.location = location;
  });

  it('renders correctly', () => {
    renderComponent();

    // inbox
    expect(
      screen.getByRole('menuitem', { name: /inbox/i })
    ).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByTestId('InboxOutlinedIcon')).toBeInTheDocument();

    // sent
    expect(screen.getByRole('menuitem', { name: /sent/i })).toBeInTheDocument();
    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.getByTestId('SendOutlinedIcon')).toBeInTheDocument();

    // selected
    expect(
      document.querySelector('.MuiButtonBase-root.Mui-selected')
    ).toHaveTextContent('Inbox');

    // contacts
    expect(
      screen.getByRole('menuitem', { name: /contacts/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('GroupsOutlinedIcon')).toBeInTheDocument();
  });

  it('does not render contacts if permission.efile.canManageContacts = false', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        efile: {
          canManageContacts: false,
        },
      },
      isSuccess: true,
    });

    renderComponent();

    expect(
      screen.queryByRole('menuitem', { name: /contacts/i })
    ).not.toBeInTheDocument();
  });

  it('renders correctly when not expanded', () => {
    renderComponent({ expanded: false, selectedMenuItem: MENU_ITEM.sent });

    expect(
      screen.queryByRole('menuitem', { name: /inbox/i })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('InboxOutlinedIcon')).toBeInTheDocument();

    expect(
      screen.queryByRole('menuitem', { name: /sent/i })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('SendOutlinedIcon')).toBeInTheDocument();

    expect(
      within(
        document.querySelector('.MuiButtonBase-root.Mui-selected')
      ).getByTestId('SendOutlinedIcon')
    ).toBeInTheDocument();
  });

  it('calls dispatch on expand icon click', async () => {
    const user = userEvent.setup();

    renderComponent();

    const expandIcon = screen.getByTestId('KeyboardDoubleArrowLeftIcon');

    expect(expandIcon).toBeInTheDocument();

    await user.click(expandIcon);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'sidebarSlice/updateExpanded',
    });
  });

  it('calls dispatch on menu item click', async () => {
    const user = userEvent.setup();

    renderComponent();

    const sentMenuItem = screen.getByRole('menuitem', { name: /sent/i });

    expect(sentMenuItem).toBeInTheDocument();

    await user.click(sentMenuItem);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: MENU_ITEM.sent,
      type: 'sidebarSlice/updateSelectedMenuItem',
    });
  });
});
