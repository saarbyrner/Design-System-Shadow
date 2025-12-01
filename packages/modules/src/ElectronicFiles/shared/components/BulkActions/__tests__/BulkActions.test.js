import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { data as contactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import {
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
  useLazyGetUnreadCountQuery,
  useLazySearchInboundElectronicFileListQuery,
  useLazySearchOutboundElectronicFileListQuery,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import BulkActions from '@kitman/modules/src/ElectronicFiles/shared/components/BulkActions';

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockInboundElectronicFiles = inboundData.data;
const mockContacts = contactsData.data;

const defaultProps = {
  rows: mockInboundElectronicFiles,
  onBulkAction: jest.fn(),
  t: i18nextTranslateStub(),
};

const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockUpdateContactsArchivedMutation = jest.fn();
const mockRefreshUnreadCount = jest.fn();
const mockInboundRefreshList = jest.fn();
const mockOutboundRefreshList = jest.fn();

const renderComponent = (props = defaultProps, state = mockState) =>
  render(
    <Provider store={storeFake(state)}>
      <BulkActions {...props} />
    </Provider>
  );

describe('<BulkActions />', () => {
  beforeEach(() => {
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
    useUpdateContactsArchivedMutation.mockReturnValue(
      [mockUpdateContactsArchivedMutation],
      {
        isLoading: false,
      }
    );
    useLazyGetUnreadCountQuery.mockReturnValue([mockRefreshUnreadCount]);
    useLazySearchInboundElectronicFileListQuery.mockReturnValue([
      mockInboundRefreshList,
    ]);
    useLazySearchOutboundElectronicFileListQuery.mockReturnValue([
      mockOutboundRefreshList,
    ]);
  });
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByTestId('DraftsOutlinedIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ArchiveOutlinedIcon')).toBeInTheDocument();
  });

  it('calls updateViewed on click', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByTestId('DraftsOutlinedIcon'));

    expect(mockUpdateViewedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateViewedMutation).toHaveBeenCalledWith({
      viewed: true,
      inboundElectronicFileIds: [1],
    });
  });
  it('calls updateArchived on click', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByTestId('ArchiveOutlinedIcon'));

    expect(mockUpdateArchivedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateArchivedMutation).toHaveBeenCalledWith({
      archived: true,
      inboundElectronicFileIds: [1],
    });
  });

  it('calls updateContactsArchived on click', async () => {
    const user = userEvent.setup();

    renderComponent(
      {
        ...defaultProps,
        rows: mockContacts,
      },
      {
        ...mockState,
        sidebarSlice: {
          ...mockState.sidebarSlice,
          selectedMenuItem: MENU_ITEM.contacts,
        },
      }
    );

    await user.click(screen.getByTestId('ArchiveOutlinedIcon'));

    expect(mockUpdateContactsArchivedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateContactsArchivedMutation).toHaveBeenCalledWith({
      archived: true,
      contactIds: [1],
    });
  });
});
