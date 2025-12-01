import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as mockOutboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { generateRouteUrl } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import TopNav from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/TopNav';

jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockLocationAssign = jest.fn();

const defaultProps = {
  electronicFile: mockInboundData.data,
  meta: mockInboundData.meta,
  t: i18nextTranslateStub(),
};

const store = storeFake(mockState);

const mockUpdateViewedMutation = jest
  .fn()
  .mockImplementation(() => Promise.resolve());
const mockUpdateArchivedMutation = jest
  .fn()
  .mockImplementation(() => Promise.resolve());

const cases = [
  ['Back', `${KITMAN_ICON_NAMES.ArrowBack}Icon`],
  ['Mark as unread', `${KITMAN_ICON_NAMES.MarkEmailUnreadOutlined}Icon`],
  ['Archive', `${KITMAN_ICON_NAMES.ArchiveOutlined}Icon`],
  ['Previous', `${KITMAN_ICON_NAMES.ArrowBackIos}Icon`],
  ['Next', `${KITMAN_ICON_NAMES.ArrowForwardIos}Icon`],
];
const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={store}>
      <TopNav {...props} />
    </Provider>
  );

describe('<TopNav />', () => {
  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
  });
  test.each(cases)('%s action renders correctly', (buttonText, iconName) => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: buttonText, hidden: true })
    ).toBeInTheDocument();
    expect(screen.getByTestId(iconName)).toBeInTheDocument();
  });

  it('calls updateViewed on click', async () => {
    const user = userEvent.setup();

    renderComponent({
      ...defaultProps,
      electronicFile: {
        ...defaultProps.electronicFile,
        viewed: true,
      },
    });

    const markIcon = screen.getByTestId(
      `${KITMAN_ICON_NAMES.MarkEmailUnreadOutlined}Icon`
    );
    expect(markIcon).toBeInTheDocument();

    await user.click(markIcon);

    expect(mockUpdateViewedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateViewedMutation).toHaveBeenCalledWith({
      viewed: false,
      inboundElectronicFileIds: [1],
    });

    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      generateRouteUrl({
        selectedMenuItem: MENU_ITEM.inbox,
      })
    );
  });

  it('calls updateArchived on click', async () => {
    const user = userEvent.setup();

    renderComponent();

    const archiveIcon = screen.getByTestId(
      `${KITMAN_ICON_NAMES.ArchiveOutlined}Icon`
    );
    expect(archiveIcon).toBeInTheDocument();

    await user.click(archiveIcon);

    expect(mockUpdateArchivedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateArchivedMutation).toHaveBeenCalledWith({
      archived: true,
      inboundElectronicFileIds: [1],
    });

    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      generateRouteUrl({
        selectedMenuItem: MENU_ITEM.inbox,
      })
    );
  });

  it('calls mockLocationAssign on previous icon click', async () => {
    const user = userEvent.setup();

    renderComponent();

    const prevIcon = screen.getByTestId(
      `${KITMAN_ICON_NAMES.ArrowBackIos}Icon`
    );
    expect(prevIcon).toBeInTheDocument();

    await user.click(prevIcon);

    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      generateRouteUrl({
        id: defaultProps.meta.prev_id,
        selectedMenuItem: MENU_ITEM.inbox,
      })
    );
  });

  it('calls mockLocationAssign on next icon click', async () => {
    const user = userEvent.setup();

    renderComponent();

    const nextIcon = screen.getByTestId(
      `${KITMAN_ICON_NAMES.ArrowForwardIos}Icon`
    );
    expect(nextIcon).toBeInTheDocument();

    await user.click(nextIcon);

    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      generateRouteUrl({
        id: defaultProps.meta.next_id,
        selectedMenuItem: MENU_ITEM.inbox,
      })
    );
  });

  it('shows correct variant of icon when eFile is inbound and viewed', async () => {
    renderComponent({
      ...defaultProps,
      electronicFile: {
        ...mockInboundData.data,
        viewed: true,
      },
    });

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.MarkEmailUnreadOutlined}Icon`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.DraftsOutlined}Icon`)
    ).not.toBeInTheDocument();
  });

  it('shows correct variant of icon when eFile is inbound and archived', async () => {
    renderComponent({
      ...defaultProps,
      electronicFile: {
        ...mockInboundData.data,
        archived: true,
      },
    });

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.UnarchiveOutlined}Icon`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.ArchiveOutlined}Icon`)
    ).not.toBeInTheDocument();
  });

  it('hides correct actions when eFile is outbound', async () => {
    renderComponent({ ...defaultProps, electronicFile: mockOutboundData.data });

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.ArrowBack}Icon`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.MarkEmailUnreadOutlined}Icon`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.DraftsOutlined}Icon`)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.UnarchiveOutlined}Icon`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.ArchiveOutlined}Icon`)
    ).not.toBeInTheDocument();

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.ArrowBackIos}Icon`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.ArrowForwardIos}Icon`)
    ).toBeInTheDocument();
  });

  it('hides correct actions when eFile is null', async () => {
    renderComponent({ ...defaultProps, electronicFile: null });

    expect(
      screen.getByTestId(`${KITMAN_ICON_NAMES.ArrowBack}Icon`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.MarkEmailUnreadOutlined}Icon`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.DraftsOutlined}Icon`)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.UnarchiveOutlined}Icon`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.ArchiveOutlined}Icon`)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.ArrowBackIos}Icon`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.ArrowForwardIos}Icon`)
    ).not.toBeInTheDocument();
  });
});
